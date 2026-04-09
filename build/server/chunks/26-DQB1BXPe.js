import { r as redirect } from './index-wpIsICWW.js';
import { d as db, f as frameworks } from './index2-C4rYKX5Z.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const load = async ({ locals }) => {
  if (!locals.session) redirect(302, "/login");
  if (locals.organization?.onboardingComplete) redirect(302, "/dashboard");
  const allFrameworks = await db.select({
    id: frameworks.id,
    slug: frameworks.slug,
    name: frameworks.name,
    description: frameworks.description,
    recommended: frameworks.recommended
  }).from(frameworks);
  return { frameworks: allFrameworks };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 26;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-VYrOb2Hz.js')).default;
const server_id = "src/routes/onboarding/+page.server.ts";
const imports = ["_app/immutable/nodes/26.CLS92rcB.js","_app/immutable/chunks/u3-ufisP.js","_app/immutable/chunks/DODTOTXo.js","_app/immutable/chunks/BgMuiJsk.js","_app/immutable/chunks/yATu7jPC.js","_app/immutable/chunks/CdejSs_f.js","_app/immutable/chunks/Dkwvs-kV.js","_app/immutable/chunks/4kmpTIx1.js","_app/immutable/chunks/LkH2v93T.js","_app/immutable/chunks/BE_qY0Hl.js","_app/immutable/chunks/C9Wu3rvq.js","_app/immutable/chunks/BKEoGZbz.js","_app/immutable/chunks/l7U8ITNg.js","_app/immutable/chunks/f5v9q4r1.js","_app/immutable/chunks/D5iaXmX5.js","_app/immutable/chunks/DZtEn_RL.js","_app/immutable/chunks/Cox_fmk7.js","_app/immutable/chunks/C33NHl2q.js","_app/immutable/chunks/Buxdmzsi.js","_app/immutable/chunks/xG9_ORX8.js","_app/immutable/chunks/khj6Ofq9.js","_app/immutable/chunks/Cyw0JW-C.js","_app/immutable/chunks/BgNQN0s0.js","_app/immutable/chunks/DPR90k8v.js","_app/immutable/chunks/CCDPLzFg.js","_app/immutable/chunks/B66p6nCB.js","_app/immutable/chunks/-lbl0OOQ.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=26-DQB1BXPe.js.map
