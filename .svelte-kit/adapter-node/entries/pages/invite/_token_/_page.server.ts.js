import { error } from "@sveltejs/kit";
const load = async ({ params, locals }) => {
  const token = params.token;
  if (!token) {
    throw error(400, "Invalid invitation");
  }
  return {
    token,
    isLoggedIn: !!locals.session
  };
};
export {
  load
};
