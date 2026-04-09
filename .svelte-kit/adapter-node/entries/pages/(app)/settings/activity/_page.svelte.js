import { a6 as attributes, a4 as escape_html, _ as derived, a2 as ensure_array_like } from "../../../../../chunks/index3.js";
import { C as ChartLine } from "../../../../../chunks/ChartLine.js";
import { F as FileText } from "../../../../../chunks/FileText.js";
import { P as PencilSimple } from "../../../../../chunks/PencilSimple.js";
import { T as Trash } from "../../../../../chunks/Trash.js";
import { g as getIconContext } from "../../../../../chunks/context.js";
import { C as Card } from "../../../../../chunks/Card.js";
import { B as Badge } from "../../../../../chunks/Badge.js";
function UploadSimple($$renderer, $$props) {
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
      $$renderer2.push(`<path d="M228,144v64a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V144a12,12,0,0,1,24,0v52H204V144a12,12,0,0,1,24,0ZM96.49,80.49,116,61v83a12,12,0,0,0,24,0V61l19.51,19.52a12,12,0,1,0,17-17l-40-40a12,12,0,0,0-17,0l-40,40a12,12,0,1,0,17,17Z"></path>`);
    } else if (weight() === "duotone") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<path d="M216,48V208H40V48A16,16,0,0,1,56,32H200A16,16,0,0,1,216,48Z" opacity="0.2"></path><path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0ZM93.66,77.66,120,51.31V144a8,8,0,0,0,16,0V51.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,93.66,77.66Z"></path>`);
    } else if (weight() === "fill") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0ZM88,80h32v64a8,8,0,0,0,16,0V80h32a8,8,0,0,0,5.66-13.66l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,88,80Z"></path>`);
    } else if (weight() === "light") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<path d="M222,144v64a6,6,0,0,1-6,6H40a6,6,0,0,1-6-6V144a6,6,0,0,1,12,0v58H210V144a6,6,0,0,1,12,0ZM92.24,76.24,122,46.49V144a6,6,0,0,0,12,0V46.49l29.76,29.75a6,6,0,0,0,8.48-8.48l-40-40a6,6,0,0,0-8.48,0l-40,40a6,6,0,0,0,8.48,8.48Z"></path>`);
    } else if (weight() === "regular") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0ZM93.66,77.66,120,51.31V144a8,8,0,0,0,16,0V51.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,93.66,77.66Z"></path>`);
    } else if (weight() === "thin") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<path d="M220,144v64a4,4,0,0,1-4,4H40a4,4,0,0,1-4-4V144a4,4,0,0,1,8,0v60H212V144a4,4,0,0,1,8,0ZM90.83,74.83,124,41.66V144a4,4,0,0,0,8,0V41.66l33.17,33.17a4,4,0,1,0,5.66-5.66l-40-40a4,4,0,0,0-5.66,0l-40,40a4,4,0,0,0,5.66,5.66Z"></path>`);
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
    function actionLabel(action) {
      switch (action) {
        case "evidence.upload":
          return "Uploaded evidence";
        case "evidence.delete":
          return "Deleted evidence";
        case "policy.generate":
          return "Generated policy";
        case "policy.edit":
          return "Edited policy";
        default:
          return action;
      }
    }
    function actionIcon(action) {
      switch (action) {
        case "evidence.upload":
          return UploadSimple;
        case "evidence.delete":
          return Trash;
        case "policy.generate":
          return FileText;
        case "policy.edit":
          return PencilSimple;
        default:
          return ChartLine;
      }
    }
    function actionVariant(action) {
      switch (action) {
        case "evidence.upload":
          return "success";
        case "evidence.delete":
          return "danger";
        case "policy.generate":
          return "info";
        case "policy.edit":
          return "default";
        default:
          return "default";
      }
    }
    function formatTime(date) {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    $$renderer2.push(`<div class="space-y-4"><h2 class="text-base font-semibold text-[var(--foreground)]">ChartLine Log</h2> `);
    if (data.logs.length === 0) {
      $$renderer2.push("<!--[0-->");
      Card($$renderer2, {
        class: "p-8 text-center",
        children: ($$renderer3) => {
          ChartLine($$renderer3, {
            size: 40,
            color: "var(--foreground-subtle)",
            class: "mx-auto mb-3"
          });
          $$renderer3.push(`<!----> <p class="font-medium text-[var(--foreground)]">No activity yet</p> <p class="mt-1 text-sm text-[var(--foreground-muted)]">ChartLine will appear here as your team uploads evidence and generates policies.</p>`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
      Card($$renderer2, {
        class: "overflow-hidden p-0",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="divide-y divide-[var(--border)]"><!--[-->`);
          const each_array = ensure_array_like(data.logs);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let log = each_array[$$index];
            const Icon = actionIcon(log.action);
            $$renderer3.push(`<div class="flex items-start gap-4 px-6 py-4"><div class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--background-alt)]">`);
            if (Icon) {
              $$renderer3.push("<!--[-->");
              Icon($$renderer3, { size: 16, color: "var(--foreground-muted)" });
              $$renderer3.push("<!--]-->");
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push("<!--]-->");
            }
            $$renderer3.push(`</div> <div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><span class="text-sm font-medium text-[var(--foreground)]">${escape_html(log.userName ?? "A team member")}</span> `);
            Badge($$renderer3, {
              variant: actionVariant(log.action),
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(actionLabel(log.action))}`);
              }
            });
            $$renderer3.push(`<!----> `);
            if (log.controlCode) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<span class="font-mono text-xs text-[var(--foreground-muted)]">${escape_html(log.controlCode)}</span>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div> `);
            if (log.entityName) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<p class="mt-0.5 truncate text-sm text-[var(--foreground-muted)]">${escape_html(log.entityName)}</p>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div> <span class="flex-shrink-0 text-xs text-[var(--foreground-subtle)]">${escape_html(formatTime(log.createdAt))}</span></div>`);
          }
          $$renderer3.push(`<!--]--></div>`);
        }
      });
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
