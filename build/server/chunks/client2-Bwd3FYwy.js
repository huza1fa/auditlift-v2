import './root-kx8UrV8x.js';
import { w as writable } from './index-BIEJqs8E.js';
import './exports-B5ORJhfK.js';
import './state.svelte-CwtDSSSI.js';

function create_updated_store() {
  const { set, subscribe } = writable(false);
  {
    return {
      subscribe,
      // eslint-disable-next-line @typescript-eslint/require-await
      check: async () => false
    };
  }
}
const stores = {
  updated: /* @__PURE__ */ create_updated_store()
};
function goto(url, opts = {}) {
  {
    throw new Error("Cannot call goto(...) on the server");
  }
}

export { goto as g, stores as s };
//# sourceMappingURL=client2-Bwd3FYwy.js.map
