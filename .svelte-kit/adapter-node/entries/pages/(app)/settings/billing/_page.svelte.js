import { a3 as attr, a4 as escape_html, _ as derived, a8 as attr_class, ab as stringify } from "../../../../../chunks/index3.js";
import { A as ArrowLeft } from "../../../../../chunks/ArrowLeft.js";
import { C as Check } from "../../../../../chunks/Check.js";
import { C as CreditCard } from "../../../../../chunks/CreditCard.js";
import { S as ShieldCheck } from "../../../../../chunks/ShieldCheck.js";
import { W as Warning } from "../../../../../chunks/Warning.js";
import { C as Card } from "../../../../../chunks/Card.js";
import { B as Button } from "../../../../../chunks/Button.js";
import { B as Badge } from "../../../../../chunks/Badge.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let loading = null;
    let errorMsg = "";
    let selectedPlan = "starter";
    const plans = {
      starter: { monthly: 149, yearly: 1431 },
      growth: { monthly: 299, yearly: 2870 }
    };
    const monthlyPrice = derived(() => plans[selectedPlan].monthly);
    const yearlyTotal = derived(() => plans[selectedPlan].yearly);
    const yearlyMonthly = derived(() => Math.round(yearlyTotal() / 12));
    const yearlySavings = derived(() => monthlyPrice() * 12 - yearlyTotal());
    const isActive = derived(() => data.subscription?.status === "active");
    const isPastDue = derived(() => data.subscription?.status === "past_due");
    const isCanceled = derived(() => data.subscription?.status === "canceled");
    const isTrial = derived(() => !data.subscription || data.subscription?.status === "trialing");
    const trialDaysLeft = derived(() => {
      if (!data.organization?.trialEndsAt) return 0;
      const days = Math.ceil((new Date(data.organization.trialEndsAt).getTime() - Date.now()) / 864e5);
      return Math.max(0, days);
    });
    const trialExpired = derived(() => isTrial() && trialDaysLeft() <= 0);
    const periodEnd = derived(() => {
      if (!data.subscription?.currentPeriodEnd) return null;
      return new Date(data.subscription.currentPeriodEnd).toLocaleDateString("en-US", { dateStyle: "long" });
    });
    async function startCheckout(interval) {
      loading = interval;
      errorMsg = "";
      try {
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: selectedPlan, interval })
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.message || "Failed to start checkout");
        window.location.href = body.url;
      } catch (err) {
        errorMsg = err instanceof Error ? err.message : "Something went wrong";
        loading = null;
      }
    }
    async function openPortal() {
      loading = "portal";
      errorMsg = "";
      try {
        const res = await fetch("/api/billing/portal", { method: "POST" });
        const body = await res.json();
        if (!res.ok) throw new Error(body.message || "Failed to open portal");
        window.location.href = body.url;
      } catch (err) {
        errorMsg = err instanceof Error ? err.message : "Something went wrong";
        loading = null;
      }
    }
    $$renderer2.push(`<div class="space-y-6"><a href="/settings" class="flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]">`);
    ArrowLeft($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Back to Settings</a> <h1 class="text-2xl font-bold text-[var(--foreground)]">Billing</h1> `);
    if (trialExpired()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-[var(--radius-lg)] border border-[var(--danger)] bg-[var(--danger-light)] p-4"><div class="flex items-center gap-3">`);
      Warning($$renderer2, { size: 20, color: "var(--danger)", weight: "fill" });
      $$renderer2.push(`<!----> <div><p class="font-semibold text-[var(--danger)]">Your free trial has expired</p> <p class="text-sm text-[var(--foreground-muted)]">Choose a plan below to continue using AuditLift.</p></div></div></div>`);
    } else if (isTrial() && trialDaysLeft() > 0) {
      $$renderer2.push("<!--[1-->");
      Card($$renderer2, {
        class: "p-4",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex items-center gap-3">`);
          ShieldCheck($$renderer3, { size: 20, color: "var(--brand)", weight: "fill" });
          $$renderer3.push(`<!----> <div><p class="font-semibold text-[var(--foreground)]">Free trial — ${escape_html(trialDaysLeft())} day${escape_html(trialDaysLeft() !== 1 ? "s" : "")} remaining</p> <p class="text-sm text-[var(--foreground-muted)]">Choose a plan now so you don't lose access when the trial ends.</p></div></div>`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (isPastDue()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-[var(--radius-lg)] border border-[var(--warning)] bg-[var(--warning-light)] p-4"><div class="flex items-center gap-3">`);
      Warning($$renderer2, { size: 20, color: "var(--warning)", weight: "fill" });
      $$renderer2.push(`<!----> <div><p class="font-semibold text-[var(--warning)]">Payment failed</p> <p class="text-sm text-[var(--foreground-muted)]">Please update your payment method to restore access.</p></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    Card($$renderer2, {
      class: "p-6",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="mb-4 flex items-center gap-3">`);
        CreditCard($$renderer3, { size: 24, color: "var(--brand)" });
        $$renderer3.push(`<!----> <div><h2 class="font-semibold text-[var(--foreground)]">Current Plan</h2> <div class="mt-1 flex items-center gap-2">`);
        Badge($$renderer3, {
          variant: isActive() ? "success" : isPastDue() ? "warning" : isCanceled() ? "danger" : "info",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->${escape_html(isActive() ? "Active" : isPastDue() ? "Past Due" : isCanceled() ? "Canceled" : isTrial() ? "Trial" : data.subscription?.status ?? "Trial")}`);
          }
        });
        $$renderer3.push(`<!----> `);
        if (data.subscription?.cancelAtPeriodEnd) {
          $$renderer3.push("<!--[0-->");
          Badge($$renderer3, {
            variant: "warning",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Cancels at period end`);
            }
          });
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div></div></div> `);
        if (isActive() && periodEnd()) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<p class="mb-4 text-sm text-[var(--foreground-muted)]">${escape_html(data.subscription?.cancelAtPeriodEnd ? `Your subscription ends on ${periodEnd()}.` : `Your next billing date is ${periodEnd()}.`)}</p>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> <div class="mb-4 grid grid-cols-2 gap-3"><button${attr_class(`rounded-[var(--radius)] border p-4 text-left transition-colors ${stringify(
          "border-[var(--brand)] bg-[var(--brand-light)]"
        )}`)}><p class="font-semibold text-[var(--foreground)]">Starter</p> <p class="text-xs text-[var(--foreground-muted)]">1 framework · up to 5 members</p> <p class="mt-2 font-bold text-[var(--foreground)]">$149<span class="text-xs font-normal">/mo</span></p></button> <button${attr_class(`rounded-[var(--radius)] border p-4 text-left transition-colors ${stringify("border-[var(--border)] hover:bg-[var(--background-alt)]")}`)}><p class="font-semibold text-[var(--foreground)]">Growth</p> <p class="text-xs text-[var(--foreground-muted)]">All 3 frameworks · unlimited members</p> <p class="mt-2 font-bold text-[var(--foreground)]">$299<span class="text-xs font-normal">/mo</span></p></button></div> <div class="grid gap-4 md:grid-cols-2"><div${attr_class(`rounded-[var(--radius-lg)] border border-[var(--border)] p-4 transition-all ${stringify(isActive() && !data.subscription?.cancelAtPeriodEnd ? "border-[var(--brand)] bg-[var(--brand-light)]" : "")}`)}><div class="mb-3 flex items-center justify-between"><p class="font-semibold text-[var(--foreground)]">Monthly</p> `);
        if (isActive() && !data.subscription?.cancelAtPeriodEnd) {
          $$renderer3.push("<!--[0-->");
          Badge($$renderer3, {
            variant: "success",
            children: ($$renderer4) => {
              Check($$renderer4, { size: 10, weight: "bold" });
              $$renderer4.push(`<!----> Active`);
            }
          });
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div> <p class="mb-3 text-2xl font-bold text-[var(--foreground)]">$${escape_html(monthlyPrice())}<span class="text-sm font-normal text-[var(--foreground-muted)]">/month</span></p> <ul class="mb-4 space-y-1.5 text-sm text-[var(--foreground-muted)]"><li class="flex items-center gap-2">`);
        Check($$renderer3, { size: 14, color: "var(--success)", weight: "bold" });
        $$renderer3.push(`<!----> Unlimited controls &amp; evidence</li> <li class="flex items-center gap-2">`);
        Check($$renderer3, { size: 14, color: "var(--success)", weight: "bold" });
        $$renderer3.push(`<!----> Policy generator</li> <li class="flex items-center gap-2">`);
        Check($$renderer3, { size: 14, color: "var(--success)", weight: "bold" });
        $$renderer3.push(`<!----> Auditor export</li> <li class="flex items-center gap-2">`);
        Check($$renderer3, { size: 14, color: "var(--success)", weight: "bold" });
        $$renderer3.push(`<!----> Email support</li></ul> `);
        if (!isActive() || data.subscription?.cancelAtPeriodEnd) {
          $$renderer3.push("<!--[0-->");
          Button($$renderer3, {
            class: "w-full",
            onclick: () => startCheckout("monthly"),
            disabled: loading !== null,
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(loading === "monthly" ? "Redirecting..." : "Choose Monthly")}`);
            }
          });
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div> <div${attr_class(`relative rounded-[var(--radius-lg)] border p-4 transition-all ${stringify(isActive() && data.subscription?.cancelAtPeriodEnd ? "" : "border-[var(--border)]")} ${stringify(isActive() && !data.subscription?.cancelAtPeriodEnd && periodEnd() ? "" : "border-[var(--border)]")}`)}><div class="absolute -top-2.5 right-4">`);
        Badge($$renderer3, {
          variant: "success",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Save 20%`);
          }
        });
        $$renderer3.push(`<!----></div> <div class="mb-3 flex items-center justify-between"><p class="font-semibold text-[var(--foreground)]">Yearly</p></div> <p class="mb-1 text-2xl font-bold text-[var(--foreground)]">$${escape_html(yearlyMonthly())}<span class="text-sm font-normal text-[var(--foreground-muted)]">/month</span></p> <p class="mb-3 text-sm text-[var(--foreground-muted)]">$${escape_html(yearlyTotal().toLocaleString())}/year billed annually</p> <ul class="mb-4 space-y-1.5 text-sm text-[var(--foreground-muted)]"><li class="flex items-center gap-2">`);
        Check($$renderer3, { size: 14, color: "var(--success)", weight: "bold" });
        $$renderer3.push(`<!----> Everything in Monthly</li> <li class="flex items-center gap-2">`);
        Check($$renderer3, { size: 14, color: "var(--success)", weight: "bold" });
        $$renderer3.push(`<!----> Save $${escape_html(yearlySavings())}/year</li> <li class="flex items-center gap-2">`);
        Check($$renderer3, { size: 14, color: "var(--success)", weight: "bold" });
        $$renderer3.push(`<!----> Priority support</li></ul> `);
        Button($$renderer3, {
          variant: "secondary",
          class: "w-full",
          onclick: () => startCheckout("yearly"),
          disabled: loading !== null,
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->${escape_html(loading === "yearly" ? "Redirecting..." : "Choose Yearly")}`);
          }
        });
        $$renderer3.push(`<!----></div></div>`);
      }
    });
    $$renderer2.push(`<!----> `);
    if (isActive() && data.subscription?.stripeCustomerId) {
      $$renderer2.push("<!--[0-->");
      Card($$renderer2, {
        class: "p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<h2 class="mb-2 font-semibold text-[var(--foreground)]">Manage Subscription</h2> <p class="mb-4 text-sm text-[var(--foreground-muted)]">Update your payment method, view invoices, or cancel your subscription.</p> `);
          Button($$renderer3, {
            variant: "secondary",
            onclick: openPortal,
            disabled: loading !== null,
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(loading === "portal" ? "Opening..." : "Manage billing")}`);
            }
          });
          $$renderer3.push(`<!---->`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (errorMsg) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-sm text-[var(--danger)]">${escape_html(errorMsg)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="mt-2 flex items-center gap-2"><button${attr("disabled", loading !== null, true)} class="text-sm text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] disabled:opacity-50">${escape_html(loading === "portal" ? "Syncing..." : "↻ Sync billing status")}</button> <span class="text-xs text-[var(--foreground-subtle)]">Use this if your subscription status isn't updating.</span></div></div>`);
  });
}
export {
  _page as default
};
