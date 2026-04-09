import { ag as attr_class, ai as stringify, X as derived } from './index3-A6PWQL_h.js';
import { B as Buildings } from './Buildings-CJmiqFPP.js';
import { C as ChartLine } from './ChartLine-DDRxUpQJ.js';
import { C as CreditCard } from './CreditCard-DGJ9YMy9.js';
import { U as Users } from './Users-CikAlWVe.js';
import { p as page } from './index6-j7psd7gS.js';
import './context-CZy4Dq81.js';
import './client-B5ZAjn4P.js';
import './state.svelte-CwtDSSSI.js';
import './root-kx8UrV8x.js';
import './client2-Bwd3FYwy.js';
import './index-BIEJqs8E.js';
import './exports-B5ORJhfK.js';

function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    const currentPath = derived(() => page.url.pathname);
    $$renderer2.push(`<div class="space-y-6"><h1 class="text-2xl font-bold text-[var(--foreground)]">Settings</h1> <div class="flex gap-1 border-b border-[var(--border)]"><a href="/settings"${attr_class(`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${stringify(currentPath() === "/settings" ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]")}`)}>`);
    Buildings($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Organization</a> <a href="/settings/team"${attr_class(`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${stringify(currentPath().includes("/settings/team") ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]")}`)}>`);
    Users($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Team</a> <a href="/settings/billing"${attr_class(`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${stringify(currentPath().includes("/settings/billing") ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]")}`)}>`);
    CreditCard($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Billing</a> <a href="/settings/activity"${attr_class(`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${stringify(currentPath().includes("/settings/activity") ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]")}`)}>`);
    ChartLine($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Activity</a></div> `);
    children($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-Dkc_1R8K.js.map
