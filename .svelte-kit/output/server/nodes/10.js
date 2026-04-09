import * as server from '../entries/pages/(app)/frameworks/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/frameworks/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/frameworks/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.C39k4I64.js","_app/immutable/chunks/C4-OglNa.js","_app/immutable/chunks/BpQeBFz6.js","_app/immutable/chunks/DL1dF8Co.js","_app/immutable/chunks/wva3lzuF.js","_app/immutable/chunks/DDNgD1vj.js","_app/immutable/chunks/D7VKJyCS.js","_app/immutable/chunks/G6ebqmrI.js","_app/immutable/chunks/BTtrAdVo.js","_app/immutable/chunks/CJHQ0HkA.js","_app/immutable/chunks/Vngg9s5X.js","_app/immutable/chunks/BTY1pAFb.js","_app/immutable/chunks/BvC1F4lZ.js","_app/immutable/chunks/Cz2kTad7.js","_app/immutable/chunks/D4VMwjv9.js","_app/immutable/chunks/CmvkKI0s.js","_app/immutable/chunks/-lbl0OOQ.js"];
export const stylesheets = [];
export const fonts = [];
