import { a6 as attributes, a4 as escape_html, _ as derived, a2 as ensure_array_like, a3 as attr } from "../../../../../chunks/index3.js";
import { C as Check } from "../../../../../chunks/Check.js";
import { g as getIconContext } from "../../../../../chunks/context.js";
import { P as Plus } from "../../../../../chunks/Plus.js";
import { T as Trash } from "../../../../../chunks/Trash.js";
import { U as Users } from "../../../../../chunks/Users.js";
import { W as Warning } from "../../../../../chunks/Warning.js";
import { X } from "../../../../../chunks/X.js";
import { C as Card } from "../../../../../chunks/Card.js";
import { B as Button } from "../../../../../chunks/Button.js";
import { B as Badge } from "../../../../../chunks/Badge.js";
function Copy($$renderer, $$props) {
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
      $$renderer2.push(`<path d="M216,28H88A12,12,0,0,0,76,40V76H40A12,12,0,0,0,28,88V216a12,12,0,0,0,12,12H168a12,12,0,0,0,12-12V180h36a12,12,0,0,0,12-12V40A12,12,0,0,0,216,28ZM156,204H52V100H156Zm48-48H180V88a12,12,0,0,0-12-12H100V52H204Z"></path>`);
    } else if (weight() === "duotone") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<path d="M216,40V168H168V88H88V40Z" opacity="0.2"></path><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path>`);
    } else if (weight() === "fill") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32Zm-8,128H176V88a8,8,0,0,0-8-8H96V48H208Z"></path>`);
    } else if (weight() === "light") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<path d="M216,34H88a6,6,0,0,0-6,6V82H40a6,6,0,0,0-6,6V216a6,6,0,0,0,6,6H168a6,6,0,0,0,6-6V174h42a6,6,0,0,0,6-6V40A6,6,0,0,0,216,34ZM162,210H46V94H162Zm48-48H174V88a6,6,0,0,0-6-6H94V46H210Z"></path>`);
    } else if (weight() === "regular") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path>`);
    } else if (weight() === "thin") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<path d="M216,36H88a4,4,0,0,0-4,4V84H40a4,4,0,0,0-4,4V216a4,4,0,0,0,4,4H168a4,4,0,0,0,4-4V172h44a4,4,0,0,0,4-4V40A4,4,0,0,0,216,36ZM164,212H44V92H164Zm48-48H172V88a4,4,0,0,0-4-4H92V44H212Z"></path>`);
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
    const hasInviteRole = data.currentUser.role === "owner" || data.currentUser.role === "admin";
    const canManageRoles = data.currentUser.role === "owner" || data.currentUser.role === "admin";
    let canInviteMore = data.canInviteMore;
    const isTrialLimited = derived(() => data.memberLimit !== null);
    let showInviteModal = false;
    let inviteEmail = "";
    let inviteRole = "member";
    let inviteLink = "";
    let copied = false;
    let inviting = false;
    let inviteError = "";
    let memberError = "";
    let removingId = null;
    let updatingRoleId = null;
    const roleOptions = [
      { value: "admin", label: "Admin" },
      { value: "member", label: "Member" },
      { value: "viewer", label: "Viewer" }
    ];
    async function sendInvite() {
      inviting = true;
      inviteError = "";
      inviteLink = "";
      try {
        const res = await fetch("/api/settings/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: inviteEmail, role: inviteRole })
        });
        const json = await res.json();
        if (!res.ok) {
          inviteError = json.message || "Failed to send invitation";
          return;
        }
        inviteLink = json.inviteLink;
        data.pendingInvites = [
          ...data.pendingInvites,
          {
            id: json.invitation.id,
            email: json.invitation.email,
            role: json.invitation.role,
            expiresAt: json.invitation.expiresAt,
            createdAt: /* @__PURE__ */ new Date()
          }
        ];
        if (data.memberLimit !== null) {
          canInviteMore = data.members.length + data.pendingInvites.length < data.memberLimit;
        }
      } catch {
        inviteError = "An error occurred. Please try again.";
      } finally {
        inviting = false;
      }
    }
    async function copyInviteLink() {
      await navigator.clipboard.writeText(inviteLink);
      copied = true;
      setTimeout(() => copied = false, 2e3);
    }
    async function updateRole(userId, newRole) {
      memberError = "";
      updatingRoleId = userId;
      try {
        await fetch(`/api/settings/team/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole })
        });
        data.members = data.members.map((m) => m.userId === userId ? { ...m, role: newRole } : m);
      } catch {
        memberError = "Failed to update role. Please try again.";
      } finally {
        updatingRoleId = null;
      }
    }
    function formatRole(role) {
      return role.charAt(0).toUpperCase() + role.slice(1);
    }
    function getRoleBadgeVariant(role) {
      switch (role) {
        case "owner":
          return "success";
        case "admin":
          return "warning";
        case "member":
          return "default";
        case "viewer":
          return "info";
        default:
          return "default";
      }
    }
    $$renderer2.push(`<div class="space-y-6"><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-[var(--foreground)]">Team</h1> <p class="text-sm text-[var(--foreground-muted)]">Manage your organization team members and invitations</p></div> `);
    if (hasInviteRole) {
      $$renderer2.push("<!--[0-->");
      if (canInviteMore) {
        $$renderer2.push("<!--[0-->");
        Button($$renderer2, {
          onclick: () => showInviteModal = true,
          children: ($$renderer3) => {
            Plus($$renderer3, { size: 16 });
            $$renderer3.push(`<!----> Invite Member`);
          }
        });
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<a href="/settings/billing">`);
        Button($$renderer2, {
          variant: "secondary",
          children: ($$renderer3) => {
            $$renderer3.push(`<!---->Upgrade to invite more`);
          }
        });
        $$renderer2.push(`<!----></a>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    Card($$renderer2, {
      class: "p-6",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="mb-4 flex items-center gap-3">`);
        Users($$renderer3, { size: 20, color: "var(--brand)" });
        $$renderer3.push(`<!----> <h2 class="font-semibold text-[var(--foreground)]">Members (${escape_html(data.members.length)}`);
        if (isTrialLimited()) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`/${escape_html(data.memberLimit)}`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]-->)</h2></div> `);
        if (isTrialLimited() && !canInviteMore) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="mb-4 flex items-start gap-2.5 rounded-[var(--radius)] bg-[var(--warning-light)] px-3 py-3">`);
          Warning($$renderer3, { size: 16, color: "var(--warning)", class: "mt-0.5 shrink-0" });
          $$renderer3.push(`<!----> <p class="text-xs leading-snug text-[var(--warning)]">Trial plans are limited to ${escape_html(data.memberLimit)} team members. <a href="/settings/billing" class="underline font-medium">Upgrade</a> for unlimited invites.</p></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (data.members.length === 0) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<p class="text-sm text-[var(--foreground-muted)]">No team members yet.</p>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<div class="space-y-3"><!--[-->`);
          const each_array = ensure_array_like(data.members);
          for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
            let member = each_array[$$index_1];
            $$renderer3.push(`<div class="flex items-center justify-between rounded-[var(--radius)] bg-[var(--background-alt)] p-4"><div class="flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-light)] text-[var(--brand)]">${escape_html(member.isCurrentUser ? data.currentUser.name?.[0] || "?" : member.userId[0].toUpperCase())}</div> <div><p class="font-medium text-[var(--foreground)]">${escape_html(member.isCurrentUser ? data.currentUser.name : "Team Member")} `);
            if (member.isCurrentUser) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<span class="text-xs text-[var(--foreground-muted)]">(you)</span>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></p> <p class="text-xs text-[var(--foreground-muted)]">${escape_html(member.isCurrentUser ? data.currentUser.email : "Email on file")}</p></div></div> <div class="flex items-center gap-3">`);
            if (canManageRoles && member.role !== "owner" && !member.isCurrentUser) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.select(
                {
                  class: "rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-sm text-[var(--foreground)]",
                  value: member.role,
                  onchange: (e) => updateRole(member.userId, e.target.value),
                  disabled: updatingRoleId === member.userId
                },
                ($$renderer4) => {
                  $$renderer4.push(`<!--[-->`);
                  const each_array_1 = ensure_array_like(roleOptions);
                  for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                    let option = each_array_1[$$index];
                    $$renderer4.option({ value: option.value }, ($$renderer5) => {
                      $$renderer5.push(`${escape_html(option.label)}`);
                    });
                  }
                  $$renderer4.push(`<!--]-->`);
                }
              );
            } else {
              $$renderer3.push("<!--[-1-->");
              Badge($$renderer3, {
                variant: getRoleBadgeVariant(member.role),
                children: ($$renderer4) => {
                  $$renderer4.push(`<!---->${escape_html(formatRole(member.role))}`);
                }
              });
            }
            $$renderer3.push(`<!--]--> `);
            if (canManageRoles && member.role !== "owner" && !member.isCurrentUser) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<button${attr("disabled", removingId === member.userId, true)} class="text-[var(--danger)] hover:opacity-70" title="Remove member">`);
              Trash($$renderer3, { size: 16 });
              $$renderer3.push(`<!----></button>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div></div>`);
          }
          $$renderer3.push(`<!--]--></div>`);
        }
        $$renderer3.push(`<!--]-->`);
      }
    });
    $$renderer2.push(`<!----> `);
    if (memberError) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-[var(--radius)] border border-[var(--danger)] bg-[var(--danger-light)] p-3 text-sm text-[var(--danger)]">${escape_html(memberError)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.pendingInvites.length > 0) {
      $$renderer2.push("<!--[0-->");
      Card($$renderer2, {
        class: "p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<h2 class="mb-4 font-semibold text-[var(--foreground)]">Pending Invitations (${escape_html(data.pendingInvites.length)})</h2> <div class="space-y-3"><!--[-->`);
          const each_array_2 = ensure_array_like(data.pendingInvites);
          for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
            let invite = each_array_2[$$index_2];
            $$renderer3.push(`<div class="flex items-center justify-between rounded-[var(--radius)] border border-[var(--border)] p-4"><div><p class="font-medium text-[var(--foreground)]">${escape_html(invite.email)}</p> <p class="text-xs text-[var(--foreground-muted)]">Invited as ${escape_html(formatRole(invite.role))} · Expires 
								${escape_html(new Date(invite.expiresAt).toLocaleDateString())}</p></div> `);
            Badge($$renderer3, {
              variant: "warning",
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->Pending`);
              }
            });
            $$renderer3.push(`<!----></div>`);
          }
          $$renderer3.push(`<!--]--></div>`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (showInviteModal) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" tabindex="-1"><div class="w-full max-w-md rounded-[var(--radius-lg)] bg-[var(--background)] p-6 shadow-xl" role="dialog"><div class="mb-4 flex items-center justify-between"><h2 class="text-lg font-semibold text-[var(--foreground)]">Invite Team Member</h2> <button class="text-[var(--foreground-muted)] hover:text-[var(--foreground)]">`);
      X($$renderer2, { size: 20 });
      $$renderer2.push(`<!----></button></div> `);
      if (!inviteLink) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="space-y-4"><div><label class="mb-1 block text-sm font-medium text-[var(--foreground)]">Email address</label> <input type="email"${attr("value", inviteEmail)} placeholder="colleague@company.com" class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] focus:outline-none"/></div> <div><label class="mb-1 block text-sm font-medium text-[var(--foreground)]">Role</label> `);
        $$renderer2.select(
          {
            value: inviteRole,
            class: "w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] focus:outline-none"
          },
          ($$renderer3) => {
            $$renderer3.push(`<!--[-->`);
            const each_array_3 = ensure_array_like(roleOptions);
            for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
              let option = each_array_3[$$index_3];
              $$renderer3.option({ value: option.value }, ($$renderer4) => {
                $$renderer4.push(`${escape_html(option.label)}`);
              });
            }
            $$renderer3.push(`<!--]-->`);
          }
        );
        $$renderer2.push(`</div> `);
        if (inviteError) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="text-sm text-[var(--danger)]">${escape_html(inviteError)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        Button($$renderer2, {
          onclick: sendInvite,
          disabled: inviting || !inviteEmail,
          class: "w-full",
          children: ($$renderer3) => {
            if (inviting) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`Sending...`);
            } else {
              $$renderer3.push("<!--[-1-->");
              Plus($$renderer3, { size: 16 });
              $$renderer3.push(`<!----> Send Invitation`);
            }
            $$renderer3.push(`<!--]-->`);
          }
        });
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="space-y-4"><div class="flex items-start gap-3 rounded-[var(--radius)] bg-[var(--success-light,#f0fdf4)] p-3">`);
        Check($$renderer2, {
          size: 18,
          class: "mt-0.5 shrink-0 text-[var(--success,#16a34a)]"
        });
        $$renderer2.push(`<!----> <div><p class="text-sm font-medium text-[var(--foreground)]">Invitation sent</p> <p class="text-sm text-[var(--foreground-muted)]">An email has been sent to <strong>${escape_html(inviteEmail)}</strong> with a link to join your organization.</p></div></div> <div><p class="mb-2 text-xs font-medium tracking-wide text-[var(--foreground-muted)] uppercase">Backup invite link</p> <div class="flex items-center gap-2"><input type="text" readonly=""${attr("value", inviteLink)} class="flex-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background-alt)] px-3 py-2 text-sm text-[var(--foreground)]"/> `);
        Button($$renderer2, {
          variant: "secondary",
          onclick: copyInviteLink,
          children: ($$renderer3) => {
            if (copied) {
              $$renderer3.push("<!--[0-->");
              Check($$renderer3, { size: 16 });
            } else {
              $$renderer3.push("<!--[-1-->");
              Copy($$renderer3, { size: 16 });
            }
            $$renderer3.push(`<!--]-->`);
          }
        });
        $$renderer2.push(`<!----></div> <p class="mt-1 text-xs text-[var(--foreground-muted)]">Share this if the email doesn't arrive. Expires in 7 days.</p></div> `);
        Button($$renderer2, {
          variant: "secondary",
          onclick: () => {
            showInviteModal = false;
            inviteLink = "";
            inviteEmail = "";
          },
          class: "w-full",
          children: ($$renderer3) => {
            $$renderer3.push(`<!---->Done`);
          }
        });
        $$renderer2.push(`<!----></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
