import { r as redirect } from './index-wpIsICWW.js';

const load = async ({ locals }) => {
  if (!locals.session) redirect(302, "/login");
  return {
    hasActivePaidAccess: locals.subscription?.status === "active"
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 13;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CZRDJvcM.js')).default;
const server_id = "src/routes/(app)/questionnaires/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/13.B2E0KH3C.js","_app/immutable/chunks/C4-OglNa.js","_app/immutable/chunks/BpQeBFz6.js","_app/immutable/chunks/DL1dF8Co.js","_app/immutable/chunks/wva3lzuF.js","_app/immutable/chunks/DDNgD1vj.js","_app/immutable/chunks/D7VKJyCS.js","_app/immutable/chunks/G6ebqmrI.js","_app/immutable/chunks/BTtrAdVo.js","_app/immutable/chunks/f_6DPdZv.js","_app/immutable/chunks/BTY1pAFb.js","_app/immutable/chunks/CL6cXeDj.js","_app/immutable/chunks/Btx_7kBT.js","_app/immutable/chunks/Vngg9s5X.js","_app/immutable/chunks/BvC1F4lZ.js","_app/immutable/chunks/B7Ssuz1w.js","_app/immutable/chunks/Crlif-6b.js","_app/immutable/chunks/D6Y89jQn.js","_app/immutable/chunks/CuUG55jY.js","_app/immutable/chunks/BpHR7QeB.js","_app/immutable/chunks/BH9OUOv8.js","_app/immutable/chunks/DVcxUPmm.js","_app/immutable/chunks/B20ojI6c.js","_app/immutable/chunks/CJHQ0HkA.js","_app/immutable/chunks/XVWDnIXh.js","_app/immutable/chunks/5ZyVvjnc.js","_app/immutable/chunks/Cz2kTad7.js","_app/immutable/chunks/CmvkKI0s.js","_app/immutable/chunks/D4VMwjv9.js","_app/immutable/chunks/BpEak5nx.js","_app/immutable/chunks/-lbl0OOQ.js","_app/immutable/chunks/wyfbU9jJ.js","_app/immutable/chunks/CPo0FU61.js","_app/immutable/chunks/BPbtIwII.js","_app/immutable/chunks/BIwpEWWY.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=13-DnXMOKb7.js.map
