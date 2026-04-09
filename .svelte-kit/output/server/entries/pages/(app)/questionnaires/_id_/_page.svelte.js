import { a4 as escape_html } from "../../../../../chunks/index3.js";
import "clsx";
import { A as ArrowLeft } from "../../../../../chunks/ArrowLeft.js";
import { S as Spinner } from "../../../../../chunks/Spinner.js";
import { g as getLocale } from "../../../../../chunks/runtime.js";
import "../../../../../chunks/client.js";
const en_questionnaires_back_link = (
  /** @type {(inputs: Questionnaires_Back_LinkInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Questionnaires`
    );
  }
);
const questionnaires_back_link = (
  /** @type {((inputs?: Questionnaires_Back_LinkInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Questionnaires_Back_LinkInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_questionnaires_back_link();
  })
);
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    $$renderer2.push(`<div class="space-y-5"><a href="/questionnaires" class="inline-flex items-center gap-1.5 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]">`);
    ArrowLeft($$renderer2, {
      size: (
        // ── Effects ───────────────────────────────────────────────────────────────
        // Sync answer draft when selected question changes
        14
      )
    });
    $$renderer2.push(`<!----> ${escape_html(questionnaires_back_link())}</a> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex justify-center py-24">`);
      Spinner($$renderer2, {
        size: 32,
        class: "animate-spin",
        color: "var(--foreground-muted)"
      });
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
