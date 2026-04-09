import './root-kx8UrV8x.js';
import './exports-B5ORJhfK.js';
import './state.svelte-CwtDSSSI.js';
import { C as Card } from './Card-B7pxgW8R.js';
import './index3-A6PWQL_h.js';

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
//# sourceMappingURL=_page.svelte-DFukQ6jd.js.map
