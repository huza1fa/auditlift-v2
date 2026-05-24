import './root-DgYLCq9M.js';
import './exports-B5ORJhfK.js';
import './state.svelte-CzTG6IHa.js';
import { C as Card } from './Card-C3cXNBIr.js';
import './index3-DkaUimNV.js';
import './events-D4oFFCJs.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    $$renderer2.push(`<div class="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">`);
    Card($$renderer2, {
      class: "w-full max-w-md p-8",
      children: ($$renderer3) => {
        {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="text-center"><div class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand)] border-t-transparent"></div> <p class="text-[var(--foreground-muted)]">Loading invitation...</p></div>`);
        }
        $$renderer3.push(`<!--]-->`);
      }
    });
    $$renderer2.push(`<!----></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DU0rNHCq.js.map
