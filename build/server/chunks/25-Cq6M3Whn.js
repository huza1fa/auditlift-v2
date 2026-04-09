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
const imports = ["_app/immutable/nodes/25.CToXde3N.js","_app/immutable/chunks/u3-ufisP.js","_app/immutable/chunks/DODTOTXo.js","_app/immutable/chunks/l7U8ITNg.js","_app/immutable/chunks/BgMuiJsk.js","_app/immutable/chunks/yATu7jPC.js","_app/immutable/chunks/CdejSs_f.js","_app/immutable/chunks/Dkwvs-kV.js","_app/immutable/chunks/4kmpTIx1.js","_app/immutable/chunks/C9Wu3rvq.js","_app/immutable/chunks/BKEoGZbz.js","_app/immutable/chunks/C33NHl2q.js","_app/immutable/chunks/D5iaXmX5.js","_app/immutable/chunks/DZtEn_RL.js","_app/immutable/chunks/Buxdmzsi.js","_app/immutable/chunks/VtrdIure.js","_app/immutable/chunks/8JVPSuNb.js","_app/immutable/chunks/BgNQN0s0.js","_app/immutable/chunks/DPR90k8v.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=25-Cq6M3Whn.js.map
