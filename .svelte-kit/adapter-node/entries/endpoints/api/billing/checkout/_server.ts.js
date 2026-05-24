import { error, json } from "@sveltejs/kit";
import { createCheckoutSession } from "../../../../../chunks/stripe.js";
import { b as private_env } from "../../../../../chunks/shared-server.js";
const POST = async ({ locals, request }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const { plan, interval } = await request.json();
  if (interval !== "monthly" && interval !== "yearly") {
    throw error(400, 'Invalid interval. Must be "monthly" or "yearly"');
  }
  if (plan !== "starter" && plan !== "growth") {
    throw error(400, 'Invalid plan. Must be "starter" or "growth"');
  }
  const origin = private_env.ORIGIN || "http://localhost:5173";
  const cleanOrigin = origin.replace(/\/$/, "");
  const checkoutUrl = await createCheckoutSession(
    locals.session.user.email,
    plan,
    interval,
    locals.organizationId,
    `${cleanOrigin}/dashboard?subscribed=true`,
    `${cleanOrigin}/settings/billing`
  );
  return json({ url: checkoutUrl });
};
export {
  POST
};
