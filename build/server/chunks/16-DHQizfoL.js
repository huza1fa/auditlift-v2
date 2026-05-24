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
const component = async () => component_cache ??= (await import('./_page.svelte-CGmla5Z2.js')).default;
const server_id = "src/routes/(app)/settings/billing/+page.server.ts";
const imports = ["_app/immutable/nodes/16.C306XYav.js","_app/immutable/chunks/6hRGlosO.js","_app/immutable/chunks/DG-NX5-C.js","_app/immutable/chunks/CSbf_lLl.js","_app/immutable/chunks/BYxhF197.js","_app/immutable/chunks/DmVIRT7x.js","_app/immutable/chunks/BcensY04.js","_app/immutable/chunks/DkMcTl26.js","_app/immutable/chunks/Bg9SeeTQ.js","_app/immutable/chunks/dig0x5_2.js","_app/immutable/chunks/BavwbSjU.js","_app/immutable/chunks/CZ5pcsRA.js","_app/immutable/chunks/CubP1Oyd.js","_app/immutable/chunks/CI5OGqu9.js","_app/immutable/chunks/BkY_wzAx.js","_app/immutable/chunks/CEcNqGI_.js","_app/immutable/chunks/D8eZWso9.js","_app/immutable/chunks/CTM0yUCp.js","_app/immutable/chunks/jmpbzBok.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-DHQizfoL.js.map
