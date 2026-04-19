import { r as redirect } from './index-wpIsICWW.js';
import { d as db, f as frameworks } from './index2-BGADDK3r.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-CgT2ID7b.js')).default;
const server_id = "src/routes/onboarding/+page.server.ts";
const imports = ["_app/immutable/nodes/26.C1qhtYko.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/X6zJqc5b.js","_app/immutable/chunks/uAfJ0NmM.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/lY-74J4r.js","_app/immutable/chunks/pVCgLvoe.js","_app/immutable/chunks/m3rTHpYV.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/DhRHngn4.js","_app/immutable/chunks/ChMAS9Cz.js","_app/immutable/chunks/CirnJSvW.js","_app/immutable/chunks/Cw4o8BYs.js","_app/immutable/chunks/B69-cLJ0.js","_app/immutable/chunks/Fp3gsSEd.js","_app/immutable/chunks/DiIfMaTF.js","_app/immutable/chunks/D-rah5pG.js","_app/immutable/chunks/BNIpjahG.js","_app/immutable/chunks/CwC6AaZu.js","_app/immutable/chunks/-lbl0OOQ.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=26-BhnxJYyZ.js.map
