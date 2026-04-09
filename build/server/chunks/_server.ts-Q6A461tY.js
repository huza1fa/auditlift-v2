import { e as error, j as json } from './index-wpIsICWW.js';
import { d as db, u as userOrganizations, e as eq, f as frameworks, b as organizationFrameworks } from './index2-C4rYKX5Z.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const POST = async ({ request, locals }) => {
  if (!locals.session) throw error(401, "Unauthorized");
  const { frameworkSlug } = await request.json();
  const [userOrg] = await db.select().from(userOrganizations).where(eq(userOrganizations.userId, locals.session.user.id)).limit(1);
  if (!userOrg) throw error(400, "No organization found");
  const [framework] = await db.select().from(frameworks).where(eq(frameworks.slug, frameworkSlug)).limit(1);
  if (!framework) throw error(404, "Framework not found");
  await db.insert(organizationFrameworks).values({
    organizationId: userOrg.organizationId,
    frameworkId: framework.id
  }).onConflictDoNothing();
  return json({ ok: true });
};

export { POST };
//# sourceMappingURL=_server.ts-Q6A461tY.js.map
