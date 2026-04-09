import { a6 as attributes, a4 as escape_html, _ as derived, a2 as ensure_array_like, aa as attr_style, ab as stringify, a3 as attr } from "../../../../chunks/index3.js";
import { A as ArrowRight } from "../../../../chunks/ArrowRight.js";
import { C as CheckCircle } from "../../../../chunks/CheckCircle.js";
import { C as CheckSquare } from "../../../../chunks/CheckSquare.js";
import { g as getIconContext } from "../../../../chunks/context.js";
import { g as getLocale } from "../../../../chunks/runtime.js";
import { B as Badge } from "../../../../chunks/Badge.js";
import { C as Card } from "../../../../chunks/Card.js";
function Circle($$renderer, $$props) {
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
      $$renderer2.push(`<path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Z"></path>`);
    } else if (weight() === "duotone") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"></path>`);
    } else if (weight() === "fill") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<path d="M232,128A104,104,0,1,1,128,24,104.13,104.13,0,0,1,232,128Z"></path>`);
    } else if (weight() === "light") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<path d="M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Z"></path>`);
    } else if (weight() === "regular") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"></path>`);
    } else if (weight() === "thin") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<path d="M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.1,92.1,0,0,1,128,220Z"></path>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html((console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), ""))}`);
    }
    $$renderer2.push(`<!--]--></svg>`);
  });
}
const en_controls_empty_no_frameworks_title = (
  /** @type {(inputs: Controls_Empty_No_Frameworks_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `No frameworks selected`
    );
  }
);
const controls_empty_no_frameworks_title = (
  /** @type {((inputs?: Controls_Empty_No_Frameworks_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Controls_Empty_No_Frameworks_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_controls_empty_no_frameworks_title();
  })
);
const en_controls_empty_no_frameworks_body = (
  /** @type {(inputs: Controls_Empty_No_Frameworks_BodyInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Go to settings to select a compliance framework to track.`
    );
  }
);
const controls_empty_no_frameworks_body = (
  /** @type {((inputs?: Controls_Empty_No_Frameworks_BodyInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Controls_Empty_No_Frameworks_BodyInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_controls_empty_no_frameworks_body();
  })
);
const en_controls_empty_no_frameworks_link = (
  /** @type {(inputs: Controls_Empty_No_Frameworks_LinkInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Go to settings →`
    );
  }
);
const controls_empty_no_frameworks_link = (
  /** @type {((inputs?: Controls_Empty_No_Frameworks_LinkInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Controls_Empty_No_Frameworks_LinkInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_controls_empty_no_frameworks_link();
  })
);
const en_controls_empty_no_controls_title = (
  /** @type {(inputs: Controls_Empty_No_Controls_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `No controls found`
    );
  }
);
const controls_empty_no_controls_title = (
  /** @type {((inputs?: Controls_Empty_No_Controls_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Controls_Empty_No_Controls_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_controls_empty_no_controls_title();
  })
);
const en_controls_empty_no_controls_body = (
  /** @type {(inputs: Controls_Empty_No_Controls_BodyInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Controls are loaded automatically for your selected framework.`
    );
  }
);
const controls_empty_no_controls_body = (
  /** @type {((inputs?: Controls_Empty_No_Controls_BodyInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Controls_Empty_No_Controls_BodyInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_controls_empty_no_controls_body();
  })
);
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    function getStatus(c) {
      if (c.evidenceCount === 0 && c.policyCount === 0) return "not-started";
      if (c.evidenceCount > 0 && c.policyCount > 0) return "complete";
      return "in-progress";
    }
    const grouped = derived(() => {
      const map = /* @__PURE__ */ new Map();
      for (const c of data.controls) {
        if (!map.has(c.category)) map.set(c.category, []);
        map.get(c.category).push(c);
      }
      return map;
    });
    $$renderer2.push(`<div class="space-y-6"><div class="flex items-center justify-between"><h1 class="text-2xl font-bold text-[var(--foreground)]">Controls</h1> `);
    if (data.frameworks && data.frameworks.length > 1) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<select class="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)]"><!--[-->`);
      const each_array = ensure_array_like(data.frameworks);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let fw = each_array[$$index];
        $$renderer2.option({ value: fw.slug, selected: fw.id === data.framework?.id }, ($$renderer3) => {
          $$renderer3.push(`${escape_html(fw.name)}`);
        });
      }
      $$renderer2.push(`<!--]--></select>`);
    } else if (data.framework) {
      $$renderer2.push("<!--[1-->");
      Badge($$renderer2, {
        variant: "info",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(data.framework.name)}`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (data.frameworks.length === 0) {
      $$renderer2.push("<!--[0-->");
      Card($$renderer2, {
        class: "p-10",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex flex-col items-center justify-center gap-3 text-center">`);
          CheckSquare($$renderer3, { size: 48, color: "var(--foreground-subtle)" });
          $$renderer3.push(`<!----> <p class="text-[15px] font-semibold text-[var(--foreground)]">${escape_html(controls_empty_no_frameworks_title())}</p> <p class="text-[13px] text-[var(--foreground-muted)]">${escape_html(controls_empty_no_frameworks_body())}</p> <a href="/settings" class="text-[13px] text-[var(--brand)] hover:underline">${escape_html(controls_empty_no_frameworks_link())}</a></div>`);
        }
      });
    } else if (data.controls.length === 0) {
      $$renderer2.push("<!--[1-->");
      Card($$renderer2, {
        class: "p-10",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex flex-col items-center justify-center gap-3 text-center">`);
          Circle($$renderer3, { size: 48, color: "var(--foreground-subtle)" });
          $$renderer3.push(`<!----> <p class="text-[15px] font-semibold text-[var(--foreground)]">${escape_html(controls_empty_no_controls_title())}</p> <p class="text-[13px] text-[var(--foreground-muted)]">${escape_html(controls_empty_no_controls_body())}</p></div>`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <!--[-->`);
    const each_array_1 = ensure_array_like(grouped());
    for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
      let [category, categoryControls] = each_array_1[$$index_2];
      const completed = categoryControls.filter((c) => c.complete).length;
      const total = categoryControls.length;
      Card($$renderer2, {
        class: "p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="mb-3 flex items-center justify-between"><h2 class="font-semibold text-[var(--foreground)]">${escape_html(category)}</h2> <span class="text-sm text-[var(--foreground-muted)]">${escape_html(completed)}/${escape_html(total)}</span></div> <div class="mb-4 h-1.5 w-full rounded-full bg-[var(--border)]"><div class="h-1.5 rounded-full bg-[var(--brand)] transition-all"${attr_style(`width: ${stringify(total > 0 ? completed / total * 100 : 0)}%`)}></div></div> <div class="space-y-2"><!--[-->`);
          const each_array_2 = ensure_array_like(categoryControls);
          for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
            let control = each_array_2[$$index_1];
            $$renderer3.push(`<a${attr("href", `/controls/${stringify(control.id)}`)} class="group flex items-center justify-between rounded-[var(--radius)] px-3 py-2 transition-colors hover:bg-[var(--background-alt)]"><div class="flex items-center gap-3">`);
            if (control.complete) {
              $$renderer3.push("<!--[0-->");
              CheckCircle($$renderer3, { size: 18, color: "var(--success)", weight: "fill" });
            } else {
              $$renderer3.push("<!--[-1-->");
              Circle($$renderer3, { size: 18, color: "var(--foreground-subtle)" });
            }
            $$renderer3.push(`<!--]--> <span class="w-12 font-mono text-xs text-[var(--foreground-muted)]">${escape_html(control.code)}</span> <span class="text-sm text-[var(--foreground)]">${escape_html(control.title)}</span></div> <div class="flex items-center gap-2">`);
            if (getStatus(control) === "complete") {
              $$renderer3.push("<!--[0-->");
              Badge($$renderer3, {
                variant: "success",
                children: ($$renderer4) => {
                  $$renderer4.push(`<!---->Complete`);
                }
              });
            } else if (getStatus(control) === "in-progress") {
              $$renderer3.push("<!--[1-->");
              Badge($$renderer3, {
                variant: "info",
                children: ($$renderer4) => {
                  $$renderer4.push(`<!---->In Progress`);
                }
              });
            } else {
              $$renderer3.push("<!--[-1-->");
              Badge($$renderer3, {
                variant: "warning",
                children: ($$renderer4) => {
                  $$renderer4.push(`<!---->Not Started`);
                }
              });
            }
            $$renderer3.push(`<!--]--> `);
            ArrowRight($$renderer3, {
              size: 14,
              color: "var(--foreground-muted)",
              class: "opacity-0 transition-opacity group-hover:opacity-100"
            });
            $$renderer3.push(`<!----></div></a>`);
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
