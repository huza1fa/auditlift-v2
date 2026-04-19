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
const imports = ["_app/immutable/nodes/13.DmUGU5xa.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/X6zJqc5b.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/CwC6AaZu.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/m3rTHpYV.js","_app/immutable/chunks/DhRHngn4.js","_app/immutable/chunks/DbDxeITt.js","_app/immutable/chunks/BBumHVhU.js","_app/immutable/chunks/B6qRuksm.js","_app/immutable/chunks/Cw4o8BYs.js","_app/immutable/chunks/DUQCiiZn.js","_app/immutable/chunks/C2HthWRl.js","_app/immutable/chunks/FWjO53TG.js","_app/immutable/chunks/B69-cLJ0.js","_app/immutable/chunks/DhJR0AOY.js","_app/immutable/chunks/BVZvfCma.js","_app/immutable/chunks/BM-_O9eA.js","_app/immutable/chunks/D-rah5pG.js","_app/immutable/chunks/DiIfMaTF.js","_app/immutable/chunks/BNIpjahG.js","_app/immutable/chunks/DmSCWmPh.js","_app/immutable/chunks/-lbl0OOQ.js","_app/immutable/chunks/wyfbU9jJ.js","_app/immutable/chunks/BVhrlIEL.js","_app/immutable/chunks/lY-74J4r.js","_app/immutable/chunks/pVCgLvoe.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=13-DxCFB25I.js.map
