const load = async ({ locals }) => {
  return {
    user: locals.session?.user,
    organization: locals.organization,
    subscription: locals.subscription
  };
};
export {
  load
};
