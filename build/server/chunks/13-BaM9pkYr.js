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
const imports = ["_app/immutable/nodes/13.MhxX8Rud.js","_app/immutable/chunks/u3-ufisP.js","_app/immutable/chunks/DODTOTXo.js","_app/immutable/chunks/BgMuiJsk.js","_app/immutable/chunks/yATu7jPC.js","_app/immutable/chunks/CdejSs_f.js","_app/immutable/chunks/Dkwvs-kV.js","_app/immutable/chunks/4kmpTIx1.js","_app/immutable/chunks/LkH2v93T.js","_app/immutable/chunks/BE_qY0Hl.js","_app/immutable/chunks/C9Wu3rvq.js","_app/immutable/chunks/B66p6nCB.js","_app/immutable/chunks/f5v9q4r1.js","_app/immutable/chunks/D5iaXmX5.js","_app/immutable/chunks/DZtEn_RL.js","_app/immutable/chunks/Cox_fmk7.js","_app/immutable/chunks/CsO9MnRP.js","_app/immutable/chunks/Cr8RfznP.js","_app/immutable/chunks/xG9_ORX8.js","_app/immutable/chunks/CLB3M1ek.js","_app/immutable/chunks/B060-HDF.js","_app/immutable/chunks/Be1CXUWO.js","_app/immutable/chunks/khj6Ofq9.js","_app/immutable/chunks/CstPM5qL.js","_app/immutable/chunks/VtrdIure.js","_app/immutable/chunks/DPR90k8v.js","_app/immutable/chunks/BgNQN0s0.js","_app/immutable/chunks/CCDPLzFg.js","_app/immutable/chunks/B6md9Z8L.js","_app/immutable/chunks/-lbl0OOQ.js","_app/immutable/chunks/wyfbU9jJ.js","_app/immutable/chunks/B4AD-UjT.js","_app/immutable/chunks/BKEoGZbz.js","_app/immutable/chunks/l7U8ITNg.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=13-BaM9pkYr.js.map
