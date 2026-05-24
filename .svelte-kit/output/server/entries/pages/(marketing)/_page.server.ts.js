import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (locals.session) {
    redirect(302, "/dashboard");
  }
};
export {
  load
};
