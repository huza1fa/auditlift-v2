import * as server from '../entries/pages/share/_token_/_page.server.ts.js';

export const index = 28;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/share/_token_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/share/[token]/+page.server.ts";
export const imports = ["_app/immutable/nodes/28.C0rjfxOZ.js","_app/immutable/chunks/6hRGlosO.js","_app/immutable/chunks/DG-NX5-C.js","_app/immutable/chunks/CSbf_lLl.js","_app/immutable/chunks/BYxhF197.js","_app/immutable/chunks/DmVIRT7x.js","_app/immutable/chunks/BcensY04.js","_app/immutable/chunks/DkMcTl26.js","_app/immutable/chunks/BsDKDu3n.js","_app/immutable/chunks/DZpD_d6q.js","_app/immutable/chunks/Bg9SeeTQ.js","_app/immutable/chunks/BkY_wzAx.js","_app/immutable/chunks/BavwbSjU.js","_app/immutable/chunks/CZ5pcsRA.js","_app/immutable/chunks/CB9dS2F2.js"];
export const stylesheets = [];
export const fonts = [];
