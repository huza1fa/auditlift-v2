import { ac as head, ad as ensure_array_like, ae as attr, af as escape_html } from './index3-DkaUimNV.js';
import { p as page } from './index6-BUf7URne.js';
import { l as localizeHref, c as locales } from './runtime-tB9eeHiM.js';
import './client-AbiOXsnH.js';
import './state.svelte-CzTG6IHa.js';
import './root-DgYLCq9M.js';
import './events-D4oFFCJs.js';
import './client2-CKiYUCRD.js';
import './index-DBVoBMpw.js';
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
//# sourceMappingURL=_layout.svelte-Ba6XC7WA.js.map
