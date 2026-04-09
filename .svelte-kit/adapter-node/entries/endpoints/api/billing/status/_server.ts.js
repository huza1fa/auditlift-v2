import { error, json } from "@sveltejs/kit";
const GET = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  return json({
    subscription: locals.subscription,
    organization: locals.organization
  });
};
export {
  GET
};
