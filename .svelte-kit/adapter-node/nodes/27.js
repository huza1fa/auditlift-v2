import * as server from '../entries/pages/share/_token_/_page.server.ts.js';

export const index = 27;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/share/_token_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/share/[token]/+page.server.ts";
export const imports = ["_app/immutable/nodes/27.DbcJ0ABc.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/X6zJqc5b.js","_app/immutable/chunks/BXKLm6Zk.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/B69-cLJ0.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/BM-_O9eA.js"];
export const stylesheets = [];
export const fonts = [];
