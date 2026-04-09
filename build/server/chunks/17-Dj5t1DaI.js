import { r as redirect } from './index-wpIsICWW.js';
import { d as db, o as organizations, e as eq, u as userOrganizations, i as and, v as organizationInvitations } from './index2-C4rYKX5Z.js';
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
    pendingInvites
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 17;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-igacbbuY.js')).default;
const server_id = "src/routes/(app)/settings/team/+page.server.ts";
const imports = ["_app/immutable/nodes/17.DENlhoAS.js","_app/immutable/chunks/u3-ufisP.js","_app/immutable/chunks/DODTOTXo.js","_app/immutable/chunks/BgMuiJsk.js","_app/immutable/chunks/yATu7jPC.js","_app/immutable/chunks/CdejSs_f.js","_app/immutable/chunks/Dkwvs-kV.js","_app/immutable/chunks/4kmpTIx1.js","_app/immutable/chunks/LkH2v93T.js","_app/immutable/chunks/C9Wu3rvq.js","_app/immutable/chunks/B66p6nCB.js","_app/immutable/chunks/Buxdmzsi.js","_app/immutable/chunks/D5iaXmX5.js","_app/immutable/chunks/DZtEn_RL.js","_app/immutable/chunks/BX8eh26r.js","_app/immutable/chunks/C4lyDYbo.js","_app/immutable/chunks/Cyw0JW-C.js","_app/immutable/chunks/8JVPSuNb.js","_app/immutable/chunks/DPR90k8v.js","_app/immutable/chunks/BgNQN0s0.js","_app/immutable/chunks/CCDPLzFg.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=17-Dj5t1DaI.js.map
