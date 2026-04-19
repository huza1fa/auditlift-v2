import * as server from '../entries/pages/(app)/frameworks/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/frameworks/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/frameworks/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.C0U6D_e8.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/X6zJqc5b.js","_app/immutable/chunks/B69-cLJ0.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/D-rah5pG.js","_app/immutable/chunks/BNIpjahG.js","_app/immutable/chunks/DiIfMaTF.js","_app/immutable/chunks/-lbl0OOQ.js"];
export const stylesheets = [];
export const fonts = [];
