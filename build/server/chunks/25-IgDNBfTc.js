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
const imports = ["_app/immutable/nodes/25.AOs1ZsUD.js","_app/immutable/chunks/C4-OglNa.js","_app/immutable/chunks/BpQeBFz6.js","_app/immutable/chunks/BIwpEWWY.js","_app/immutable/chunks/DL1dF8Co.js","_app/immutable/chunks/wva3lzuF.js","_app/immutable/chunks/DDNgD1vj.js","_app/immutable/chunks/D7VKJyCS.js","_app/immutable/chunks/G6ebqmrI.js","_app/immutable/chunks/BTY1pAFb.js","_app/immutable/chunks/BPbtIwII.js","_app/immutable/chunks/Buyedc_J.js","_app/immutable/chunks/Vngg9s5X.js","_app/immutable/chunks/BvC1F4lZ.js","_app/immutable/chunks/_rHgYN86.js","_app/immutable/chunks/5ZyVvjnc.js","_app/immutable/chunks/C0R6Hy8-.js","_app/immutable/chunks/CmvkKI0s.js","_app/immutable/chunks/Cz2kTad7.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=25-IgDNBfTc.js.map
