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
const imports = ["_app/immutable/nodes/16.B80iRaEu.js","_app/immutable/chunks/u3-ufisP.js","_app/immutable/chunks/DODTOTXo.js","_app/immutable/chunks/BgMuiJsk.js","_app/immutable/chunks/yATu7jPC.js","_app/immutable/chunks/CdejSs_f.js","_app/immutable/chunks/Dkwvs-kV.js","_app/immutable/chunks/4kmpTIx1.js","_app/immutable/chunks/C9Wu3rvq.js","_app/immutable/chunks/f5v9q4r1.js","_app/immutable/chunks/D5iaXmX5.js","_app/immutable/chunks/DZtEn_RL.js","_app/immutable/chunks/Buxdmzsi.js","_app/immutable/chunks/D6Hx5MbU.js","_app/immutable/chunks/khj6Ofq9.js","_app/immutable/chunks/VtrdIure.js","_app/immutable/chunks/DPR90k8v.js","_app/immutable/chunks/BgNQN0s0.js","_app/immutable/chunks/CCDPLzFg.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-DXADljRC.js.map
