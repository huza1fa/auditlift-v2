import * as server from '../entries/pages/(app)/controls/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/controls/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/controls/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.SQrFmA8e.js","_app/immutable/chunks/C4-OglNa.js","_app/immutable/chunks/BpQeBFz6.js","_app/immutable/chunks/DL1dF8Co.js","_app/immutable/chunks/wva3lzuF.js","_app/immutable/chunks/DDNgD1vj.js","_app/immutable/chunks/D7VKJyCS.js","_app/immutable/chunks/G6ebqmrI.js","_app/immutable/chunks/BTtrAdVo.js","_app/immutable/chunks/BTY1pAFb.js","_app/immutable/chunks/CL6cXeDj.js","_app/immutable/chunks/B7Ssuz1w.js","_app/immutable/chunks/Vngg9s5X.js","_app/immutable/chunks/BvC1F4lZ.js","_app/immutable/chunks/Crlif-6b.js","_app/immutable/chunks/D_4SjgB0.js","_app/immutable/chunks/-lbl0OOQ.js","_app/immutable/chunks/D4VMwjv9.js","_app/immutable/chunks/Cz2kTad7.js"];
export const stylesheets = [];
export const fonts = [];
