import { e as error, j as json } from './index-wpIsICWW.js';
import { constructWebhookEvent, stripe } from './stripe-DFaJIGJ7.js';
import { d as db, s as subscriptions, e as eq } from './index2-CrtZLkpF.js';
import 'stripe';
import './shared-server-DaWdgxVh.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';

const POST = async ({ request }) => {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    throw error(400, "Missing stripe-signature header");
  }
  const event = constructWebhookEvent(body, signature);
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
    }
  } catch (err) {
    console.error(`[Stripe] Error handling ${event.type}:`, err);
    return json({ received: true, warning: `Handler error: ${event.type}` });
  }
  return json({ received: true });
};
async function handleCheckoutSessionCompleted(session) {
  const organizationId = session.metadata?.organizationId;
  if (!organizationId) {
    console.error("[Stripe] No organizationId in checkout session metadata");
    return;
  }
  const stripeSub = await stripe.subscriptions.retrieve(session.subscription);
  const currentPeriodEnd = stripeSub.items.data[0]?.current_period_end ? new Date(stripeSub.items.data[0].current_period_end * 1e3) : null;
  const [existingSub] = await db.select().from(subscriptions).where(eq(subscriptions.organizationId, organizationId)).limit(1);
  console.log(`[Stripe] Activating subscription for org ${organizationId} (sub ${stripeSub.id})`);
  if (existingSub) {
    await db.update(subscriptions).set({
      status: "active",
      stripeCustomerId: session.customer,
      stripeSubscriptionId: stripeSub.id,
      currentPeriodEnd,
      cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(subscriptions.organizationId, organizationId));
  } else {
    await db.insert(subscriptions).values({
      organizationId,
      status: "active",
      stripeCustomerId: session.customer,
      stripeSubscriptionId: stripeSub.id,
      currentPeriodEnd,
      cancelAtPeriodEnd: stripeSub.cancel_at_period_end
    });
  }
  console.log(`[Stripe] Subscription activated for org ${organizationId}`);
}
async function handleSubscriptionUpdated(subscription) {
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
  const status = mapStripeStatus(subscription.status);
  const currentPeriodEnd = subscription.items.data[0]?.current_period_end ? new Date(subscription.items.data[0].current_period_end * 1e3) : null;
  await db.update(subscriptions).set({
    status,
    currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq(subscriptions.organizationId, organizationId));
  console.log(
    `[Stripe] Subscription updated for org ${organizationId}: status=${status}, cancelAtPeriodEnd=${subscription.cancel_at_period_end}`
  );
}
async function handleSubscriptionDeleted(subscription) {
  const existingSub = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeSubscriptionId, subscription.id)
  });
  if (!existingSub) {
    console.error(
      `[Stripe] No subscription found in DB for stripeSubscriptionId ${subscription.id}`
    );
    return;
  }
  await db.update(subscriptions).set({
    status: "canceled",
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq(subscriptions.organizationId, existingSub.organizationId));
  console.log(`[Stripe] Subscription canceled for org ${existingSub.organizationId}`);
}
async function handleInvoicePaymentFailed(invoice) {
  const customerId = invoice.customer;
  const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.stripeCustomerId, customerId)).limit(1);
  if (!sub) {
    console.error(`[Stripe] No subscription found for customer ${customerId}`);
    return;
  }
  await db.update(subscriptions).set({
    status: "past_due",
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq(subscriptions.organizationId, sub.organizationId));
  console.log(`[Stripe] Payment failed for org ${sub.organizationId}`);
}
async function handleInvoicePaymentSucceeded(invoice) {
  const customerId = invoice.customer;
  const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.stripeCustomerId, customerId)).limit(1);
  if (!sub) {
    console.error(`[Stripe] No subscription found for customer ${customerId}`);
    return;
  }
  if (sub.status === "past_due" || sub.status === "trialing") {
    await db.update(subscriptions).set({
      status: "active",
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(subscriptions.organizationId, sub.organizationId));
    console.log(`[Stripe] Payment recovered for org ${sub.organizationId}`);
  }
}
function mapStripeStatus(stripeStatus) {
  const statusMap = {
    active: "active",
    past_due: "past_due",
    unpaid: "past_due",
    canceled: "canceled",
    incomplete: "incomplete",
    incomplete_expired: "expired",
    trialing: "trialing",
    paused: "paused"
  };
  return statusMap[stripeStatus] ?? stripeStatus;
}

export { POST };
//# sourceMappingURL=_server.ts-DFhv4cM4.js.map
