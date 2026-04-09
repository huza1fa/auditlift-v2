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
const imports = ["_app/immutable/nodes/8.VNnwAKCv.js","_app/immutable/chunks/C4-OglNa.js","_app/immutable/chunks/BpQeBFz6.js","_app/immutable/chunks/DL1dF8Co.js","_app/immutable/chunks/wva3lzuF.js","_app/immutable/chunks/DDNgD1vj.js","_app/immutable/chunks/D7VKJyCS.js","_app/immutable/chunks/G6ebqmrI.js","_app/immutable/chunks/BTtrAdVo.js","_app/immutable/chunks/BTY1pAFb.js","_app/immutable/chunks/CL6cXeDj.js","_app/immutable/chunks/B7Ssuz1w.js","_app/immutable/chunks/Vngg9s5X.js","_app/immutable/chunks/BvC1F4lZ.js","_app/immutable/chunks/DSuTUhAQ.js","_app/immutable/chunks/kq4G5j6i.js","_app/immutable/chunks/DAjDy0qh.js","_app/immutable/chunks/BH9OUOv8.js","_app/immutable/chunks/zWQAIHPg.js","_app/immutable/chunks/hHjxOlmU.js","_app/immutable/chunks/5ZyVvjnc.js","_app/immutable/chunks/C0R6Hy8-.js","_app/immutable/chunks/Cz2kTad7.js","_app/immutable/chunks/D4VMwjv9.js","_app/immutable/chunks/CmvkKI0s.js","_app/immutable/chunks/BpEak5nx.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-BKn0Emtt.js.map
