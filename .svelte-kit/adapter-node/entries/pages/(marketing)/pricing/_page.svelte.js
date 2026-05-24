import { a2 as head, a9 as attr_class, a3 as ensure_array_like, a5 as escape_html, a4 as attr, ac as stringify } from "../../../../chunks/index3.js";
import { A as ArrowRight } from "../../../../chunks/ArrowRight.js";
import { C as Check } from "../../../../chunks/Check.js";
import { E as Envelope } from "../../../../chunks/Envelope.js";
import { H as Handshake } from "../../../../chunks/Handshake.js";
import { L as LogoMark, T as ThemeToggle } from "../../../../chunks/ThemeToggle.js";
import { C as Card } from "../../../../chunks/Card.js";
import { B as Badge } from "../../../../chunks/Badge.js";
import { C as ConsultingModal } from "../../../../chunks/ConsultingModal.js";
import { g as getLocale } from "../../../../chunks/runtime.js";
const en_consulting_cta_pricing_headline = (
  /** @type {(inputs: Consulting_Cta_Pricing_HeadlineInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Need a compliance partner?`
    );
  }
);
const consulting_cta_pricing_headline = (
  /** @type {((inputs?: Consulting_Cta_Pricing_HeadlineInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Consulting_Cta_Pricing_HeadlineInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_consulting_cta_pricing_headline();
  })
);
const en_consulting_cta_pricing_body = (
  /** @type {(inputs: Consulting_Cta_Pricing_BodyInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Our advisory team works directly with founders to fast-track compliance, answer tough questionnaires, and prepare for audits.`
    );
  }
);
const consulting_cta_pricing_body = (
  /** @type {((inputs?: Consulting_Cta_Pricing_BodyInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Consulting_Cta_Pricing_BodyInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_consulting_cta_pricing_body();
  })
);
const en_consulting_cta_pricing_button = (
  /** @type {(inputs: Consulting_Cta_Pricing_ButtonInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Book a free intro call`
    );
  }
);
const consulting_cta_pricing_button = (
  /** @type {((inputs?: Consulting_Cta_Pricing_ButtonInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Consulting_Cta_Pricing_ButtonInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_consulting_cta_pricing_button();
  })
);
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let consultingOpen = false;
    const plans = [
      {
        id: "starter",
        name: "Starter",
        description: "For founders who need to answer security questionnaires and close their first enterprise deals.",
        monthlyPrice: 149,
        yearlyPrice: 1431,
        highlighted: false,
        cta: "Start free trial",
        ctaHref: "/login",
        features: [
          "1 compliance framework (SOC 2)",
          "Unlimited controls & evidence",
          "AI-powered policy generator",
          "Auditor-ready export package",
          "Up to 5 team members",
          "Email support",
          "Readiness score dashboard",
          "14-day free trial"
        ]
      },
      {
        id: "growth",
        name: "Growth",
        description: "For teams responding to multiple frameworks across a growing pipeline of enterprise deals.",
        monthlyPrice: 299,
        yearlyPrice: 2870,
        highlighted: true,
        cta: "Start free trial",
        ctaHref: "/login",
        features: [
          "All 3 frameworks (SOC 2, PCI-DSS, ISO 27001)",
          "Unlimited controls & evidence",
          "AI-powered policy generator",
          "Auditor-ready export package",
          "Unlimited team members",
          "Priority email support",
          "Readiness score dashboard",
          "14-day free trial"
        ]
      }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("133tnjx", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Pricing — AuditLift | Security Readiness for Closing Deals</title>`);
        });
        $$renderer4.push(`<meta name="description" content="Simple, flat-rate pricing to get deal-ready for SOC 2, PCI-DSS, and ISO 27001. Starter from $149/mo. No per-seat pricing. Cancel anytime. 14-day free trial."/> <link rel="canonical" href="https://auditlift.app/pricing"/> <meta property="og:type" content="website"/> <meta property="og:url" content="https://auditlift.app/pricing"/> <meta property="og:site_name" content="AuditLift"/> <meta property="og:title" content="Pricing — AuditLift | SOC 2 Compliance Software"/> <meta property="og:description" content="SOC 2 compliance from $149/mo. No per-seat pricing. All 3 frameworks on Growth. 14-day free trial."/> <meta property="og:image" content="https://auditlift.app/og.png"/> <meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:title" content="Pricing — AuditLift"/> <meta name="twitter:description" content="SOC 2 compliance from $149/mo. No per-seat pricing. 14-day free trial."/> <meta name="twitter:image" content="https://auditlift.app/og.png"/>`);
      });
      $$renderer3.push(`<nav class="fixed top-0 right-0 left-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm"><div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-6"><a href="/" class="flex items-center gap-2 no-underline">`);
      LogoMark($$renderer3, { size: 20 });
      $$renderer3.push(`<!----> <span class="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">AuditLift</span></a> <div class="flex items-center gap-3">`);
      ThemeToggle($$renderer3, {});
      $$renderer3.push(`<!----> <a href="/login" class="text-[13px] font-medium text-[var(--foreground-muted)] no-underline hover:text-[var(--foreground)]">Sign in</a> <a href="/login" class="rounded-[var(--radius)] bg-[var(--brand)] px-3 py-1.5 text-[13px] font-medium text-white no-underline hover:bg-[var(--brand-hover)]">Start free trial</a></div></div></nav> <div class="flex min-h-screen flex-col bg-[var(--background)]"><section class="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-32 pb-24"><div class="mb-3 text-center"><h1 class="text-4xl font-bold tracking-tight text-[var(--foreground)]">Simple, transparent pricing</h1> <p class="mt-3 text-[15px] text-[var(--foreground-muted)]">No hidden fees. No per-seat pricing. Cancel any time.</p></div> <div class="my-8 inline-flex items-center rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--background-alt)] p-1"><button${attr_class(`cursor-pointer rounded-[var(--radius-full)] px-4 py-1.5 text-[13px] font-medium transition-all ${stringify(
        "bg-white text-[var(--foreground)] shadow-sm"
      )}`)}>Monthly</button> <button${attr_class(`flex cursor-pointer items-center gap-2 rounded-[var(--radius-full)] px-4 py-1.5 text-[13px] font-medium transition-all ${stringify("text-[var(--foreground-muted)] hover:text-[var(--foreground)]")}`)}>Yearly <span class="rounded-full bg-[var(--success-light)] px-2 py-0.5 text-[11px] font-semibold text-[var(--success)]">Save 20%</span></button></div> <div class="grid w-full grid-cols-1 gap-6 md:grid-cols-3"><!--[-->`);
      const each_array = ensure_array_like(plans);
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let plan = each_array[$$index_1];
        Card($$renderer3, {
          class: `relative flex flex-col p-8 ${stringify(plan.highlighted ? "border-[var(--brand)] ring-1 ring-[var(--brand)]" : "")}`,
          children: ($$renderer4) => {
            if (plan.highlighted) {
              $$renderer4.push("<!--[0-->");
              $$renderer4.push(`<div class="absolute -top-3 left-1/2 -translate-x-1/2">`);
              Badge($$renderer4, {
                variant: "info",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Most popular`);
                }
              });
              $$renderer4.push(`<!----></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--> <div class="mb-6"><p class="text-[13px] font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">${escape_html(plan.name)}</p> <div class="mt-2 flex items-baseline gap-1"><span class="text-4xl font-bold tracking-tight text-[var(--foreground)]">$${escape_html(plan.monthlyPrice)}</span> <span class="text-[15px] text-[var(--foreground-muted)]">/mo</span></div> `);
            {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--> <p class="mt-3 text-[13px] text-[var(--foreground-muted)]">${escape_html(plan.description)}</p></div> <div class="mb-8 flex-1 space-y-3"><!--[-->`);
            const each_array_1 = ensure_array_like(plan.features);
            for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
              let feature = each_array_1[$$index];
              $$renderer4.push(`<div class="flex items-start gap-3"><div class="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[var(--success-light)]">`);
              Check($$renderer4, { size: 10, color: "var(--success)", weight: "bold" });
              $$renderer4.push(`<!----></div> <span class="text-[13px] text-[var(--foreground)]">${escape_html(feature)}</span></div>`);
            }
            $$renderer4.push(`<!--]--></div> <a${attr("href", plan.ctaHref)}${attr_class(`flex items-center justify-center gap-2 rounded-[var(--radius)] px-5 py-2.5 text-[14px] font-medium no-underline transition-colors ${stringify(plan.highlighted ? "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]" : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-alt)]")}`)}>${escape_html(plan.cta)} `);
            ArrowRight($$renderer4, { size: 14 });
            $$renderer4.push(`<!----></a>`);
          }
        });
      }
      $$renderer3.push(`<!--]--> `);
      Card($$renderer3, {
        class: "flex flex-col p-8",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="mb-6"><p class="text-[13px] font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">Enterprise</p> <div class="mt-2"><span class="text-2xl font-bold text-[var(--foreground)]">Custom</span></div> <p class="mt-3 text-[13px] text-[var(--foreground-muted)]">For larger teams with complex security review requirements, SSO, and dedicated
						onboarding.</p></div> <div class="mb-8 flex-1 space-y-3"><!--[-->`);
          const each_array_2 = ensure_array_like([
            "Everything in Growth",
            "SSO / SAML",
            "Dedicated onboarding",
            "SLA & uptime guarantees",
            "Custom contract & billing",
            "Priority phone support"
          ]);
          for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
            let feature = each_array_2[$$index_2];
            $$renderer4.push(`<div class="flex items-start gap-3"><div class="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[var(--success-light)]">`);
            Check($$renderer4, { size: 10, color: "var(--success)", weight: "bold" });
            $$renderer4.push(`<!----></div> <span class="text-[13px] text-[var(--foreground)]">${escape_html(feature)}</span></div>`);
          }
          $$renderer4.push(`<!--]--></div> <a href="mailto:hello@auditlift.app" class="flex items-center justify-center gap-2 rounded-[var(--radius)] border border-[var(--border)] px-5 py-2.5 text-[14px] font-medium text-[var(--foreground)] no-underline transition-colors hover:bg-[var(--background-alt)]">`);
          Envelope($$renderer4, { size: 14 });
          $$renderer4.push(`<!----> Talk to us</a>`);
        }
      });
      $$renderer3.push(`<!----></div> <p class="mt-10 text-center text-[13px] text-[var(--foreground-muted)]">Vanta and Drata start at $7,500/yr and are built for post-audit maintenance. AuditLift gets
			you <strong>deal-ready from $149/mo</strong> — focused on helping you respond and close.</p> <div class="mt-14 flex flex-col items-center gap-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--background-alt)] px-8 py-10 text-center sm:flex-row sm:text-left"><div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand-light)]">`);
      Handshake($$renderer3, { size: 24, color: "var(--brand)" });
      $$renderer3.push(`<!----></div> <div class="flex-1"><p class="text-[15px] font-semibold text-[var(--foreground)]">${escape_html(consulting_cta_pricing_headline())}</p> <p class="mt-1 text-[13px] text-[var(--foreground-muted)]">${escape_html(consulting_cta_pricing_body())}</p></div> <button class="shrink-0 rounded-[var(--radius)] border border-[var(--brand)] bg-transparent px-5 py-2.5 text-[14px] font-medium text-[var(--brand)] transition-colors hover:bg-[var(--brand)] hover:text-white">${escape_html(consulting_cta_pricing_button())}</button></div> `);
      ConsultingModal($$renderer3, {
        get open() {
          return consultingOpen;
        },
        set open($$value) {
          consultingOpen = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></section> <footer class="border-t border-[var(--border)] py-8"><div class="mx-auto flex max-w-6xl items-center justify-between px-6"><p class="text-[12px] text-[var(--foreground-subtle)]">© 2026 AuditLift. All rights reserved.</p> <div class="flex items-center gap-4"><a href="/" class="text-[12px] text-[var(--foreground-subtle)] no-underline hover:text-[var(--foreground)]">Home</a> <a href="/pricing" class="text-[12px] text-[var(--foreground-subtle)] no-underline hover:text-[var(--foreground)]">Pricing</a> <a href="/privacy" class="text-[12px] text-[var(--foreground-subtle)] no-underline hover:text-[var(--foreground)]">Privacy</a></div></div></footer></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
export {
  _page as default
};
