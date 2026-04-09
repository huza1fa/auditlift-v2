import { ae as escape_html, ac as ensure_array_like, ad as attr, ai as stringify } from './index3-A6PWQL_h.js';
import { A as ArrowRight } from './ArrowRight-DIl4ZNuw.js';
import { D as Download } from './Download-B0ZUKpyL.js';
import { F as File } from './File-BYQ4e7OH.js';
import { F as FloppyDisk } from './FloppyDisk-08-KFhif.js';
import { F as FolderOpen } from './FolderOpen-m_N8UBXL.js';
import { P as PencilSimple } from './PencilSimple-Dnchefbv.js';
import { T as Trash } from './Trash-xi62z_Lw.js';
import { W as Warning } from './Warning-BL7LMjXi.js';
import { X } from './X-B3Cf1Mcl.js';
import { C as Card } from './Card-B7pxgW8R.js';
import { B as Badge } from './Badge-Cer8O6lG.js';
import { B as Button } from './Button-CIQKvzrf.js';
import './context-CZy4Dq81.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1e3;
    function isStale(createdAt) {
      return Date.now() - new Date(createdAt).getTime() > NINETY_DAYS_MS;
    }
    let editingId = null;
    let editNotes = "";
    let deletingId = null;
    let deleteInProgress = null;
    function formatSize(bytes) {
      if (bytes < 1024) return `${bytes}B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    }
    async function downloadEvidence(id, filename) {
      try {
        const res = await fetch(`/api/evidence/${id}`);
        if (!res.ok) {
          console.error("Failed to get download URL");
          return;
        }
        const { downloadUrl } = await res.json();
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename;
        a.click();
      } catch (err) {
        console.error("Download failed:", err);
      }
    }
    function startEditNotes(ev) {
      editingId = ev.id;
      editNotes = ev.notes ?? "";
    }
    function confirmDelete(id) {
      deletingId = id;
    }
    $$renderer2.push(`<div class="space-y-6"><div class="flex items-center justify-between"><h1 class="text-2xl font-bold text-[var(--foreground)]">Evidence</h1> <div class="flex items-center gap-2">`);
    Badge($$renderer2, {
      variant: "default",
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->${escape_html(data.evidenceList.length)} files`);
      }
    });
    $$renderer2.push(`<!----> `);
    if (data.evidenceList.filter((ev) => isStale(ev.createdAt)).length > 0) {
      $$renderer2.push("<!--[0-->");
      Badge($$renderer2, {
        variant: "warning",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(data.evidenceList.filter((ev) => isStale(ev.createdAt)).length)} stale`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (data.evidenceList.length === 0) {
      $$renderer2.push("<!--[0-->");
      Card($$renderer2, {
        class: "p-12 text-center",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="mx-auto mb-4 flex justify-center">`);
          FolderOpen($$renderer3, { size: 48, color: "var(--foreground-subtle)" });
          $$renderer3.push(`<!----></div> <h2 class="mb-2 text-base font-semibold text-[var(--foreground)]">No evidence yet</h2> <p class="mb-4 text-sm text-[var(--foreground-muted)]">Upload evidence files from a control's detail page.</p> <a href="/controls" class="inline-flex items-center gap-2 text-sm font-medium text-[var(--brand)] hover:underline">Browse controls `);
          ArrowRight($$renderer3, { size: 14 });
          $$renderer3.push(`<!----></a>`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
      Card($$renderer2, {
        class: "overflow-hidden p-0",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="divide-y divide-[var(--border)]"><!--[-->`);
          const each_array = ensure_array_like(data.evidenceList);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let ev = each_array[$$index];
            $$renderer3.push(`<div class="flex items-center justify-between px-6 py-4 hover:bg-[var(--background-alt)]"><div class="flex items-center gap-4"><div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius)] bg-[var(--background-alt)]">`);
            File($$renderer3, { size: 20, color: "var(--foreground-muted)" });
            $$renderer3.push(`<!----></div> <div class="min-w-0"><p class="truncate text-sm font-medium text-[var(--foreground)]">${escape_html(ev.filename)}</p> <p class="text-xs text-[var(--foreground-muted)]">${escape_html(formatSize(ev.sizeBytes))} ·
									${escape_html(new Date(ev.createdAt).toLocaleDateString())}</p> `);
            if (isStale(ev.createdAt)) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<span class="mt-0.5 flex items-center gap-1 text-xs text-[var(--warning)]">`);
              Warning($$renderer3, { size: 10, weight: "fill" });
              $$renderer3.push(`<!----> Needs refresh — older than 90 days</span>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--> `);
            if (editingId === ev.id) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<div class="mt-2 flex items-center gap-2"><input${attr("value", editNotes)} placeholder="Add notes..." class="flex-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)]"/> <button class="text-[var(--success)] hover:opacity-70">`);
              FloppyDisk($$renderer3, { size: 12 });
              $$renderer3.push(`<!----></button> <button class="text-[var(--foreground-muted)] hover:text-[var(--foreground)]">`);
              X($$renderer3, { size: 12 });
              $$renderer3.push(`<!----></button></div>`);
            } else if (ev.notes) {
              $$renderer3.push("<!--[1-->");
              $$renderer3.push(`<p class="mt-1 text-xs text-[var(--foreground-muted)] italic">"${escape_html(ev.notes)}"</p>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--> `);
            if (deletingId === ev.id) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<div class="mt-2 flex items-center gap-2 rounded-[var(--radius)] bg-[var(--danger-light)] px-3 py-2"><span class="text-xs font-medium text-[var(--danger)]">This will reduce your readiness score. Delete?</span> <button class="rounded-[var(--radius)] bg-[var(--danger)] px-2 py-0.5 text-xs font-semibold text-white hover:opacity-80">Delete</button> <button class="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)]">Cancel</button></div>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div></div> <div class="flex items-center gap-3">`);
            Button($$renderer3, {
              variant: "ghost",
              size: "sm",
              onclick: () => startEditNotes(ev),
              children: ($$renderer4) => {
                PencilSimple($$renderer4, { size: 14 });
              }
            });
            $$renderer3.push(`<!----> `);
            Button($$renderer3, {
              variant: "ghost",
              size: "sm",
              onclick: () => downloadEvidence(ev.id, ev.filename),
              children: ($$renderer4) => {
                Download($$renderer4, { size: 14 });
              }
            });
            $$renderer3.push(`<!----> `);
            Button($$renderer3, {
              variant: "ghost",
              size: "sm",
              onclick: () => confirmDelete(ev.id),
              disabled: deleteInProgress === ev.id,
              children: ($$renderer4) => {
                Trash($$renderer4, { size: 14 });
              }
            });
            $$renderer3.push(`<!----> `);
            if (ev.controlCode) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<a${attr("href", `/controls/${stringify(ev.controlId)}`)} class="flex items-center gap-1 text-xs text-[var(--brand)] hover:underline"><span class="font-mono">${escape_html(ev.controlCode)}</span> `);
              ArrowRight($$renderer3, { size: 12 });
              $$renderer3.push(`<!----></a>`);
            } else {
              $$renderer3.push("<!--[-1-->");
              $$renderer3.push(`<span class="text-xs text-[var(--foreground-subtle)]">No control linked</span>`);
            }
            $$renderer3.push(`<!--]--></div></div>`);
          }
          $$renderer3.push(`<!--]--></div>`);
        }
      });
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DzBNrHKU.js.map
