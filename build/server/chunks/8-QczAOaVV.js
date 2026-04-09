import { r as redirect } from './index-wpIsICWW.js';
import { d as db, c as controls, h as evidence, e as eq, i as and, j as isNull } from './index2-C4rYKX5Z.js';
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
const imports = ["_app/immutable/nodes/8.eGovLw7_.js","_app/immutable/chunks/u3-ufisP.js","_app/immutable/chunks/DODTOTXo.js","_app/immutable/chunks/BgMuiJsk.js","_app/immutable/chunks/yATu7jPC.js","_app/immutable/chunks/CdejSs_f.js","_app/immutable/chunks/Dkwvs-kV.js","_app/immutable/chunks/4kmpTIx1.js","_app/immutable/chunks/LkH2v93T.js","_app/immutable/chunks/C9Wu3rvq.js","_app/immutable/chunks/B66p6nCB.js","_app/immutable/chunks/Cox_fmk7.js","_app/immutable/chunks/D5iaXmX5.js","_app/immutable/chunks/DZtEn_RL.js","_app/immutable/chunks/en4d4uem.js","_app/immutable/chunks/BML22FUE.js","_app/immutable/chunks/BX63xdyG.js","_app/immutable/chunks/CLB3M1ek.js","_app/immutable/chunks/CDHoFBpk.js","_app/immutable/chunks/C4lyDYbo.js","_app/immutable/chunks/VtrdIure.js","_app/immutable/chunks/8JVPSuNb.js","_app/immutable/chunks/DPR90k8v.js","_app/immutable/chunks/CCDPLzFg.js","_app/immutable/chunks/BgNQN0s0.js","_app/immutable/chunks/B6md9Z8L.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-QczAOaVV.js.map
