import { ae as hasContext, a6 as getContext } from "./index3.js";
import "clsx";
let contextKey = /* @__PURE__ */ Symbol("phosphor-svelte");
function getIconContext() {
  if (hasContext(contextKey)) {
    return getContext(contextKey);
  }
  return {};
}
export {
  getIconContext as g
};
