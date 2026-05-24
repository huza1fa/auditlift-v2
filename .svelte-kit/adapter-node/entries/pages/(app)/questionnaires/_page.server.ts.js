import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (!locals.session) redirect(302, "/login");
  return {
    subscription: locals.subscription,
    hasActivePaidAccess: locals.subscription?.status === "active"
  };
};
export {
  load
};
