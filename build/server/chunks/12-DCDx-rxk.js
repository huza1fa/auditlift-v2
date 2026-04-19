import { r as redirect } from './index-wpIsICWW.js';

const load = async ({ locals }) => {
  if (!locals.session) redirect(302, "/login");
  return {
    subscription: locals.subscription,
    hasActivePaidAccess: locals.subscription?.status === "active"
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 12;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CYAXLYhQ.js')).default;
const server_id = "src/routes/(app)/questionnaires/+page.server.ts";
const imports = ["_app/immutable/nodes/12.CapksATs.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/X6zJqc5b.js","_app/immutable/chunks/uAfJ0NmM.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/VnUabZk2.js","_app/immutable/chunks/DhRHngn4.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/BRTuafyp.js","_app/immutable/chunks/BSoQHozz.js","_app/immutable/chunks/D_bHfS8v.js","_app/immutable/chunks/DhJR0AOY.js","_app/immutable/chunks/CeR0PS5m.js","_app/immutable/chunks/CpwUUCLt.js","_app/immutable/chunks/BVZvfCma.js","_app/immutable/chunks/D-rah5pG.js","_app/immutable/chunks/DiIfMaTF.js","_app/immutable/chunks/BNIpjahG.js","_app/immutable/chunks/DmSCWmPh.js","_app/immutable/chunks/-lbl0OOQ.js","_app/immutable/chunks/BWlwuY2s.js","_app/immutable/chunks/wyfbU9jJ.js","_app/immutable/chunks/lY-74J4r.js","_app/immutable/chunks/pVCgLvoe.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=12-DCDx-rxk.js.map
