import { a3 as attr, a8 as attr_class, ac as clsx, ab as stringify } from "./index3.js";
function LogoMark($$renderer, $$props) {
  let { size = 20, class: className = "" } = $$props;
  $$renderer.push(`<svg${attr("width", size)}${attr("height", size)} viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg"${attr_class(clsx(className))} aria-hidden="true"><path d="M10 1L19 5V14L10 23L1 14V5L10 1Z" fill="var(--brand)"></path><path d="M10 5L15.5 7.5V13L10 18.5L4.5 13V7.5L10 5Z" fill="var(--brand-foreground)" opacity="0.15"></path><path d="M10 8.5L12.5 11L10 13.5L7.5 11L10 8.5Z" fill="var(--brand-foreground)" opacity="0.5"></path></svg>`);
}
function ThemeToggle($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "" } = $$props;
    $$renderer2.push(`<button${attr_class(`flex h-7 w-7 items-center justify-center rounded-[var(--radius)] text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)] ${stringify(className)}`)}${attr("aria-label", "Switch to dark mode")}${attr("title", "Dark mode")}>`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`);
    }
    $$renderer2.push(`<!--]--></button>`);
  });
}
export {
  LogoMark as L,
  ThemeToggle as T
};
