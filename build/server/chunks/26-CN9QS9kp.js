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
const imports = ["_app/immutable/nodes/26.DwBKdnqg.js","_app/immutable/chunks/C4-OglNa.js","_app/immutable/chunks/BpQeBFz6.js","_app/immutable/chunks/DL1dF8Co.js","_app/immutable/chunks/wva3lzuF.js","_app/immutable/chunks/DDNgD1vj.js","_app/immutable/chunks/D7VKJyCS.js","_app/immutable/chunks/G6ebqmrI.js","_app/immutable/chunks/BTtrAdVo.js","_app/immutable/chunks/f_6DPdZv.js","_app/immutable/chunks/BTY1pAFb.js","_app/immutable/chunks/BPbtIwII.js","_app/immutable/chunks/BIwpEWWY.js","_app/immutable/chunks/Btx_7kBT.js","_app/immutable/chunks/Vngg9s5X.js","_app/immutable/chunks/BvC1F4lZ.js","_app/immutable/chunks/B7Ssuz1w.js","_app/immutable/chunks/Buyedc_J.js","_app/immutable/chunks/_rHgYN86.js","_app/immutable/chunks/BpHR7QeB.js","_app/immutable/chunks/CJHQ0HkA.js","_app/immutable/chunks/Q8eK679O.js","_app/immutable/chunks/CmvkKI0s.js","_app/immutable/chunks/Cz2kTad7.js","_app/immutable/chunks/D4VMwjv9.js","_app/immutable/chunks/CL6cXeDj.js","_app/immutable/chunks/-lbl0OOQ.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=26-CN9QS9kp.js.map
