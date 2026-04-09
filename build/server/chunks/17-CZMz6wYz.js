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
const imports = ["_app/immutable/nodes/17.BiZatt0G.js","_app/immutable/chunks/C4-OglNa.js","_app/immutable/chunks/BpQeBFz6.js","_app/immutable/chunks/DL1dF8Co.js","_app/immutable/chunks/wva3lzuF.js","_app/immutable/chunks/DDNgD1vj.js","_app/immutable/chunks/D7VKJyCS.js","_app/immutable/chunks/G6ebqmrI.js","_app/immutable/chunks/BTtrAdVo.js","_app/immutable/chunks/BTY1pAFb.js","_app/immutable/chunks/CL6cXeDj.js","_app/immutable/chunks/_rHgYN86.js","_app/immutable/chunks/Vngg9s5X.js","_app/immutable/chunks/BvC1F4lZ.js","_app/immutable/chunks/D6Y89jQn.js","_app/immutable/chunks/8OJed41S.js","_app/immutable/chunks/hHjxOlmU.js","_app/immutable/chunks/Q8eK679O.js","_app/immutable/chunks/C0R6Hy8-.js","_app/immutable/chunks/Cz2kTad7.js","_app/immutable/chunks/CmvkKI0s.js","_app/immutable/chunks/D4VMwjv9.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=17-CZMz6wYz.js.map
