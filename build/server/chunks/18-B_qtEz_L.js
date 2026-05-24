import { r as redirect } from './index-wpIsICWW.js';
import { d as db, o as organizations, e as eq, u as userOrganizations, i as and, v as organizationInvitations } from './index2-CrtZLkpF.js';
import { h as hasActivePaidAccess, T as TRIAL_MEMBER_LIMIT } from './billing-CuJKZCaE.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const load = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) {
    redirect(302, "/login");
  }
  const orgId = locals.organizationId;
  const [org] = await db.select({
    id: organizations.id,
    name: organizations.name,
    domain: organizations.domain
  }).from(organizations).where(eq(organizations.id, orgId)).limit(1);
  const [currentMembership] = await db.select({
    role: userOrganizations.role,
    userId: userOrganizations.userId
  }).from(userOrganizations).where(
    and(
      eq(userOrganizations.organizationId, orgId),
      eq(userOrganizations.userId, locals.session.user.id)
    )
  ).limit(1);
  const members = await db.select({
    id: userOrganizations.id,
    userId: userOrganizations.userId,
    role: userOrganizations.role,
    createdAt: userOrganizations.createdAt
  }).from(userOrganizations).where(eq(userOrganizations.organizationId, orgId));
  const pendingInvites = await db.select({
    id: organizationInvitations.id,
    email: organizationInvitations.email,
    role: organizationInvitations.role,
    expiresAt: organizationInvitations.expiresAt,
    createdAt: organizationInvitations.createdAt
  }).from(organizationInvitations).where(
    and(
      eq(organizationInvitations.organizationId, orgId),
      eq(organizationInvitations.status, "pending")
    )
  );
  const isPaid = hasActivePaidAccess(locals.subscription);
  const canInviteMore = isPaid || members.length + pendingInvites.length < TRIAL_MEMBER_LIMIT;
  return {
    organization: org,
    currentUser: {
      id: locals.session.user.id,
      name: locals.session.user.name,
      email: locals.session.user.email,
      image: locals.session.user.image,
      role: currentMembership?.role || "member"
    },
    members: members.map((m) => ({
      ...m,
      isCurrentUser: m.userId === locals.session?.user.id
    })),
    pendingInvites,
    memberLimit: isPaid ? null : TRIAL_MEMBER_LIMIT,
    canInviteMore
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 18;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-D-noRqZL.js')).default;
const server_id = "src/routes/(app)/settings/team/+page.server.ts";
const imports = ["_app/immutable/nodes/18.DSqaqFC1.js","_app/immutable/chunks/6hRGlosO.js","_app/immutable/chunks/DG-NX5-C.js","_app/immutable/chunks/CSbf_lLl.js","_app/immutable/chunks/BYxhF197.js","_app/immutable/chunks/DmVIRT7x.js","_app/immutable/chunks/BcensY04.js","_app/immutable/chunks/DkMcTl26.js","_app/immutable/chunks/BsDKDu3n.js","_app/immutable/chunks/Bg9SeeTQ.js","_app/immutable/chunks/iYVaaFRt.js","_app/immutable/chunks/CubP1Oyd.js","_app/immutable/chunks/BavwbSjU.js","_app/immutable/chunks/CZ5pcsRA.js","_app/immutable/chunks/Dquqzmud.js","_app/immutable/chunks/DLFz0z0M.js","_app/immutable/chunks/DbeiFq9X.js","_app/immutable/chunks/CxlNKZ5X.js","_app/immutable/chunks/CEcNqGI_.js","_app/immutable/chunks/lpvZEjax.js","_app/immutable/chunks/D8eZWso9.js","_app/immutable/chunks/CTM0yUCp.js","_app/immutable/chunks/jmpbzBok.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=18-B_qtEz_L.js.map
