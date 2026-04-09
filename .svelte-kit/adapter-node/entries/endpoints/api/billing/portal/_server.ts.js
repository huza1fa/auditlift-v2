import { error, json } from "@sveltejs/kit";
import { createPortalSession } from "../../../../../chunks/stripe.js";
import { b as private_env } from "../../../../../chunks/shared-server.js";
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
export {
  POST
};
