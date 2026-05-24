import { a9 as attr_class, ac as stringify } from "./index3.js";
function Badge($$renderer, $$props) {
  let { variant = "default", class: className = "", children } = $$props;
  const variants = {
    success: "bg-[var(--success-light)] text-[var(--success)] border-[var(--success)]",
    warning: "bg-[var(--warning-light)] text-[var(--warning)] border-[var(--warning)]",
    danger: "bg-[var(--danger-light)] text-[var(--danger)] border-[var(--danger)]",
    info: "bg-[var(--info-light)] text-[var(--info)] border-[var(--info)]",
    default: "bg-[var(--background-alt)] text-[var(--foreground-muted)] border-[var(--border)]"
  };
  $$renderer.push(`<span${attr_class(`inline-flex items-center gap-1 rounded-[var(--radius-full)] border px-2 py-0.5 text-xs font-medium ${stringify(variants[variant])} ${stringify(className)}`)}>`);
  children($$renderer);
  $$renderer.push(`<!----></span>`);
}
export {
  Badge as B
};
