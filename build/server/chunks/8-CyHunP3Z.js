import { r as redirect } from './index-wpIsICWW.js';
import { d as db, c as controls, h as evidence, e as eq, i as and, j as isNull } from './index2-BGADDK3r.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const load = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) redirect(302, "/login");
  const evidenceList = await db.select({
    id: evidence.id,
    filename: evidence.filename,
    mimeType: evidence.mimeType,
    sizeBytes: evidence.sizeBytes,
    notes: evidence.notes,
    createdAt: evidence.createdAt,
    controlId: evidence.controlId,
    controlCode: controls.code,
    controlTitle: controls.title
  }).from(evidence).leftJoin(controls, eq(evidence.controlId, controls.id)).where(
    and(
      eq(evidence.organizationId, locals.organizationId),
      eq(evidence.status, "active"),
      isNull(evidence.deletedAt)
    )
  );
  return { evidenceList };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 8;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DzBNrHKU.js')).default;
const server_id = "src/routes/(app)/evidence/+page.server.ts";
const imports = ["_app/immutable/nodes/8.mDYQDVIP.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/X6zJqc5b.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/CwC6AaZu.js","_app/immutable/chunks/DhRHngn4.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/U1Th6Ard.js","_app/immutable/chunks/D_bHfS8v.js","_app/immutable/chunks/Bd-g-mim.js","_app/immutable/chunks/DUQCiiZn.js","_app/immutable/chunks/RO9Q9ZT8.js","_app/immutable/chunks/CeR0PS5m.js","_app/immutable/chunks/BVZvfCma.js","_app/immutable/chunks/BAU21WYp.js","_app/immutable/chunks/D-rah5pG.js","_app/immutable/chunks/BNIpjahG.js","_app/immutable/chunks/DiIfMaTF.js","_app/immutable/chunks/DmSCWmPh.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-CyHunP3Z.js.map
