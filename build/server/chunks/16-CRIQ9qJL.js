const load = async ({ locals }) => {
  return {
    user: locals.session?.user,
    organization: locals.organization,
    subscription: locals.subscription
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 16;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Dmbjn_pv.js')).default;
const server_id = "src/routes/(app)/settings/billing/+page.server.ts";
const imports = ["_app/immutable/nodes/16.DjsbkD6u.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/m3rTHpYV.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/CirnJSvW.js","_app/immutable/chunks/DQuKVh7U.js","_app/immutable/chunks/B69-cLJ0.js","_app/immutable/chunks/BVZvfCma.js","_app/immutable/chunks/D-rah5pG.js","_app/immutable/chunks/DiIfMaTF.js","_app/immutable/chunks/BNIpjahG.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-CRIQ9qJL.js.map
