import { w as writable } from './index-DBVoBMpw.js';

const toasts = writable([]);
function addToast(toast) {
  const id = crypto.randomUUID();
  const duration = toast.duration ?? 4e3;
  const newToast = { id, ...toast };
  toasts.update((existing) => [...existing, newToast]);
  if (duration > 0) {
    setTimeout(
      () => {
        toasts.update((existing) => existing.filter((t) => t.id !== id));
      },
      duration
    );
  }
}
function toastSuccess(message, duration) {
  addToast({ message, type: "success", duration });
}
function toastError(message, duration) {
  addToast({ message, type: "error", duration });
}

export { toastError as a, toastSuccess as b, toasts as t };
//# sourceMappingURL=toasts.svelte-DOaXn1j-.js.map
