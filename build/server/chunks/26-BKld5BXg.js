import { e as error } from './index-wpIsICWW.js';

const load = async ({ params, locals }) => {
  const token = params.token;
  if (!token) {
    throw error(400, "Invalid invitation");
  }
  return {
    token,
    isLoggedIn: !!locals.session
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 26;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DU0rNHCq.js')).default;
const server_id = "src/routes/invite/[token]/+page.server.ts";
const imports = ["_app/immutable/nodes/26.DMJFwZKn.js","_app/immutable/chunks/6hRGlosO.js","_app/immutable/chunks/DG-NX5-C.js","_app/immutable/chunks/BVzCchKO.js","_app/immutable/chunks/CSbf_lLl.js","_app/immutable/chunks/BYxhF197.js","_app/immutable/chunks/DmVIRT7x.js","_app/immutable/chunks/BcensY04.js","_app/immutable/chunks/DkMcTl26.js","_app/immutable/chunks/Bg9SeeTQ.js","_app/immutable/chunks/ftKWDiwK.js","_app/immutable/chunks/DZjzTWpt.js","_app/immutable/chunks/BavwbSjU.js","_app/immutable/chunks/CZ5pcsRA.js","_app/immutable/chunks/CubP1Oyd.js","_app/immutable/chunks/CEcNqGI_.js","_app/immutable/chunks/lpvZEjax.js","_app/immutable/chunks/CTM0yUCp.js","_app/immutable/chunks/D8eZWso9.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=26-BKld5BXg.js.map
