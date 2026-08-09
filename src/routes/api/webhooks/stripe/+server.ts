import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type Stripe from 'stripe';
import { constructWebhookEvent, stripe } from '$lib/server/stripe';
import { db } from '$lib/server/db';
import { subscriptions, userOrganizations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { captureServerEvent } from '$lib/server/posthog';

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
		// Return a non-2xx status so Stripe retries the webhook.
		throw error(500, `Handler error: ${event.type}`);
	}

	return json({ received: true });
};

async function getOrgOwnerId(orgId: string): Promise<string | null> {
	const [userOrg] = await db
		.select()
		.from(userOrganizations)
		.where(eq(userOrganizations.organizationId, orgId))
		.limit(1);
	return userOrg?.userId ?? null;
}

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
	const status = mapStripeStatus(stripeSub.status);

	// Check if subscription exists for this org
	const [existingSub] = await db
		.select()
		.from(subscriptions)
		.where(eq(subscriptions.organizationId, organizationId))
		.limit(1);

	console.log(
		`[Stripe] Recording subscription for org ${organizationId} (sub ${stripeSub.id}, ${status})`
	);

	if (existingSub) {
		await db
			.update(subscriptions)
			.set({
				status,
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
			status,
			stripeCustomerId: session.customer as string,
			stripeSubscriptionId: stripeSub.id,
			currentPeriodEnd,
			cancelAtPeriodEnd: stripeSub.cancel_at_period_end
		});
	}

	console.log(`[Stripe] Subscription recorded for org ${organizationId} with status=${status}`);

	// Analytics
	const ownerId = await getOrgOwnerId(organizationId);
	if (ownerId) {
		const amount = stripeSub.items.data[0]?.plan?.amount ?? 0;
		await captureServerEvent({
			event: 'subscription_created',
			distinctId: ownerId,
			properties: {
				org_id: organizationId,
				amount: amount / 100,
				currency: stripeSub.currency?.toUpperCase() ?? 'USD',
				interval: stripeSub.items.data[0]?.plan?.interval ?? 'month',
				mrr: stripeSub.items.data[0]?.plan?.interval === 'year' ? amount / 100 / 12 : amount / 100
			},
			groups: { organization: organizationId }
		});
	}
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
	// Always resolve org from DB by stripeSubscriptionId — never trust metadata alone
	const existingSub = await db.query.subscriptions.findFirst({
		where: eq(subscriptions.stripeSubscriptionId, subscription.id)
	});

	if (!existingSub) {
		console.error(
			`[Stripe] No subscription found in DB for stripeSubscriptionId ${subscription.id}`
		);
		return;
	}

	const organizationId = existingSub.organizationId;
	const previousStatus = existingSub.status;
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

	// Analytics
	const ownerId = await getOrgOwnerId(organizationId);
	if (ownerId && previousStatus !== status) {
		await captureServerEvent({
			event: 'subscription_updated',
			distinctId: ownerId,
			properties: {
				org_id: organizationId,
				previous_status: previousStatus,
				new_status: status,
				cancel_at_period_end: subscription.cancel_at_period_end
			},
			groups: { organization: organizationId }
		});
	}
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
	// Always resolve org from DB by stripeSubscriptionId — never trust metadata alone
	const existingSub = await db.query.subscriptions.findFirst({
		where: eq(subscriptions.stripeSubscriptionId, subscription.id)
	});

	if (!existingSub) {
		console.error(
			`[Stripe] No subscription found in DB for stripeSubscriptionId ${subscription.id}`
		);
		return;
	}

	await db
		.update(subscriptions)
		.set({
			status: 'canceled',
			updatedAt: new Date()
		})
		.where(eq(subscriptions.organizationId, existingSub.organizationId));

	console.log(`[Stripe] Subscription canceled for org ${existingSub.organizationId}`);

	// Analytics
	const ownerId = await getOrgOwnerId(existingSub.organizationId);
	if (ownerId) {
		await captureServerEvent({
			event: 'subscription_canceled',
			distinctId: ownerId,
			properties: {
				org_id: existingSub.organizationId,
				previous_status: existingSub.status
			},
			groups: { organization: existingSub.organizationId }
		});
	}
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

	// Analytics
	const ownerId = await getOrgOwnerId(sub.organizationId);
	if (ownerId) {
		await captureServerEvent({
			event: 'payment_failed',
			distinctId: ownerId,
			properties: {
				org_id: sub.organizationId,
				amount: (invoice.amount_due ?? 0) / 100,
				currency: invoice.currency?.toUpperCase() ?? 'USD',
				attempt_count: invoice.attempt_count ?? 1
			},
			groups: { organization: sub.organizationId }
		});
	}
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

		// Analytics
		const ownerId = await getOrgOwnerId(sub.organizationId);
		if (ownerId) {
			await captureServerEvent({
				event: 'payment_recovered',
				distinctId: ownerId,
				properties: {
					org_id: sub.organizationId,
					amount: (invoice.amount_paid ?? 0) / 100,
					currency: invoice.currency?.toUpperCase() ?? 'USD',
					previous_status: sub.status
				},
				groups: { organization: sub.organizationId }
			});
		}
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
