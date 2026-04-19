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

const index = 25;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DFukQ6jd.js')).default;
const server_id = "src/routes/invite/[token]/+page.server.ts";
const imports = ["_app/immutable/nodes/25.wdC85lpd.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/pVCgLvoe.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/lY-74J4r.js","_app/immutable/chunks/ChMAS9Cz.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/CirnJSvW.js","_app/immutable/chunks/BVZvfCma.js","_app/immutable/chunks/BAU21WYp.js","_app/immutable/chunks/DiIfMaTF.js","_app/immutable/chunks/D-rah5pG.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=25-DGoSWdJC.js.map
