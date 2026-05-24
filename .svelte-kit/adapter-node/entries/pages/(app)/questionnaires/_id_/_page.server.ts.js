import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (!locals.session) redirect(302, "/login");
  return {
    hasActivePaidAccess: locals.subscription?.status === "active"
  };
};
export {
  load
};
