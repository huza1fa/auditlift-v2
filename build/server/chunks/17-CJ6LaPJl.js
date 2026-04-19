import { r as redirect } from './index-wpIsICWW.js';
import { d as db, o as organizations, e as eq, u as userOrganizations, i as and, v as organizationInvitations } from './index2-BGADDK3r.js';
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

const index = 17;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-LAcjdZEI.js')).default;
const server_id = "src/routes/(app)/settings/team/+page.server.ts";
const imports = ["_app/immutable/nodes/17.DsvCsWfC.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/X6zJqc5b.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/CwC6AaZu.js","_app/immutable/chunks/CirnJSvW.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/BBumHVhU.js","_app/immutable/chunks/d8wuMd_x.js","_app/immutable/chunks/CeR0PS5m.js","_app/immutable/chunks/Fp3gsSEd.js","_app/immutable/chunks/BVZvfCma.js","_app/immutable/chunks/BAU21WYp.js","_app/immutable/chunks/D-rah5pG.js","_app/immutable/chunks/DiIfMaTF.js","_app/immutable/chunks/BNIpjahG.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=17-CJ6LaPJl.js.map
