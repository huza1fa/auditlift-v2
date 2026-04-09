import { ad as attr, ag as attr_class, ai as stringify } from './index3-A6PWQL_h.js';

function Button($$renderer, $$props) {
  let {
    variant = "primary",
    size = "md",
    disabled = false,
    type = "button",
    class: className = "",
    onclick,
    children
  } = $$props;
  const base = "inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius)] transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] disabled:opacity-50 disabled:pointer-events-none";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  const variants = {
    primary: "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] shadow-sm",
    secondary: "bg-[var(--background-elevated)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--background-alt)] shadow-sm",
    ghost: "bg-transparent text-[var(--foreground-muted)] hover:bg-[var(--background-alt)]",
    danger: "bg-[var(--danger)] text-white hover:opacity-90 shadow-sm"
  };
  $$renderer.push(`<button${attr("type", type)}${attr("disabled", disabled, true)}${attr_class(`${stringify(base)} ${stringify(sizes[size])} ${stringify(variants[variant])} ${stringify(className)}`)}>`);
  children($$renderer);
  $$renderer.push(`<!----></button>`);
}

export { Button as B };
//# sourceMappingURL=Button-CIQKvzrf.js.map
