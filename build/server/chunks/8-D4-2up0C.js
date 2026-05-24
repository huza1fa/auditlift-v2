import { r as redirect } from './index-wpIsICWW.js';
import { d as db, c as controls, h as evidence, e as eq, i as and, j as isNull } from './index2-CrtZLkpF.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-BPkm84Rf.js')).default;
const server_id = "src/routes/(app)/evidence/+page.server.ts";
const imports = ["_app/immutable/nodes/8.Dvm5W3s1.js","_app/immutable/chunks/6hRGlosO.js","_app/immutable/chunks/DG-NX5-C.js","_app/immutable/chunks/CSbf_lLl.js","_app/immutable/chunks/BYxhF197.js","_app/immutable/chunks/DmVIRT7x.js","_app/immutable/chunks/BcensY04.js","_app/immutable/chunks/DkMcTl26.js","_app/immutable/chunks/BsDKDu3n.js","_app/immutable/chunks/Bg9SeeTQ.js","_app/immutable/chunks/iYVaaFRt.js","_app/immutable/chunks/Dmx2quEY.js","_app/immutable/chunks/BavwbSjU.js","_app/immutable/chunks/CZ5pcsRA.js","_app/immutable/chunks/C6jKoof3.js","_app/immutable/chunks/C3KXob4M.js","_app/immutable/chunks/By78CYd0.js","_app/immutable/chunks/BvEs9fp0.js","_app/immutable/chunks/DxKX1im5.js","_app/immutable/chunks/DbeiFq9X.js","_app/immutable/chunks/CEcNqGI_.js","_app/immutable/chunks/lpvZEjax.js","_app/immutable/chunks/D8eZWso9.js","_app/immutable/chunks/jmpbzBok.js","_app/immutable/chunks/CTM0yUCp.js","_app/immutable/chunks/Iq2x8nIK.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-D4-2up0C.js.map
