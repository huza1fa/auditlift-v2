import { ac as head, af as escape_html, ae as attr } from './index3-DkaUimNV.js';
import { c as createAuthClient } from './index7-BlKzgwyM.js';
import { T as ThemeToggle, L as LogoMark } from './ThemeToggle-D-gFIORn.js';
import { e as getLocale } from './runtime-tB9eeHiM.js';
import { t as tagline, f as forgot_password_back_to_signin } from './forgot_password_back_to_signin-Xnb-JfPn.js';
import './defu-Ccxff1Nq.js';
import 'zod';

const en_forgot_password_title = (
  /** @type {(inputs: Forgot_Password_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Reset your password`
    );
  }
);
const forgot_password_title = (
  /** @type {((inputs?: Forgot_Password_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forgot_Password_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_forgot_password_title();
  })
);
const en_forgot_password_subtitle = (
  /** @type {(inputs: Forgot_Password_SubtitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Enter your email and we'll send you a reset link.`
    );
  }
);
const forgot_password_subtitle = (
  /** @type {((inputs?: Forgot_Password_SubtitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forgot_Password_SubtitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_forgot_password_subtitle();
  })
);
const en_forgot_password_email_placeholder = (
  /** @type {(inputs: Forgot_Password_Email_PlaceholderInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Email address`
    );
  }
);
const forgot_password_email_placeholder = (
  /** @type {((inputs?: Forgot_Password_Email_PlaceholderInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forgot_Password_Email_PlaceholderInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_forgot_password_email_placeholder();
  })
);
const en_forgot_password_submit = (
  /** @type {(inputs: Forgot_Password_SubmitInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Send reset link`
    );
  }
);
const forgot_password_submit = (
  /** @type {((inputs?: Forgot_Password_SubmitInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forgot_Password_SubmitInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_forgot_password_submit();
  })
);
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    createAuthClient();
    let email = "";
    let loading = false;
    head("ltzr90", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Reset Password — AuditLift</title>`);
      });
      $$renderer3.push(`<meta name="robots" content="noindex, nofollow"/>`);
    });
    $$renderer2.push(`<div class="relative flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-6"><div class="absolute top-4 right-4">`);
    ThemeToggle($$renderer2, {});
    $$renderer2.push(`<!----></div> <div class="mb-2 flex items-center gap-2">`);
    LogoMark($$renderer2, { size: 28 });
    $$renderer2.push(`<!----> <span class="text-[18px] font-semibold tracking-tight text-[var(--foreground)]">AuditLift</span></div> <p class="mb-8 text-[13px] text-[var(--foreground-muted)]">${escape_html(tagline())}</p> <div class="w-full max-w-[340px] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--background-elevated)] p-8 shadow-[var(--shadow-md)]">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<h1 class="mb-1 text-[15px] font-semibold text-[var(--foreground)]">${escape_html(forgot_password_title())}</h1> <p class="mb-5 text-[13px] text-[var(--foreground-muted)]">${escape_html(forgot_password_subtitle())}</p> <form class="space-y-3"><input type="email"${attr("value", email)}${attr("placeholder", forgot_password_email_placeholder())} class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none" required=""/> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <button type="submit"${attr("disabled", loading, true)} class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--brand)] px-4 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60">`);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> ${escape_html(forgot_password_submit())}</button></form>`);
    }
    $$renderer2.push(`<!--]--></div> <p class="mt-6 text-[12px] text-[var(--foreground-subtle)]"><a href="/login" class="hover:text-[var(--foreground)] hover:underline">${escape_html(forgot_password_back_to_signin())}</a></p></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DhN6X3St.js.map
