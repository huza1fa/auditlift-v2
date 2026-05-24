import { a9 as attr_class, ac as stringify, _ as derived } from "../../../../chunks/index3.js";
import { B as Buildings } from "../../../../chunks/Buildings.js";
import { C as ChartLine } from "../../../../chunks/ChartLine.js";
import { C as CreditCard } from "../../../../chunks/CreditCard.js";
import { N as Notebook } from "../../../../chunks/Notebook.js";
import { U as Users } from "../../../../chunks/Users.js";
import { p as page } from "../../../../chunks/index6.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    const currentPath = derived(() => page.url.pathname);
    $$renderer2.push(`<div class="space-y-6"><h1 class="text-2xl font-bold text-[var(--foreground)]">Settings</h1> <div class="flex gap-1 border-b border-[var(--border)]"><a href="/settings"${attr_class(`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${stringify(currentPath() === "/settings" ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]")}`)}>`);
    Buildings($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Organization</a> <a href="/settings/team"${attr_class(`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${stringify(currentPath().includes("/settings/team") ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]")}`)}>`);
    Users($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Team</a> <a href="/settings/system"${attr_class(`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${stringify(currentPath().includes("/settings/system") ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]")}`)}>`);
    Notebook($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> System Description</a> <a href="/settings/billing"${attr_class(`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${stringify(currentPath().includes("/settings/billing") ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]")}`)}>`);
    CreditCard($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Billing</a> <a href="/settings/activity"${attr_class(`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${stringify(currentPath().includes("/settings/activity") ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]")}`)}>`);
    ChartLine($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Activity</a></div> `);
    children($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
export {
  _layout as default
};
