import { e as error, j as json } from './index-wpIsICWW.js';
import { z } from 'zod';
import { d as db, u as userOrganizations, e as eq, o as organizations } from './index2-BGADDK3r.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const ProfileSchema = z.object({
  dataTypes: z.array(z.enum(["pii", "phi", "financial", "business"])).default([]),
  customerType: z.enum(["b2b", "b2c", "enterprise", "internal"]),
  geoReach: z.enum(["us", "eu", "global"]),
  productType: z.enum(["saas", "api", "mobile", "internal"])
});
const POST = async ({ request, locals }) => {
  if (!locals.session) throw error(401, "Unauthorized");
  const result = ProfileSchema.safeParse(await request.json());
  if (!result.success) throw error(400, "Invalid input");
  const { dataTypes, customerType, geoReach, productType } = result.data;
  const [userOrg] = await db.select().from(userOrganizations).where(eq(userOrganizations.userId, locals.session.user.id)).limit(1);
  if (!userOrg) throw error(400, "No organization found");
  await db.update(organizations).set({ dataTypes, customerType, geoReach, productType }).where(eq(organizations.id, userOrg.organizationId));
  return json({ ok: true });
};

export { POST };
//# sourceMappingURL=_server.ts-DM6UcFuG.js.map
