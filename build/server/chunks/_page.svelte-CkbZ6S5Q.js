import { ab as head, ag as attr_class, ac as ensure_array_like, ai as stringify, ae as escape_html, ad as attr } from './index3-A6PWQL_h.js';
import { A as ArrowRight } from './ArrowRight-DIl4ZNuw.js';
import { C as Check } from './Check-BpJ48H7I.js';
import { E as Envelope } from './Envelope-BaoSZOkY.js';
import { L as LogoMark, T as ThemeToggle } from './ThemeToggle-BNoFUzMa.js';
import { C as Card } from './Card-B7pxgW8R.js';
import { B as Badge } from './Badge-Cer8O6lG.js';
import './context-CZy4Dq81.js';

function _page($$renderer) {
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
  head("133tnjx", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Pricing — AuditLift | Security Readiness for Closing Deals</title>`);
    });
    $$renderer2.push(`<meta name="description" content="Simple, flat-rate pricing to get deal-ready for SOC 2, PCI-DSS, and ISO 27001. Starter from $149/mo. No per-seat pricing. Cancel anytime. 14-day free trial."/> <link rel="canonical" href="https://auditlift.app/pricing"/> <meta property="og:type" content="website"/> <meta property="og:url" content="https://auditlift.app/pricing"/> <meta property="og:site_name" content="AuditLift"/> <meta property="og:title" content="Pricing — AuditLift | SOC 2 Compliance Software"/> <meta property="og:description" content="SOC 2 compliance from $149/mo. No per-seat pricing. All 3 frameworks on Growth. 14-day free trial."/> <meta property="og:image" content="https://auditlift.app/og.png"/> <meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:title" content="Pricing — AuditLift"/> <meta name="twitter:description" content="SOC 2 compliance from $149/mo. No per-seat pricing. 14-day free trial."/> <meta name="twitter:image" content="https://auditlift.app/og.png"/>`);
  });
  $$renderer.push(`<nav class="fixed top-0 right-0 left-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm"><div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-6"><a href="/" class="flex items-center gap-2 no-underline">`);
  LogoMark($$renderer, { size: 20 });
  $$renderer.push(`<!----> <span class="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">AuditLift</span></a> <div class="flex items-center gap-3">`);
  ThemeToggle($$renderer, {});
  $$renderer.push(`<!----> <a href="/login" class="text-[13px] font-medium text-[var(--foreground-muted)] no-underline hover:text-[var(--foreground)]">Sign in</a> <a href="/login" class="rounded-[var(--radius)] bg-[var(--brand)] px-3 py-1.5 text-[13px] font-medium text-white no-underline hover:bg-[var(--brand-hover)]">Start free trial</a></div></div></nav> <div class="flex min-h-screen flex-col bg-[var(--background)]"><section class="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-32 pb-24"><div class="mb-3 text-center"><h1 class="text-4xl font-bold tracking-tight text-[var(--foreground)]">Simple, transparent pricing</h1> <p class="mt-3 text-[15px] text-[var(--foreground-muted)]">No hidden fees. No per-seat pricing. Cancel any time.</p></div> <div class="my-8 inline-flex items-center rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--background-alt)] p-1"><button${attr_class(`cursor-pointer rounded-[var(--radius-full)] px-4 py-1.5 text-[13px] font-medium transition-all ${stringify(
    "bg-white text-[var(--foreground)] shadow-sm"
  )}`)}>Monthly</button> <button${attr_class(`flex cursor-pointer items-center gap-2 rounded-[var(--radius-full)] px-4 py-1.5 text-[13px] font-medium transition-all ${stringify("text-[var(--foreground-muted)] hover:text-[var(--foreground)]")}`)}>Yearly <span class="rounded-full bg-[var(--success-light)] px-2 py-0.5 text-[11px] font-semibold text-[var(--success)]">Save 20%</span></button></div> <div class="grid w-full grid-cols-1 gap-6 md:grid-cols-3"><!--[-->`);
  const each_array = ensure_array_like(plans);
  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
    let plan = each_array[$$index_1];
    Card($$renderer, {
      class: `relative flex flex-col p-8 ${stringify(plan.highlighted ? "border-[var(--brand)] ring-1 ring-[var(--brand)]" : "")}`,
      children: ($$renderer2) => {
        if (plan.highlighted) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="absolute -top-3 left-1/2 -translate-x-1/2">`);
          Badge($$renderer2, {
            variant: "info",
            children: ($$renderer3) => {
              $$renderer3.push(`<!---->Most popular`);
            }
          });
          $$renderer2.push(`<!----></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="mb-6"><p class="text-[13px] font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">${escape_html(plan.name)}</p> <div class="mt-2 flex items-baseline gap-1"><span class="text-4xl font-bold tracking-tight text-[var(--foreground)]">$${escape_html(plan.monthlyPrice)}</span> <span class="text-[15px] text-[var(--foreground-muted)]">/mo</span></div> `);
        {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <p class="mt-3 text-[13px] text-[var(--foreground-muted)]">${escape_html(plan.description)}</p></div> <div class="mb-8 flex-1 space-y-3"><!--[-->`);
        const each_array_1 = ensure_array_like(plan.features);
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let feature = each_array_1[$$index];
          $$renderer2.push(`<div class="flex items-start gap-3"><div class="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[var(--success-light)]">`);
          Check($$renderer2, { size: 10, color: "var(--success)", weight: "bold" });
          $$renderer2.push(`<!----></div> <span class="text-[13px] text-[var(--foreground)]">${escape_html(feature)}</span></div>`);
        }
        $$renderer2.push(`<!--]--></div> <a${attr("href", plan.ctaHref)}${attr_class(`flex items-center justify-center gap-2 rounded-[var(--radius)] px-5 py-2.5 text-[14px] font-medium no-underline transition-colors ${stringify(plan.highlighted ? "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]" : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-alt)]")}`)}>${escape_html(plan.cta)} `);
        ArrowRight($$renderer2, { size: 14 });
        $$renderer2.push(`<!----></a>`);
      }
    });
  }
  $$renderer.push(`<!--]--> `);
  Card($$renderer, {
    class: "flex flex-col p-8",
    children: ($$renderer2) => {
      $$renderer2.push(`<div class="mb-6"><p class="text-[13px] font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">Enterprise</p> <div class="mt-2"><span class="text-2xl font-bold text-[var(--foreground)]">Custom</span></div> <p class="mt-3 text-[13px] text-[var(--foreground-muted)]">For larger teams with complex security review requirements, SSO, and dedicated onboarding.</p></div> <div class="mb-8 flex-1 space-y-3"><!--[-->`);
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
        $$renderer2.push(`<div class="flex items-start gap-3"><div class="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[var(--success-light)]">`);
        Check($$renderer2, { size: 10, color: "var(--success)", weight: "bold" });
        $$renderer2.push(`<!----></div> <span class="text-[13px] text-[var(--foreground)]">${escape_html(feature)}</span></div>`);
      }
      $$renderer2.push(`<!--]--></div> <a href="mailto:hello@auditlift.app" class="flex items-center justify-center gap-2 rounded-[var(--radius)] border border-[var(--border)] px-5 py-2.5 text-[14px] font-medium text-[var(--foreground)] no-underline transition-colors hover:bg-[var(--background-alt)]">`);
      Envelope($$renderer2, { size: 14 });
      $$renderer2.push(`<!----> Talk to us</a>`);
    }
  });
  $$renderer.push(`<!----></div> <p class="mt-10 text-center text-[13px] text-[var(--foreground-muted)]">Vanta and Drata start at $7,500/yr and are built for post-audit maintenance.
			AuditLift gets you <strong>deal-ready from $149/mo</strong> — focused on helping you respond and close.</p></section> <footer class="border-t border-[var(--border)] py-8"><div class="mx-auto flex max-w-6xl items-center justify-between px-6"><p class="text-[12px] text-[var(--foreground-subtle)]">© 2026 AuditLift. All rights reserved.</p> <div class="flex items-center gap-4"><a href="/" class="text-[12px] text-[var(--foreground-subtle)] no-underline hover:text-[var(--foreground)]">Home</a> <a href="/pricing" class="text-[12px] text-[var(--foreground-subtle)] no-underline hover:text-[var(--foreground)]">Pricing</a> <a href="/privacy" class="text-[12px] text-[var(--foreground-subtle)] no-underline hover:text-[var(--foreground)]">Privacy</a></div></div></footer></div>`);
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CkbZ6S5Q.js.map
