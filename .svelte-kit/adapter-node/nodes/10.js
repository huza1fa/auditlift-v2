import * as server from '../entries/pages/(app)/frameworks/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/frameworks/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/frameworks/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.C8nz_xQF.js","_app/immutable/chunks/u3-ufisP.js","_app/immutable/chunks/DODTOTXo.js","_app/immutable/chunks/BgMuiJsk.js","_app/immutable/chunks/yATu7jPC.js","_app/immutable/chunks/CdejSs_f.js","_app/immutable/chunks/Dkwvs-kV.js","_app/immutable/chunks/4kmpTIx1.js","_app/immutable/chunks/LkH2v93T.js","_app/immutable/chunks/khj6Ofq9.js","_app/immutable/chunks/D5iaXmX5.js","_app/immutable/chunks/C9Wu3rvq.js","_app/immutable/chunks/DZtEn_RL.js","_app/immutable/chunks/DPR90k8v.js","_app/immutable/chunks/CCDPLzFg.js","_app/immutable/chunks/BgNQN0s0.js","_app/immutable/chunks/-lbl0OOQ.js"];
export const stylesheets = [];
export const fonts = [];
