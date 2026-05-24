import { a2 as head, a3 as ensure_array_like, a4 as attr, a5 as escape_html } from "../../chunks/index3.js";
import { p as page } from "../../chunks/index6.js";
import { l as localizeHref, a as locales } from "../../chunks/runtime.js";
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
export {
  _layout as default
};
