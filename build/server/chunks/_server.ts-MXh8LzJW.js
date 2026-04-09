import { e as error, j as json } from './index-wpIsICWW.js';
import { d as db, u as userOrganizations, e as eq, o as organizations } from './index2-C4rYKX5Z.js';
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
  const { teamSize } = await request.json();
  const [userOrg] = await db.select().from(userOrganizations).where(eq(userOrganizations.userId, locals.session.user.id)).limit(1);
  if (!userOrg) throw error(400, "No organization found");
  await db.update(organizations).set({ teamSize }).where(eq(organizations.id, userOrg.organizationId));
  return json({ ok: true });
};

export { POST };
//# sourceMappingURL=_server.ts-MXh8LzJW.js.map
