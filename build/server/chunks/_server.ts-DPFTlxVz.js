import { e as error, j as json } from './index-wpIsICWW.js';
import { stripe } from './stripe-DFaJIGJ7.js';
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

const POST = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  const [existingSub] = await db.select().from(subscriptions).where(eq(subscriptions.organizationId, orgId)).limit(1);
  if (existingSub?.stripeCustomerId) {
    const stripeSubs = await stripe.subscriptions.list({
      customer: existingSub.stripeCustomerId,
      status: "active",
      limit: 1
    });
    if (stripeSubs.data.length > 0) {
      const stripeSub = stripeSubs.data[0];
      const currentPeriodEnd = stripeSub.items.data[0]?.current_period_end ? new Date(stripeSub.items.data[0].current_period_end * 1e3) : null;
      await db.update(subscriptions).set({
        status: "active",
        stripeSubscriptionId: stripeSub.id,
        currentPeriodEnd,
        cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(subscriptions.organizationId, orgId));
      return json({ status: "active", synced: true });
    }
  } else {
    const email = locals.session.user.email;
    const escapedEmail = email.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const customers = await stripe.customers.search({
      query: `email:"${escapedEmail}"`
    });
    if (customers.data.length > 0) {
      const customer = customers.data[0];
      const stripeSubs = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
        limit: 1
      });
      if (stripeSubs.data.length > 0) {
        const stripeSub = stripeSubs.data[0];
        const currentPeriodEnd = stripeSub.items.data[0]?.current_period_end ? new Date(stripeSub.items.data[0].current_period_end * 1e3) : null;
        if (existingSub) {
          await db.update(subscriptions).set({
            status: "active",
            stripeCustomerId: customer.id,
            stripeSubscriptionId: stripeSub.id,
            currentPeriodEnd,
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(subscriptions.organizationId, orgId));
        } else {
          await db.insert(subscriptions).values({
            organizationId: orgId,
            status: "active",
            stripeCustomerId: customer.id,
            stripeSubscriptionId: stripeSub.id,
            currentPeriodEnd,
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end
          });
        }
        return json({ status: "active", synced: true });
      }
    }
  }
  return json({ status: existingSub?.status ?? "no_subscription", synced: false });
};

export { POST };
//# sourceMappingURL=_server.ts-DPFTlxVz.js.map
