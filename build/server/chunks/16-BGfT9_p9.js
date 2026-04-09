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
const imports = ["_app/immutable/nodes/16.BMX8MTRp.js","_app/immutable/chunks/C4-OglNa.js","_app/immutable/chunks/BpQeBFz6.js","_app/immutable/chunks/DL1dF8Co.js","_app/immutable/chunks/wva3lzuF.js","_app/immutable/chunks/DDNgD1vj.js","_app/immutable/chunks/D7VKJyCS.js","_app/immutable/chunks/G6ebqmrI.js","_app/immutable/chunks/BTY1pAFb.js","_app/immutable/chunks/Btx_7kBT.js","_app/immutable/chunks/Vngg9s5X.js","_app/immutable/chunks/BvC1F4lZ.js","_app/immutable/chunks/_rHgYN86.js","_app/immutable/chunks/BvNIOfSW.js","_app/immutable/chunks/CJHQ0HkA.js","_app/immutable/chunks/5ZyVvjnc.js","_app/immutable/chunks/Cz2kTad7.js","_app/immutable/chunks/CmvkKI0s.js","_app/immutable/chunks/D4VMwjv9.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-BGfT9_p9.js.map
