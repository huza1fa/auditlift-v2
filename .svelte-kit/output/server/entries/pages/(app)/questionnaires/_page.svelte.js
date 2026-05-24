import { a5 as escape_html, a9 as attr_class, _ as derived, ac as stringify } from "../../../../chunks/index3.js";
import { S as Spinner } from "../../../../chunks/Spinner.js";
import { U as Upload } from "../../../../chunks/Upload.js";
import { W as Warning } from "../../../../chunks/Warning.js";
import { B as Button } from "../../../../chunks/Button.js";
import { g as getLocale } from "../../../../chunks/runtime.js";
import { q as questionnaires_title } from "../../../../chunks/questionnaires_title.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/url.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/exports.js";
import "../../../../chunks/state.svelte.js";
const en_questionnaires_upload_button = (
  /** @type {(inputs: Questionnaires_Upload_ButtonInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Upload questionnaire`
    );
  }
);
const questionnaires_upload_button = (
  /** @type {((inputs?: Questionnaires_Upload_ButtonInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Questionnaires_Upload_ButtonInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_questionnaires_upload_button();
  })
);
const en_questionnaires_upload_area_title = (
  /** @type {(inputs: Questionnaires_Upload_Area_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Drop your questionnaire here`
    );
  }
);
const questionnaires_upload_area_title = (
  /** @type {((inputs?: Questionnaires_Upload_Area_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Questionnaires_Upload_Area_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_questionnaires_upload_area_title();
  })
);
const en_questionnaires_upload_area_subtitle = (
  /** @type {(inputs: Questionnaires_Upload_Area_SubtitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `XLSX, CSV, PDF, DOCX — max 5MB`
    );
  }
);
const questionnaires_upload_area_subtitle = (
  /** @type {((inputs?: Questionnaires_Upload_Area_SubtitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Questionnaires_Upload_Area_SubtitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_questionnaires_upload_area_subtitle();
  })
);
const en_questionnaires_upload_area_click = (
  /** @type {(inputs: Questionnaires_Upload_Area_ClickInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Click to browse files`
    );
  }
);
const questionnaires_upload_area_click = (
  /** @type {((inputs?: Questionnaires_Upload_Area_ClickInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Questionnaires_Upload_Area_ClickInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_questionnaires_upload_area_click();
  })
);
const en_questionnaires_trial_banner = (
  /** @type {(inputs: Questionnaires_Trial_BannerInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Trial: 1 questionnaire included. Upgrade for unlimited uploads and exports.`
    );
  }
);
const questionnaires_trial_banner = (
  /** @type {((inputs?: Questionnaires_Trial_BannerInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Questionnaires_Trial_BannerInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_questionnaires_trial_banner();
  })
);
const en_questionnaires_trial_upgrade = (
  /** @type {(inputs: Questionnaires_Trial_UpgradeInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Upgrade`
    );
  }
);
const questionnaires_trial_upgrade = (
  /** @type {((inputs?: Questionnaires_Trial_UpgradeInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Questionnaires_Trial_UpgradeInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_questionnaires_trial_upgrade();
  })
);
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let questionnaires = [];
    let uploading = false;
    let fileInput = null;
    const showTrialBanner = derived(() => !data.hasActivePaidAccess && questionnaires.length >= 1);
    $$renderer2.push(`<div class="space-y-6"><div class="flex items-center justify-between"><h1 class="text-2xl font-bold text-[var(--foreground)]">${escape_html(
      // ── Effects ───────────────────────────────────────────────────────────────
      // Open SSE for any already-processing questionnaires on page load
      questionnaires_title()
    )}</h1> `);
    Button($$renderer2, {
      onclick: () => fileInput?.click(),
      disabled: uploading,
      children: ($$renderer3) => {
        {
          $$renderer3.push("<!--[-1-->");
          Upload($$renderer3, { size: 16 });
          $$renderer3.push(`<!----> ${escape_html(questionnaires_upload_button())}`);
        }
        $$renderer3.push(`<!--]-->`);
      }
    });
    $$renderer2.push(`<!----></div> `);
    if (showTrialBanner()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--warning)] bg-[var(--warning-light)] px-4 py-3"><div class="flex items-center gap-2.5">`);
      Warning($$renderer2, { size: 18, color: "var(--warning)", weight: "fill" });
      $$renderer2.push(`<!----> <p class="text-sm text-[var(--warning)]">${escape_html(questionnaires_trial_banner())}</p></div> <a href="/settings/billing">`);
      Button($$renderer2, {
        size: "sm",
        variant: "secondary",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(questionnaires_trial_upgrade())}`);
        }
      });
      $$renderer2.push(`<!----></a></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div role="button" tabindex="0"${attr_class(`cursor-pointer rounded-[var(--radius-lg)] border-2 border-dashed px-6 py-8 text-center transition-colors ${stringify("border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--brand)] hover:bg-[var(--background-alt)]")}`)}>`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="flex flex-col items-center gap-3"><div class="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--background-alt)]">`);
      Upload($$renderer2, { size: 24, color: "var(--foreground-muted)" });
      $$renderer2.push(`<!----></div> <div><p class="font-medium text-[var(--foreground)]">${escape_html(questionnaires_upload_area_title())}</p> <p class="mt-1 text-sm text-[var(--foreground-muted)]">${escape_html(questionnaires_upload_area_subtitle())}</p> <p class="mt-2 text-xs font-medium text-[var(--brand)]">${escape_html(questionnaires_upload_area_click())}</p></div></div>`);
    }
    $$renderer2.push(`<!--]--></div> <input type="file" accept=".xlsx,.csv,.pdf,.docx" class="hidden"/> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex justify-center py-16">`);
      Spinner($$renderer2, {
        size: 28,
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
