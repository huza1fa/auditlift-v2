import { ab as head, ae as escape_html, ad as attr, ah as attr_style, ac as ensure_array_like, ag as attr_class, ai as stringify, X as derived, aj as attributes } from './index3-A6PWQL_h.js';
import { S as ShieldCheck } from './ShieldCheck-D1JuyFWv.js';
import { g as getIconContext } from './context-CZy4Dq81.js';

function XCircle($$renderer, $$props) {
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
      $$renderer2.push(`<path d="M168.49,104.49,145,128l23.52,23.51a12,12,0,0,1-17,17L128,145l-23.51,23.52a12,12,0,0,1-17-17L111,128,87.51,104.49a12,12,0,0,1,17-17L128,111l23.51-23.52a12,12,0,0,1,17,17ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z"></path>`);
    } else if (weight() === "duotone") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path><path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>`);
    } else if (weight() === "fill") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>`);
    } else if (weight() === "light") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<path d="M164.24,100.24,136.48,128l27.76,27.76a6,6,0,1,1-8.48,8.48L128,136.48l-27.76,27.76a6,6,0,0,1-8.48-8.48L119.52,128,91.76,100.24a6,6,0,0,1,8.48-8.48L128,119.52l27.76-27.76a6,6,0,0,1,8.48,8.48ZM230,128A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z"></path>`);
    } else if (weight() === "regular") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>`);
    } else if (weight() === "thin") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<path d="M162.83,98.83,133.66,128l29.17,29.17a4,4,0,0,1-5.66,5.66L128,133.66,98.83,162.83a4,4,0,0,1-5.66-5.66L122.34,128,93.17,98.83a4,4,0,0,1,5.66-5.66L128,122.34l29.17-29.17a4,4,0,1,1,5.66,5.66ZM228,128A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128Z"></path>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html((console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), ""))}`);
    }
    $$renderer2.push(`<!--]--></svg>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const score = data.questionnaire.dealReadinessScore ?? 0;
    const ringSize = 80;
    const ringStroke = 7;
    const ringRadius = (ringSize - ringStroke) / 2;
    const ringCircumference = 2 * Math.PI * ringRadius;
    const ringOffset = ringCircumference - score / 100 * ringCircumference;
    function scoreColor(s) {
      if (s >= 70) return "var(--success)";
      if (s >= 40) return "var(--warning)";
      return "var(--danger)";
    }
    function confidenceBadge(c) {
      switch (c) {
        case "high":
          return {
            label: "High",
            cls: "bg-[var(--success-light)] text-[var(--success)]"
          };
        case "medium":
          return {
            label: "Medium",
            cls: "bg-[var(--info-light)] text-[var(--info)]"
          };
        case "low":
          return {
            label: "Low",
            cls: "bg-[var(--warning-light)] text-[var(--warning)]"
          };
        case "gap":
          return {
            label: "Gap",
            cls: "bg-[var(--danger-light)] text-[var(--danger)]"
          };
        default:
          return {
            label: "Unprocessed",
            cls: "bg-[var(--background-alt)] text-[var(--foreground-muted)]"
          };
      }
    }
    const grouped = derived(() => {
      const groups = [];
      let current = null;
      for (const q of data.questions) {
        if (!current || current.section !== q.sectionName) {
          current = { section: q.sectionName, questions: [] };
          groups.push(current);
        }
        current.questions.push(q);
      }
      return groups;
    });
    const sharedDate = new Date(data.questionnaire.sharedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    head("152is5u", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Security Questionnaire — ${escape_html(data.organizationName)} | AuditLift</title>`);
      });
      $$renderer3.push(`<meta name="robots" content="noindex, nofollow"/>`);
    });
    $$renderer2.push(`<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"><div class="mb-8 border-b border-[var(--border)] pb-8"><div class="mb-4 flex items-center gap-2 text-[var(--brand)]">`);
    ShieldCheck($$renderer2, { size: 24, weight: "fill" });
    $$renderer2.push(`<!----> <span class="text-lg font-semibold tracking-tight">AuditLift</span></div> <h1 class="mb-1 text-2xl font-bold text-[var(--foreground)]">Security Questionnaire</h1> <p class="mb-4 text-sm text-[var(--foreground-muted)]">Prepared by <strong>${escape_html(data.organizationName)}</strong> · ${escape_html(data.questionnaire.filename)} · Shared ${escape_html(sharedDate)}</p> <div class="flex flex-wrap items-center gap-6"><div class="flex items-center gap-3"><svg${attr("width", ringSize)}${attr("height", ringSize)} class="shrink-0 -rotate-90"><circle${attr("cx", ringSize / 2)}${attr("cy", ringSize / 2)}${attr("r", ringRadius)} fill="none" stroke="var(--border)"${attr("stroke-width", ringStroke)}></circle><circle${attr("cx", ringSize / 2)}${attr("cy", ringSize / 2)}${attr("r", ringRadius)} fill="none"${attr("stroke", scoreColor(score))}${attr("stroke-width", ringStroke)}${attr("stroke-dasharray", ringCircumference)}${attr("stroke-dashoffset", ringOffset)} stroke-linecap="round"></circle></svg> <div><p class="text-3xl font-bold"${attr_style(`color: ${stringify(scoreColor(score))}`)}>${escape_html(score)}%</p> <p class="text-xs text-[var(--foreground-muted)]">Deal Readiness</p></div></div> <div class="flex gap-4 text-sm text-[var(--foreground-muted)]"><div><p class="text-lg font-semibold text-[var(--foreground)]">${escape_html(data.questionnaire.answeredCount)}</p> <p class="text-xs">Answered</p></div> <div><p class="text-lg font-semibold text-[var(--danger)]">${escape_html(data.questionnaire.gapCount)}</p> <p class="text-xs">Gaps</p></div> <div><p class="text-lg font-semibold text-[var(--foreground)]">${escape_html(data.questionnaire.totalQuestions)}</p> <p class="text-xs">Total</p></div></div></div></div> <!--[-->`);
    const each_array = ensure_array_like(grouped());
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let group = each_array[$$index_1];
      if (group.section) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<h2 class="mt-8 mb-4 border-b border-[var(--border)] pb-2 text-sm font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">${escape_html(group.section)}</h2>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <!--[-->`);
      const each_array_1 = ensure_array_like(group.questions);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let q = each_array_1[$$index];
        $$renderer2.push(`<div class="mb-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background-elevated)] p-5"><div class="mb-2 flex items-start justify-between gap-3"><p class="text-sm font-medium text-[var(--foreground)]">`);
        if (q.questionNumber) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-[var(--foreground-subtle)]">#${escape_html(q.questionNumber)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> ${escape_html(q.questionText)}</p> <span${attr_class(`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${stringify(confidenceBadge(q.confidence).cls)}`)}>${escape_html(confidenceBadge(q.confidence).label)}</span></div> `);
        if (q.confidence === "gap") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="flex items-start gap-2 rounded-[var(--radius)] bg-[var(--danger-light)] px-3 py-2">`);
          XCircle($$renderer2, { size: 14, color: "var(--danger)", class: "mt-0.5 shrink-0" });
          $$renderer2.push(`<!----> <p class="text-xs text-[var(--danger)]">${escape_html(q.gapReason ?? "This question requires additional documentation.")}</p></div>`);
        } else if (q.answer) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<div class="rounded-[var(--radius)] bg-[var(--background-alt)] px-3 py-2.5"><p class="text-sm leading-relaxed whitespace-pre-wrap text-[var(--foreground)]">${escape_html(q.answer)}</p></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<p class="text-xs text-[var(--foreground-subtle)] italic">No answer available.</p>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> <div class="mt-12 border-t border-[var(--border)] pt-6 text-center"><div class="flex items-center justify-center gap-1.5 text-[var(--foreground-subtle)]">`);
    ShieldCheck($$renderer2, { size: 14 });
    $$renderer2.push(`<!----> <span class="text-xs">Powered by <a href="https://auditlift.app" class="font-medium text-[var(--brand)] hover:underline">AuditLift</a></span></div></div></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-MSIj8g_n.js.map
