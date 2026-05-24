import * as server from '../entries/pages/onboarding/_page.server.ts.js';

export const index = 27;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/onboarding/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/onboarding/+page.server.ts";
export const imports = ["_app/immutable/nodes/27.CfI0qS5t.js","_app/immutable/chunks/6hRGlosO.js","_app/immutable/chunks/DG-NX5-C.js","_app/immutable/chunks/CSbf_lLl.js","_app/immutable/chunks/BYxhF197.js","_app/immutable/chunks/DmVIRT7x.js","_app/immutable/chunks/BcensY04.js","_app/immutable/chunks/DkMcTl26.js","_app/immutable/chunks/BE4e1YPt.js","_app/immutable/chunks/Bg9SeeTQ.js","_app/immutable/chunks/iYVaaFRt.js","_app/immutable/chunks/BsDKDu3n.js","_app/immutable/chunks/DVaPL7Nh.js","_app/immutable/chunks/ftKWDiwK.js","_app/immutable/chunks/BVzCchKO.js","_app/immutable/chunks/dig0x5_2.js","_app/immutable/chunks/BavwbSjU.js","_app/immutable/chunks/CZ5pcsRA.js","_app/immutable/chunks/Dmx2quEY.js","_app/immutable/chunks/DZjzTWpt.js","_app/immutable/chunks/CubP1Oyd.js","_app/immutable/chunks/BXf5cY5b.js","_app/immutable/chunks/BkY_wzAx.js","_app/immutable/chunks/CxlNKZ5X.js","_app/immutable/chunks/CTM0yUCp.js","_app/immutable/chunks/D8eZWso9.js","_app/immutable/chunks/jmpbzBok.js","_app/immutable/chunks/-lbl0OOQ.js"];
export const stylesheets = [];
export const fonts = [];
