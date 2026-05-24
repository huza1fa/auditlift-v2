import { ad as ensure_array_like, af as escape_html } from './index3-DkaUimNV.js';
import { S as ShieldCheck } from './ShieldCheck-BonUzCgo.js';
import { C as Card } from './Card-C3cXNBIr.js';
import { B as Badge } from './Badge-D_CDcnKK.js';
import { B as Button } from './Button-UgeElHRw.js';
import { e as getLocale } from './runtime-tB9eeHiM.js';
import './context-gDwvAQFd.js';

const en_frameworks_most_popular = (
  /** @type {(inputs: Frameworks_Most_PopularInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Most Popular`
    );
  }
);
const frameworks_most_popular = (
  /** @type {((inputs?: Frameworks_Most_PopularInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Frameworks_Most_PopularInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_frameworks_most_popular();
  })
);
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    async function activate(frameworkId) {
      const framework = data.frameworks.find((f) => f.id === frameworkId);
      await fetch("/api/onboarding/framework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frameworkSlug: framework?.slug })
      });
      window.location.reload();
    }
    $$renderer2.push(`<div class="space-y-6"><h1 class="text-2xl font-bold text-[var(--foreground)]">Compliance Frameworks</h1> <div class="grid grid-cols-1 gap-6 md:grid-cols-3"><!--[-->`);
    const each_array = ensure_array_like(data.frameworks);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let framework = each_array[$$index];
      Card($$renderer2, {
        class: "p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="mb-3 flex items-start justify-between">`);
          ShieldCheck($$renderer3, { size: 24, color: "var(--brand)", weight: "fill" });
          $$renderer3.push(`<!----> `);
          if (framework.recommended) {
            $$renderer3.push("<!--[0-->");
            Badge($$renderer3, {
              variant: "info",
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(frameworks_most_popular())}`);
              }
            });
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></div> <h2 class="mb-1 font-semibold text-[var(--foreground)]">${escape_html(framework.name)}</h2> <p class="mb-4 text-sm text-[var(--foreground-muted)]">${escape_html(framework.description)}</p> `);
          if (framework.active) {
            $$renderer3.push("<!--[0-->");
            Badge($$renderer3, {
              variant: "success",
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->Active`);
              }
            });
          } else {
            $$renderer3.push("<!--[-1-->");
            Button($$renderer3, {
              variant: "secondary",
              size: "sm",
              onclick: () => activate(framework.id),
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->Activate`);
              }
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      });
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DDatcq9e.js.map
