import { a9 as attr_class, a4 as attr, a5 as escape_html, a7 as attributes, ac as stringify, aj as bind_props, _ as derived } from "./index3.js";
function Input($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      label,
      id,
      error,
      value = "",
      placeholder = "",
      type = "text",
      required = false,
      disabled = false,
      class: className = "",
      $$slots,
      $$events,
      ...rest
    } = $$props;
    const inputId = derived(() => id ?? `input-${Math.random().toString(36).slice(2, 9)}`);
    $$renderer2.push(`<div${attr_class(`flex flex-col gap-1 ${stringify(className)}`)}>`);
    if (label) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<label${attr("for", inputId())} class="text-sm font-medium text-[var(--foreground)]">${escape_html(label)}`);
      if (required) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="ml-0.5 text-[var(--danger)]">*</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></label>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <input${attributes(
      {
        ...rest,
        id: inputId(),
        type,
        value,
        placeholder,
        required,
        disabled,
        class: `w-full rounded-[var(--radius)] border bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--foreground-muted)] focus:ring-2 focus:ring-[var(--border-focus)] focus:outline-none disabled:opacity-50 ${stringify(error ? "border-[var(--danger)] focus:ring-[var(--danger)]" : "border-[var(--border)]")}`
      },
      void 0,
      void 0,
      void 0,
      4
    )}/> `);
    if (error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-xs text-[var(--danger)]">${escape_html(error)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { value });
  });
}
export {
  Input as I
};
