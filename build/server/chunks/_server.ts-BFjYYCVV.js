import { e as error, j as json } from './index-wpIsICWW.js';
import { createPortalSession } from './stripe-DFaJIGJ7.js';
import { b as private_env } from './shared-server-DaWdgxVh.js';
import 'stripe';

const POST = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const stripeCustomerId = locals.subscription?.stripeCustomerId;
  if (!stripeCustomerId) {
    throw error(400, "No Stripe customer found for this organization");
  }
  const origin = private_env.ORIGIN || "http://localhost:5173";
  const cleanOrigin = origin.replace(/\/$/, "");
  const portalUrl = await createPortalSession(stripeCustomerId, `${cleanOrigin}/settings/billing`);
  return json({ url: portalUrl });
};

export { POST };
//# sourceMappingURL=_server.ts-BFjYYCVV.js.map
