import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type Stripe from 'stripe';
import { constructWebhookEvent, stripe } from '$lib/server/stripe';
import { db } from '$lib/server/db';
import { subscriptions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	if (!signature) {
		throw error(400, 'Missing stripe-signature header');
	}

	const event = constructWebhookEvent(body, signature);

	try {
		switch (event.type) {
			case 'checkout.session.completed':
				await handleCheckoutSessionCompleted(event.data.object);
				break;
			case 'customer.subscription.updated':
				await handleSubscriptionUpdated(event.data.object);
				break;
			case 'customer.subscription.deleted':
				await handleSubscriptionDeleted(event.data.object);
				break;
			case 'invoice.payment_failed':
				await handleInvoicePaymentFailed(event.data.object);
				break;
			case 'invoice.payment_succeeded':
				await handleInvoicePaymentSucceeded(event.data.object);
				break;
		}
	} catch (err) {
		console.error(`[Stripe] Error handling ${event.type}:`, err);
		return json({ received: true, warning: `Handler error: ${event.type}` });
	}

	return json({ received: true });
};

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
	const organizationId = session.metadata?.organizationId;
	if (!organizationId) {
		console.error('[Stripe] No organizationId in checkout session metadata');
		return;
	}

	// Get the full subscription from Stripe
	const stripeSub = await stripe.subscriptions.retrieve(session.subscription as string);

	const currentPeriodEnd = stripeSub.items.data[0]?.current_period_end
		? new Date(stripeSub.items.data[0].current_period_end * 1000)
		: null;

	// Check if subscription exists for this org
	const [existingSub] = await db
		.select()
		.from(subscriptions)
		.where(eq(subscriptions.organizationId, organizationId))
		.limit(1);

	console.log(`[Stripe] Activating subscription for org ${organizationId} (sub ${stripeSub.id})`);

	if (existingSub) {
		await db
			.update(subscriptions)
			.set({
				status: 'active',
				stripeCustomerId: session.customer as string,
				stripeSubscriptionId: stripeSub.id,
				currentPeriodEnd,
				cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
				updatedAt: new Date()
			})
			.where(eq(subscriptions.organizationId, organizationId));
	} else {
		await db.insert(subscriptions).values({
			organizationId,
			status: 'active',
			stripeCustomerId: session.customer as string,
			stripeSubscriptionId: stripeSub.id,
			currentPeriodEnd,
			cancelAtPeriodEnd: stripeSub.cancel_at_period_end
		});
	}

	console.log(`[Stripe] Subscription activated for org ${organizationId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
	const metadataOrgId = subscription.metadata?.organizationId;
	if (!metadataOrgId) {
		console.error('[Stripe] No organizationId in subscription metadata');
		return;
	}

	// Cross-validate: look up by stripeSubscriptionId to prevent metadata manipulation
	const existingSub = await db.query.subscriptions.findFirst({
		where: eq(subscriptions.stripeSubscriptionId, subscription.id)
	});

	if (existingSub && existingSub.organizationId !== metadataOrgId) {
		console.error(
			`[Stripe Webhook] organizationId mismatch for subscription ${subscription.id}: metadata says ${metadataOrgId}, DB says ${existingSub.organizationId}`
		);
		return;
	}

	// Prefer the DB-verified organizationId when one exists
	const organizationId = existingSub?.organizationId ?? metadataOrgId;

	const status = mapStripeStatus(subscription.status);
	const currentPeriodEnd = subscription.items.data[0]?.current_period_end
		? new Date(subscription.items.data[0].current_period_end * 1000)
		: null;

	await db
		.update(subscriptions)
		.set({
			status,
			currentPeriodEnd,
			cancelAtPeriodEnd: subscription.cancel_at_period_end,
			updatedAt: new Date()
		})
		.where(eq(subscriptions.organizationId, organizationId));

	console.log(
		`[Stripe] Subscription updated for org ${organizationId}: status=${status}, cancelAtPeriodEnd=${subscription.cancel_at_period_end}`
	);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
	const organizationId = subscription.metadata?.organizationId;
	if (!organizationId) {
		console.error('[Stripe] No organizationId in subscription metadata');
		return;
	}

	await db
		.update(subscriptions)
		.set({
			status: 'canceled',
			updatedAt: new Date()
		})
		.where(eq(subscriptions.organizationId, organizationId));

	console.log(`[Stripe] Subscription canceled for org ${organizationId}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
	const customerId = invoice.customer as string;

	// Find the subscription by customer ID
	const [sub] = await db
		.select()
		.from(subscriptions)
		.where(eq(subscriptions.stripeCustomerId, customerId))
		.limit(1);

	if (!sub) {
		console.error(`[Stripe] No subscription found for customer ${customerId}`);
		return;
	}

	await db
		.update(subscriptions)
		.set({
			status: 'past_due',
			updatedAt: new Date()
		})
		.where(eq(subscriptions.organizationId, sub.organizationId));

	console.log(`[Stripe] Payment failed for org ${sub.organizationId}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
	const customerId = invoice.customer as string;

	// Find the subscription by customer ID
	const [sub] = await db
		.select()
		.from(subscriptions)
		.where(eq(subscriptions.stripeCustomerId, customerId))
		.limit(1);

	if (!sub) {
		console.error(`[Stripe] No subscription found for customer ${customerId}`);
		return;
	}

	// Only update if currently past_due or trialing
	if (sub.status === 'past_due' || sub.status === 'trialing') {
		await db
			.update(subscriptions)
			.set({
				status: 'active',
				updatedAt: new Date()
			})
			.where(eq(subscriptions.organizationId, sub.organizationId));

		console.log(`[Stripe] Payment recovered for org ${sub.organizationId}`);
	}
}

function mapStripeStatus(stripeStatus: string): string {
	const statusMap: Record<string, string> = {
		active: 'active',
		past_due: 'past_due',
		unpaid: 'past_due',
		canceled: 'canceled',
		incomplete: 'incomplete',
		incomplete_expired: 'expired',
		trialing: 'trialing',
		paused: 'paused'
	};

	return statusMap[stripeStatus] ?? stripeStatus;
}
