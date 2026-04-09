import { ab as head, ag as attr_class, ae as escape_html, ac as ensure_array_like, ai as stringify, aj as attributes, X as derived } from './index3-A6PWQL_h.js';
import { A as ArrowRight } from './ArrowRight-DIl4ZNuw.js';
import { g as getIconContext } from './context-CZy4Dq81.js';
import { C as CheckSquare } from './CheckSquare-M7UmOwXB.js';
import { C as Check } from './Check-BpJ48H7I.js';
import { D as DownloadSimple } from './DownloadSimple-QtLQt_GW.js';
import { F as FileText } from './FileText-I3BE0SWy.js';
import { F as FolderOpen } from './FolderOpen-m_N8UBXL.js';
import { U as Users } from './Users-CikAlWVe.js';
import { L as LogoMark, T as ThemeToggle } from './ThemeToggle-BNoFUzMa.js';
import { h as html } from './html-FW6Ia4bL.js';

function ChartBar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const ctx = getIconContext();
    let { children, $$slots, $$events, ...props } = $$props;
    let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
    let color = derived(() => props.color ?? ctx.color ?? "currentColor");
    let size = derived(() => props.size ?? ctx.size ?? "1em");
    let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
    function svgAttr(obj) {
      let { weight: weight2, color: color2, size: size2, mirrored: mirrored2, ...attrs } = obj;
      return attrs;
    }
    $$renderer2.push(`<svg${attributes(
      {
        xmlns: "http://www.w3.org/2000/svg",
        role: "img",
        width: size(),
        height: size(),
        fill: color(),
        transform: mirrored() ? "scale(-1, 1)" : void 0,
        viewBox: "0 0 256 256",
        ...svgAttr(ctx),
        ...svgAttr(props)
      },
      void 0,
      void 0,
      void 0,
      3
    )}>`);
    if (children) {
      $$renderer2.push("<!--[0-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
    if (weight() === "bold") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<path d="M224,196h-4V40a12,12,0,0,0-12-12H152a12,12,0,0,0-12,12V76H96A12,12,0,0,0,84,88v36H48a12,12,0,0,0-12,12v60H32a12,12,0,0,0,0,24H224a12,12,0,0,0,0-24ZM164,52h32V196H164Zm-56,48h32v96H108ZM60,148H84v48H60Z"></path>`);
    } else if (weight() === "duotone") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<path d="M208,40V208H152V40Z" opacity="0.2"></path><path d="M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z"></path>`);
    } else if (weight() === "fill") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1,0-16h8V136a8,8,0,0,1,8-8H72a8,8,0,0,1,8,8v64H96V88a8,8,0,0,1,8-8h32a8,8,0,0,1,8,8V200h16V40a8,8,0,0,1,8-8h40a8,8,0,0,1,8,8V200h8A8,8,0,0,1,232,208Z"></path>`);
    } else if (weight() === "light") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<path d="M224,202H214V40a6,6,0,0,0-6-6H152a6,6,0,0,0-6,6V82H96a6,6,0,0,0-6,6v42H48a6,6,0,0,0-6,6v66H32a6,6,0,0,0,0,12H224a6,6,0,0,0,0-12ZM158,46h44V202H158ZM102,94h44V202H102ZM54,142H90v60H54Z"></path>`);
    } else if (weight() === "regular") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<path d="M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z"></path>`);
    } else if (weight() === "thin") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<path d="M224,204H212V40a4,4,0,0,0-4-4H152a4,4,0,0,0-4,4V84H96a4,4,0,0,0-4,4v44H48a4,4,0,0,0-4,4v68H32a4,4,0,0,0,0,8H224a4,4,0,0,0,0-8ZM156,44h48V204H156ZM100,92h48V204H100ZM52,140H92v64H52Z"></path>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html((console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), ""))}`);
    }
    $$renderer2.push(`<!--]--></svg>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let pricingPlan = "monthly";
    const headlines = [
      { line1: "Stop losing deals to", line2: "security questions" },
      {
        line1: "Answer questionnaires",
        line2: "in minutes, not weeks"
      },
      { line1: "Build SOC 2 readiness", line2: "while closing deals" },
      { line1: "Turn compliance into", line2: "a competitive edge" }
    ];
    let headlineIndex = 0;
    let headlineVisible = true;
    const pricingPlans = [
      {
        id: "starter",
        name: "Starter",
        monthlyPrice: 149,
        yearlyPrice: 1431,
        features: [
          "1 framework (SOC 2)",
          "Unlimited evidence & policies",
          "Up to 5 team members",
          "Auditor export",
          "14-day free trial"
        ]
      },
      {
        id: "growth",
        name: "Growth",
        monthlyPrice: 299,
        yearlyPrice: 2870,
        highlighted: true,
        features: [
          "All 3 frameworks",
          "Unlimited evidence & policies",
          "Unlimited team members",
          "Auditor export",
          "14-day free trial"
        ]
      }
    ];
    const features = [
      {
        icon: CheckSquare,
        title: "Framework Mapping",
        description: "Every SOC 2, PCI-DSS, and ISO 27001 requirement pre-loaded and mapped. Know exactly which controls a questionnaire is asking about.",
        iconBg: "feature-icon-brand"
      },
      {
        icon: FileText,
        title: "Policy Generator",
        description: "Generate the policies buyers actually ask for — tailored to your stack in minutes, editable in-browser.",
        iconBg: "feature-icon-success"
      },
      {
        icon: FolderOpen,
        title: "Evidence Locker",
        description: "Keep your proof organized and tagged to controls. Share instantly when a prospect asks for it.",
        iconBg: "feature-icon-info"
      },
      {
        icon: ChartBar,
        title: "Gap Visibility",
        description: "See what's incomplete before a prospect asks. Prioritize the gaps that are most likely to block a deal.",
        iconBg: "feature-icon-warning"
      },
      {
        icon: Users,
        title: "Team Collaboration",
        description: "Assign controls to the right owners — engineering, HR, legal. Everyone works from the same source of truth.",
        iconBg: "feature-icon-brand"
      },
      {
        icon: DownloadSimple,
        title: "Security Package Export",
        description: "One-click export of a clean, organized package — for auditors, prospects, or enterprise security reviews.",
        iconBg: "feature-icon-success"
      }
    ];
    const steps = [
      {
        number: "01",
        title: "Map your security posture",
        description: "Select the frameworks your prospects care about. Every requirement is pre-loaded — no setup from scratch."
      },
      {
        number: "02",
        title: "Fill gaps, generate policies",
        description: "See exactly what you can already answer and what needs work. Generate policies for the controls you're missing."
      },
      {
        number: "03",
        title: "Respond with confidence",
        description: "Answer questionnaires knowing your exact posture. Export a clean package for auditors or enterprise security reviews."
      }
    ];
    head("skv6c4", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>AuditLift — Win Deals Faster with Security Readiness</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Stop losing deals to unanswered security questionnaires. AuditLift maps your policies to SOC 2, PCI-DSS, and ISO 27001, surfaces gaps, and gives you the confidence to respond. From $149/mo."/> <link rel="canonical" href="https://auditlift.app"/> <meta property="og:type" content="website"/> <meta property="og:url" content="https://auditlift.app"/> <meta property="og:site_name" content="AuditLift"/> <meta property="og:title" content="AuditLift — Win Deals Faster with Security Readiness"/> <meta property="og:description" content="Stop losing deals to unanswered security questionnaires. Map your policies, surface gaps, and respond with confidence. No consultant needed."/> <meta property="og:image" content="https://auditlift.app/og.png"/> <meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:site" content="@auditlift"/> <meta name="twitter:title" content="AuditLift — Win Deals Faster with Security Readiness"/> <meta name="twitter:description" content="Stop losing deals to unanswered security questionnaires. Map policies, surface gaps, respond with confidence. From $149/mo."/> <meta name="twitter:image" content="https://auditlift.app/og.png"/> ${html(`<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://auditlift.app/#organization",
            name: "AuditLift",
            url: "https://auditlift.app",
            email: "hello@auditlift.app",
            description: "Deal-enablement platform that helps teams respond to security questionnaires, map policies to frameworks, and surface gaps before they cost you a deal."
          },
          {
            "@type": "WebSite",
            "@id": "https://auditlift.app/#website",
            url: "https://auditlift.app",
            name: "AuditLift",
            publisher: { "@id": "https://auditlift.app/#organization" }
          },
          {
            "@type": "SoftwareApplication",
            name: "AuditLift",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: "https://auditlift.app",
            description: "Stop losing deals to unanswered security questionnaires. Map policies to frameworks, surface gaps, and respond with confidence.",
            offers: [
              {
                "@type": "Offer",
                name: "Starter",
                price: "149.00",
                priceCurrency: "USD",
                description: "1 compliance framework, up to 5 team members, 14-day free trial"
              },
              {
                "@type": "Offer",
                name: "Growth",
                price: "299.00",
                priceCurrency: "USD",
                description: "All 3 frameworks, unlimited team members, 14-day free trial"
              }
            ]
          }
        ]
      })}<\/script>`)}`);
    });
    $$renderer2.push(`<nav class="nav-bar svelte-skv6c4"><div class="nav-inner svelte-skv6c4"><a href="/" class="nav-logo svelte-skv6c4">`);
    LogoMark($$renderer2, { size: 20 });
    $$renderer2.push(`<!----> <span class="nav-logo-text svelte-skv6c4">AuditLift</span></a> <div class="nav-links svelte-skv6c4"><button class="nav-link svelte-skv6c4">Features</button> <button class="nav-link svelte-skv6c4">Pricing</button></div> <div class="nav-actions svelte-skv6c4">`);
    ThemeToggle($$renderer2, {});
    $$renderer2.push(`<!----> <a href="/login" class="nav-signin svelte-skv6c4">Sign in</a> <a href="/login" class="btn-primary svelte-skv6c4">Start free trial</a></div></div></nav> <div class="page-wrapper svelte-skv6c4"><section class="hero-section svelte-skv6c4"><div class="hero-blob svelte-skv6c4" aria-hidden="true"></div> <div class="hero-dots svelte-skv6c4" aria-hidden="true"></div> <div class="hero-content svelte-skv6c4"><div class="eyebrow-pill svelte-skv6c4">SOC 2 · PCI-DSS · ISO 27001</div> <h1${attr_class("hero-headline svelte-skv6c4", void 0, {
      "headline-visible": headlineVisible,
      "headline-hidden": !headlineVisible
    })}>${escape_html(headlines[headlineIndex].line1)}<br/>${escape_html(headlines[headlineIndex].line2)}</h1> <p class="hero-subheadline svelte-skv6c4">AuditLift maps your policies to the frameworks buyers care about, surfaces exactly where
				you're ready and where you're not — so you can respond to security questionnaires with
				confidence, not guesswork.</p> <div class="hero-cta-row svelte-skv6c4"><a href="/login" class="btn-primary btn-lg svelte-skv6c4">Start free trial `);
    ArrowRight($$renderer2, { size: 16, weight: "bold" });
    $$renderer2.push(`<!----></a> <button class="btn-ghost btn-lg svelte-skv6c4">View pricing</button></div> <div class="hero-card-wrapper svelte-skv6c4"><div class="hero-card svelte-skv6c4"><div class="hero-card-header svelte-skv6c4"><div class="hero-card-title-group svelte-skv6c4"><p class="hero-card-label svelte-skv6c4">SOC 2 Readiness</p> <p class="hero-card-score svelte-skv6c4">73%</p></div> <div class="progress-ring-wrapper svelte-skv6c4"><svg class="progress-ring svelte-skv6c4" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="22" fill="none" stroke="var(--border)" stroke-width="5"></circle><circle cx="28" cy="28" r="22" fill="none" stroke="var(--brand)" stroke-width="5" stroke-linecap="round" stroke-dasharray="138.2" stroke-dashoffset="37.3"></circle></svg> <span class="progress-ring-label svelte-skv6c4">73%</span></div></div> <div class="hero-controls-list svelte-skv6c4"><div class="hero-control-item svelte-skv6c4"><span class="control-status-dot control-done svelte-skv6c4">`);
    Check($$renderer2, { size: 10, weight: "bold" });
    $$renderer2.push(`<!----></span> <span class="control-id svelte-skv6c4">CC6.1</span> <span class="control-name svelte-skv6c4">Access Control</span> <span class="control-badge control-badge-done svelte-skv6c4">Done</span></div> <div class="hero-control-item svelte-skv6c4"><span class="control-status-dot control-done svelte-skv6c4">`);
    Check($$renderer2, { size: 10, weight: "bold" });
    $$renderer2.push(`<!----></span> <span class="control-id svelte-skv6c4">CC7.2</span> <span class="control-name svelte-skv6c4">System Monitoring</span> <span class="control-badge control-badge-done svelte-skv6c4">Done</span></div> <div class="hero-control-item svelte-skv6c4"><span class="control-status-dot control-pending svelte-skv6c4"></span> <span class="control-id svelte-skv6c4">CC8.1</span> <span class="control-name svelte-skv6c4">Change Management</span> <span class="control-badge control-badge-pending svelte-skv6c4">Pending</span></div></div> <div class="hero-card-footer svelte-skv6c4"><span>4 controls remaining</span> <span class="hero-card-footer-dot svelte-skv6c4">·</span> <span>Updated just now</span></div></div></div></div></section> <section class="stats-bar svelte-skv6c4"><div class="stats-inner svelte-skv6c4"><div class="stat-item svelte-skv6c4"><p class="stat-value svelte-skv6c4">30 days or less</p> <p class="stat-label svelte-skv6c4">Average time to audit-ready</p></div> <div class="stat-divider svelte-skv6c4" aria-hidden="true"></div> <div class="stat-item svelte-skv6c4"><p class="stat-value svelte-skv6c4">From $149/mo</p> <p class="stat-label svelte-skv6c4">No per-seat pricing</p></div> <div class="stat-divider svelte-skv6c4" aria-hidden="true"></div> <div class="stat-item svelte-skv6c4"><p class="stat-value svelte-skv6c4">SOC 2 + PCI + ISO</p> <p class="stat-label svelte-skv6c4">All major frameworks</p></div></div></section> <section id="features" class="features-section svelte-skv6c4"><div class="section-inner svelte-skv6c4"><div class="section-header svelte-skv6c4"><p class="section-label svelte-skv6c4">Everything you need</p> <h2 class="section-headline svelte-skv6c4">Everything you need to get audit-ready</h2></div> <div class="features-grid svelte-skv6c4"><!--[-->`);
    const each_array = ensure_array_like(features);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let feature = each_array[$$index];
      $$renderer2.push(`<div class="feature-card svelte-skv6c4"><div${attr_class(`feature-icon-box ${stringify(feature.iconBg)}`, "svelte-skv6c4")}>`);
      if (feature.icon) {
        $$renderer2.push("<!--[-->");
        feature.icon($$renderer2, { size: 20 });
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
      $$renderer2.push(`</div> <h3 class="feature-title svelte-skv6c4">${escape_html(feature.title)}</h3> <p class="feature-description svelte-skv6c4">${escape_html(feature.description)}</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></section> <section class="steps-section svelte-skv6c4"><div class="section-inner svelte-skv6c4"><div class="section-header svelte-skv6c4"><p class="section-label svelte-skv6c4">Simple process</p> <h2 class="section-headline svelte-skv6c4">Three steps to audit-ready</h2></div> <div class="steps-row svelte-skv6c4"><!--[-->`);
    const each_array_1 = ensure_array_like(steps);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let step = each_array_1[i];
      $$renderer2.push(`<div class="step-item svelte-skv6c4"><div class="step-number-circle svelte-skv6c4">${escape_html(step.number)}</div> <h3 class="step-title svelte-skv6c4">${escape_html(step.title)}</h3> <p class="step-description svelte-skv6c4">${escape_html(step.description)}</p></div> `);
      if (i < steps.length - 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="step-arrow svelte-skv6c4" aria-hidden="true">`);
        ArrowRight($$renderer2, { size: 20 });
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div></section> <section id="pricing" class="pricing-section svelte-skv6c4"><div class="section-inner svelte-skv6c4"><div class="section-header svelte-skv6c4"><p class="section-label svelte-skv6c4">Simple pricing</p> <h2 class="section-headline svelte-skv6c4">Transparent pricing, no surprises</h2></div> <div class="pricing-toggle-wrapper svelte-skv6c4"><button${attr_class("pricing-toggle-btn svelte-skv6c4", void 0, { "active": pricingPlan === "monthly" })}>Monthly</button> <button${attr_class("pricing-toggle-btn svelte-skv6c4", void 0, { "active": pricingPlan === "yearly" })}>Yearly <span class="pricing-save-badge svelte-skv6c4">Save 20%</span></button></div> <div class="pricing-cards-grid svelte-skv6c4"><!--[-->`);
    const each_array_2 = ensure_array_like(pricingPlans);
    for (let $$index_3 = 0, $$length = each_array_2.length; $$index_3 < $$length; $$index_3++) {
      let plan = each_array_2[$$index_3];
      $$renderer2.push(`<div${attr_class(`pricing-card ${stringify(plan.highlighted ? "pricing-card--highlighted" : "")}`, "svelte-skv6c4")}><div class="pricing-card-body svelte-skv6c4"><div class="pricing-card-header svelte-skv6c4"><div><p class="pricing-plan-name svelte-skv6c4">${escape_html(plan.name)}</p></div> <div class="pricing-price-group svelte-skv6c4"><span class="pricing-price svelte-skv6c4">$${escape_html(plan.monthlyPrice)}</span> <span class="pricing-price-period svelte-skv6c4">/mo</span></div></div> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <ul class="pricing-features-list svelte-skv6c4"><!--[-->`);
      const each_array_3 = ensure_array_like(plan.features);
      for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
        let item = each_array_3[$$index_2];
        $$renderer2.push(`<li class="pricing-feature-item svelte-skv6c4"><span class="pricing-check-icon svelte-skv6c4">`);
        Check($$renderer2, { size: 14, weight: "bold" });
        $$renderer2.push(`<!----></span> ${escape_html(item)}</li>`);
      }
      $$renderer2.push(`<!--]--></ul> <a href="/login" class="btn-primary pricing-cta-btn svelte-skv6c4">Start free trial</a> <p class="pricing-trial-note svelte-skv6c4">14-day free trial. No credit card required.</p></div></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="competitor-compare svelte-skv6c4"><p class="competitor-compare-text svelte-skv6c4">Enterprise compliance tools typically cost <span class="competitor-name svelte-skv6c4">$7,500–$15,000/yr</span>. AuditLift starts at <span class="competitor-name svelte-skv6c4">$149/mo</span>.</p></div></div></section> <section class="final-cta-section svelte-skv6c4"><div class="final-cta-inner svelte-skv6c4"><h2 class="final-cta-headline svelte-skv6c4">Don't let security questions kill another deal.</h2> <p class="final-cta-sub svelte-skv6c4">Know exactly where you stand. Respond with confidence. Close faster.</p> <a href="/login" class="btn-primary btn-lg svelte-skv6c4">Get started free `);
    ArrowRight($$renderer2, { size: 16, weight: "bold" });
    $$renderer2.push(`<!----></a></div></section> <footer class="site-footer svelte-skv6c4"><div class="footer-inner svelte-skv6c4"><div class="footer-logo svelte-skv6c4">`);
    LogoMark($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> <span class="footer-logo-text svelte-skv6c4">AuditLift</span> <span class="footer-copy svelte-skv6c4">© 2026</span></div> <nav class="footer-links svelte-skv6c4" aria-label="Footer navigation"><a href="/" class="footer-link svelte-skv6c4">Home</a> <button class="footer-link svelte-skv6c4">Features</button> <button class="footer-link svelte-skv6c4">Pricing</button> <a href="/privacy" class="footer-link svelte-skv6c4">Privacy</a> <a href="/terms" class="footer-link svelte-skv6c4">Terms</a> <a href="/login" class="footer-link svelte-skv6c4">Sign in</a></nav> `);
    ThemeToggle($$renderer2, {});
    $$renderer2.push(`<!----></div></footer></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CKJVI4-E.js.map
