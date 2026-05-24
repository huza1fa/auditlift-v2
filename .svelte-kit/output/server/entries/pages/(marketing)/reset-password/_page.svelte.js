import { a2 as head, a5 as escape_html, a4 as attr, _ as derived } from "../../../../chunks/index3.js";
import { c as createAuthClient } from "../../../../chunks/index7.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/url.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/exports.js";
import "../../../../chunks/state.svelte.js";
import { p as page } from "../../../../chunks/index6.js";
import { T as ThemeToggle, L as LogoMark } from "../../../../chunks/ThemeToggle.js";
import { g as getLocale } from "../../../../chunks/runtime.js";
import { t as tagline, f as forgot_password_back_to_signin } from "../../../../chunks/forgot_password_back_to_signin.js";
const en_reset_password_title = (
  /** @type {(inputs: Reset_Password_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Set a new password`
    );
  }
);
const reset_password_title = (
  /** @type {((inputs?: Reset_Password_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reset_Password_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_reset_password_title();
  })
);
const en_reset_password_subtitle = (
  /** @type {(inputs: Reset_Password_SubtitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Choose a new password for your account.`
    );
  }
);
const reset_password_subtitle = (
  /** @type {((inputs?: Reset_Password_SubtitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reset_Password_SubtitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_reset_password_subtitle();
  })
);
const en_reset_password_new_placeholder = (
  /** @type {(inputs: Reset_Password_New_PlaceholderInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `New password`
    );
  }
);
const reset_password_new_placeholder = (
  /** @type {((inputs?: Reset_Password_New_PlaceholderInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reset_Password_New_PlaceholderInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_reset_password_new_placeholder();
  })
);
const en_reset_password_confirm_placeholder = (
  /** @type {(inputs: Reset_Password_Confirm_PlaceholderInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Confirm new password`
    );
  }
);
const reset_password_confirm_placeholder = (
  /** @type {((inputs?: Reset_Password_Confirm_PlaceholderInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reset_Password_Confirm_PlaceholderInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_reset_password_confirm_placeholder();
  })
);
const en_reset_password_submit = (
  /** @type {(inputs: Reset_Password_SubmitInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Update password`
    );
  }
);
const reset_password_submit = (
  /** @type {((inputs?: Reset_Password_SubmitInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reset_Password_SubmitInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_reset_password_submit();
  })
);
const en_reset_password_invalid_title = (
  /** @type {(inputs: Reset_Password_Invalid_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Invalid or expired reset link`
    );
  }
);
const reset_password_invalid_title = (
  /** @type {((inputs?: Reset_Password_Invalid_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reset_Password_Invalid_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_reset_password_invalid_title();
  })
);
const en_reset_password_invalid_body = (
  /** @type {(inputs: Reset_Password_Invalid_BodyInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `This reset link is invalid or has expired.`
    );
  }
);
const reset_password_invalid_body = (
  /** @type {((inputs?: Reset_Password_Invalid_BodyInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reset_Password_Invalid_BodyInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_reset_password_invalid_body();
  })
);
const en_reset_password_request_new = (
  /** @type {(inputs: Reset_Password_Request_NewInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Request a new one`
    );
  }
);
const reset_password_request_new = (
  /** @type {((inputs?: Reset_Password_Request_NewInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reset_Password_Request_NewInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_reset_password_request_new();
  })
);
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    createAuthClient();
    let password = "";
    let confirmPassword = "";
    let loading = false;
    const token = derived(() => page.url.searchParams.get("token"));
    head("1pro2uc", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Set New Password — AuditLift</title>`);
      });
      $$renderer3.push(`<meta name="robots" content="noindex, nofollow"/>`);
    });
    $$renderer2.push(`<div class="relative flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-6"><div class="absolute top-4 right-4">`);
    ThemeToggle($$renderer2, {});
    $$renderer2.push(`<!----></div> <div class="mb-2 flex items-center gap-2">`);
    LogoMark($$renderer2, { size: 28 });
    $$renderer2.push(`<!----> <span class="text-[18px] font-semibold tracking-tight text-[var(--foreground)]">AuditLift</span></div> <p class="mb-8 text-[13px] text-[var(--foreground-muted)]">${escape_html(tagline())}</p> <div class="w-full max-w-[340px] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--background-elevated)] p-8 shadow-[var(--shadow-md)]">`);
    if (!token()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="space-y-3 text-center"><p class="text-[15px] font-semibold text-[var(--foreground)]">${escape_html(reset_password_invalid_title())}</p> <p class="text-[13px] text-[var(--foreground-muted)]">${escape_html(reset_password_invalid_body())}</p> <a href="/forgot-password" class="block text-[13px] text-[var(--brand)] hover:underline">${escape_html(reset_password_request_new())}</a></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<h1 class="mb-1 text-[15px] font-semibold text-[var(--foreground)]">${escape_html(reset_password_title())}</h1> <p class="mb-5 text-[13px] text-[var(--foreground-muted)]">${escape_html(reset_password_subtitle())}</p> <form class="space-y-3"><input type="password"${attr("value", password)}${attr("placeholder", reset_password_new_placeholder())} class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none" required=""${attr("minlength", 8)}/> <input type="password"${attr("value", confirmPassword)}${attr("placeholder", reset_password_confirm_placeholder())} class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none" required=""${attr("minlength", 8)}/> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <button type="submit"${attr("disabled", loading, true)} class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--brand)] px-4 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60">`);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> ${escape_html(reset_password_submit())}</button></form>`);
    }
    $$renderer2.push(`<!--]--></div> <p class="mt-6 text-[12px] text-[var(--foreground-subtle)]"><a href="/login" class="hover:text-[var(--foreground)] hover:underline">${escape_html(forgot_password_back_to_signin())}</a></p></div>`);
  });
}
export {
  _page as default
};
