import { e as error, j as json } from './index-wpIsICWW.js';

const GET = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  return json({
    subscription: locals.subscription,
    organization: locals.organization
  });
};

export { GET };
//# sourceMappingURL=_server.ts-Dab5S_hY.js.map
