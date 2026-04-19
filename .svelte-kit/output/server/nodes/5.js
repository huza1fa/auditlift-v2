import * as server from '../entries/pages/(app)/controls/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/controls/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/controls/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.DNf-exGa.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/X6zJqc5b.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/CwC6AaZu.js","_app/immutable/chunks/DhRHngn4.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/DbDxeITt.js","_app/immutable/chunks/eEFtYnTo.js","_app/immutable/chunks/-lbl0OOQ.js","_app/immutable/chunks/BNIpjahG.js","_app/immutable/chunks/D-rah5pG.js"];
export const stylesheets = [];
export const fonts = [];
