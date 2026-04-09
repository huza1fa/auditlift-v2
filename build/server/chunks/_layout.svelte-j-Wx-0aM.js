import { ab as head, ac as ensure_array_like, ad as attr, ae as escape_html } from './index3-A6PWQL_h.js';
import { p as page } from './index6-j7psd7gS.js';
import { l as localizeHref, c as locales } from './runtime-tB9eeHiM.js';
import './client-B5ZAjn4P.js';
import './state.svelte-CwtDSSSI.js';
import './root-kx8UrV8x.js';
import './client2-Bwd3FYwy.js';
import './index-BIEJqs8E.js';
import './exports-B5ORJhfK.js';

const favicon = "/favicon.ico";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<link rel="icon"${attr("href", favicon)}/>`);
    });
    children($$renderer2);
    $$renderer2.push(`<!----> <div style="display:none"><!--[-->`);
    const each_array = ensure_array_like(locales);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let locale = each_array[$$index];
      $$renderer2.push(`<a${attr("href", localizeHref(page.url.pathname, { locale }))}>${escape_html(locale)}</a>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-j-Wx-0aM.js.map
