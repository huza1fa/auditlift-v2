import Stripe from 'stripe';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;
const STRIPE_PRICE_MONTHLY = env.STRIPE_PRICE_MONTHLY;
const STRIPE_PRICE_YEARLY = env.STRIPE_PRICE_YEARLY;

if (!STRIPE_SECRET_KEY) {
	console.error('[Stripe] Missing STRIPE_SECRET_KEY in environment variables');
	throw new Error('Missing STRIPE_SECRET_KEY in environment variables');
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
	typescript: true
});

export type PlanInterval = 'monthly' | 'yearly';

export function getPriceId(interval: PlanInterval): string {
	const priceId = interval === 'yearly' ? STRIPE_PRICE_YEARLY : STRIPE_PRICE_MONTHLY;
	if (!priceId) {
		throw error(500, `Missing Stripe price ID for ${interval} interval`);
	}
	return priceId;
}

export function getWebhookSecret(): string {
	if (!STRIPE_WEBHOOK_SECRET) {
		throw error(500, 'Missing Stripe webhook secret');
	}
	return STRIPE_WEBHOOK_SECRET;
}

export function constructWebhookEvent(body: string | Buffer, signature: string): Stripe.Event {
	try {
		return stripe.webhooks.constructEvent(body, signature, getWebhookSecret());
	} catch (err) {
		console.error('[Stripe] Webhook signature verification failed:', err);
		throw error(400, 'Invalid webhook signature');
	}
}

export async function createCheckoutSession(
	customerEmail: string,
	interval: PlanInterval,
	organizationId: string,
	successUrl: string,
	cancelUrl: string
): Promise<string> {
	const priceId = getPriceId(interval);

	const session = await stripe.checkout.sessions.create({
		mode: 'subscription',
		line_items: [{ price: priceId, quantity: 1 }],
		customer_email: customerEmail,
		success_url: `${successUrl}&session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: cancelUrl,
		metadata: {
			organizationId
		},
		subscription_data: {
			metadata: {
				organizationId
			}
		}
	});

	return session.url!;
}

export async function createPortalSession(
	stripeCustomerId: string,
	returnUrl: string
): Promise<string> {
	const session = await stripe.billingPortal.sessions.create({
		customer: stripeCustomerId,
		return_url: returnUrl
	});

	return session.url;
}
