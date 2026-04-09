import Stripe from "stripe";
import { error } from "@sveltejs/kit";
import { b as private_env } from "./shared-server.js";
const STRIPE_SECRET_KEY = private_env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = private_env.STRIPE_WEBHOOK_SECRET;
const STRIPE_STARTER_MONTHLY = private_env.STRIPE_STARTER_MONTHLY_PRICE_ID;
const STRIPE_STARTER_YEARLY = private_env.STRIPE_STARTER_YEARLY_PRICE_ID;
const STRIPE_GROWTH_MONTHLY = private_env.STRIPE_GROWTH_MONTHLY_PRICE_ID;
const STRIPE_GROWTH_YEARLY = private_env.STRIPE_GROWTH_YEARLY_PRICE_ID;
if (!STRIPE_SECRET_KEY) {
  console.error("[Stripe] Missing STRIPE_SECRET_KEY in environment variables");
  throw new Error("Missing STRIPE_SECRET_KEY in environment variables");
}
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  typescript: true
});
function getPriceId(tier, interval) {
  const map = {
    "starter-monthly": STRIPE_STARTER_MONTHLY,
    "starter-yearly": STRIPE_STARTER_YEARLY,
    "growth-monthly": STRIPE_GROWTH_MONTHLY,
    "growth-yearly": STRIPE_GROWTH_YEARLY
  };
  const priceId = map[`${tier}-${interval}`];
  if (!priceId) throw error(500, `Missing Stripe price ID for ${tier} ${interval}`);
  return priceId;
}
function getWebhookSecret() {
  if (!STRIPE_WEBHOOK_SECRET) {
    throw error(500, "Missing Stripe webhook secret");
  }
  return STRIPE_WEBHOOK_SECRET;
}
function constructWebhookEvent(body, signature) {
  try {
    return stripe.webhooks.constructEvent(body, signature, getWebhookSecret());
  } catch (err) {
    console.error("[Stripe] Webhook signature verification failed:", err);
    throw error(400, "Invalid webhook signature");
  }
}
async function createCheckoutSession(customerEmail, tier, interval, organizationId, successUrl, cancelUrl) {
  const priceId = getPriceId(tier, interval);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
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
  return session.url;
}
async function createPortalSession(stripeCustomerId, returnUrl) {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl
  });
  return session.url;
}
export {
  constructWebhookEvent,
  createCheckoutSession,
  createPortalSession,
  getPriceId,
  getWebhookSecret,
  stripe
};
