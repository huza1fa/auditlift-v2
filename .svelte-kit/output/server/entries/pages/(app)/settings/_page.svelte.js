import { a4 as escape_html } from "../../../../chunks/index3.js";
import "clsx";
import { B as Buildings } from "../../../../chunks/Buildings.js";
import { C as CreditCard } from "../../../../chunks/CreditCard.js";
import { T as Trash } from "../../../../chunks/Trash.js";
import { W as Warning } from "../../../../chunks/Warning.js";
import { C as Card } from "../../../../chunks/Card.js";
import { B as Badge } from "../../../../chunks/Badge.js";
import { B as Button } from "../../../../chunks/Button.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let showDeleteConfirm = false;
    let deleting = false;
    let deleteError = "";
    async function deleteOrganization() {
      deleteError = "";
      deleting = true;
      try {
        const res = await fetch("/api/settings/organization", { method: "DELETE" });
        if (res.ok) {
          window.location.href = "/login";
        } else {
          const json = await res.json();
          deleteError = json.message || "Failed to delete organization";
        }
      } catch {
        deleteError = "An unexpected error occurred. Please try again.";
      } finally {
        deleting = false;
        showDeleteConfirm = false;
      }
    }
    const org = data.organization;
    $$renderer2.push(`<div class="space-y-4">`);
    Card($$renderer2, {
      class: "p-6",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="mb-4 flex items-center gap-3">`);
        Buildings($$renderer3, { size: 20, color: "var(--brand)" });
        $$renderer3.push(`<!----> <h2 class="font-semibold text-[var(--foreground)]">Organization</h2></div> <div class="grid grid-cols-2 gap-4 text-sm"><div><p class="text-[var(--foreground-muted)]">Name</p> <p class="font-medium text-[var(--foreground)]">${escape_html(org.name)}</p></div> <div><p class="text-[var(--foreground-muted)]">Slug</p> <p class="font-medium text-[var(--foreground)]">${escape_html(org.slug)}</p></div> <div><p class="text-[var(--foreground-muted)]">Industry</p> <p class="font-medium text-[var(--foreground)]">${escape_html(org.industry ?? "—")}</p></div> <div><p class="text-[var(--foreground-muted)]">Team size</p> <p class="font-medium text-[var(--foreground)]">${escape_html(org.teamSize ?? "—")}</p></div></div>`);
      }
    });
    $$renderer2.push(`<!----> `);
    Card($$renderer2, {
      class: "p-6",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="mb-4 flex items-center gap-3">`);
        CreditCard($$renderer3, { size: 20, color: "var(--brand)" });
        $$renderer3.push(`<!----> <h2 class="font-semibold text-[var(--foreground)]">Billing</h2></div> <div class="flex items-center gap-3">`);
        Badge($$renderer3, {
          variant: data.subscription?.status === "active" ? "success" : "warning",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->${escape_html(data.subscription?.status ?? "No subscription")}`);
          }
        });
        $$renderer3.push(`<!----> `);
        if (org.trialEndsAt) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<span class="text-sm text-[var(--foreground-muted)]">Trial ends ${escape_html(new Date(org.trialEndsAt).toLocaleDateString())}</span>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div> <div class="mt-4"><a href="/settings/billing">`);
        Button($$renderer3, {
          variant: "secondary",
          size: "sm",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Manage billing`);
          }
        });
        $$renderer3.push(`<!----></a></div>`);
      }
    });
    $$renderer2.push(`<!----> `);
    Card($$renderer2, {
      class: "border-[var(--danger)] p-6",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="mb-4 flex items-center gap-3">`);
        Warning($$renderer3, { size: 20, color: "var(--danger)" });
        $$renderer3.push(`<!----> <h2 class="font-semibold text-[var(--danger)]">Danger Zone</h2></div> <p class="mb-4 text-sm text-[var(--foreground-muted)]">Once you delete your organization, there is no going back. All data including evidence,
			policies, and settings will be permanently deleted.</p> `);
        if (!showDeleteConfirm) {
          $$renderer3.push("<!--[0-->");
          Button($$renderer3, {
            variant: "danger",
            onclick: () => showDeleteConfirm = true,
            children: ($$renderer4) => {
              Trash($$renderer4, { size: 16 });
              $$renderer4.push(`<!----> Delete Organization`);
            }
          });
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<div class="rounded-[var(--radius)] bg-[var(--danger-light)] p-4">`);
          if (data.userRole === "owner") {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="mb-3 flex items-start gap-2 rounded-[var(--radius)] border border-[var(--danger)] bg-[var(--danger-light)] p-3">`);
            Warning($$renderer3, { size: 16, class: "mt-0.5 shrink-0 text-[var(--danger)]" });
            $$renderer3.push(`<!----> <p class="text-sm text-[var(--danger)]"><strong>Your account will also be deleted.</strong> As the organization owner, removing
							this organization permanently deletes your AuditLift account. You will be signed out.</p></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> <p class="mb-3 text-sm font-medium text-[var(--danger)]">Are you sure? This action cannot be undone.</p> <p class="mb-4 text-sm text-[var(--foreground-muted)]">Type <strong>${escape_html(org.name)}</strong> to confirm deletion.</p> <input type="text" placeholder="Type organization name" class="mb-3 w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]" id="confirmDelete"/> `);
          if (deleteError) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<p class="text-sm text-[var(--danger)]">${escape_html(deleteError)}</p>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> <div class="flex gap-2">`);
          Button($$renderer3, {
            variant: "secondary",
            onclick: () => showDeleteConfirm = false,
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Cancel`);
            }
          });
          $$renderer3.push(`<!----> `);
          Button($$renderer3, {
            variant: "danger",
            onclick: () => {
              const input = document.getElementById("confirmDelete");
              if (input.value === org.name) {
                deleteOrganization();
              }
            },
            disabled: deleting,
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(deleting ? "Deleting..." : "Yes, Delete")}`);
            }
          });
          $$renderer3.push(`<!----></div></div>`);
        }
        $$renderer3.push(`<!--]-->`);
      }
    });
    $$renderer2.push(`<!----></div>`);
  });
}
export {
  _page as default
};
