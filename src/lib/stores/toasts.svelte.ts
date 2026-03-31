import { writable } from 'svelte/store';

export interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
	duration?: number;
}

export const toasts = writable<Toast[]>([]);

function addToast(toast: Omit<Toast, 'id'>) {
	const id = crypto.randomUUID();
	const duration = toast.duration ?? 4000;
	const newToast: Toast = { id, ...toast };

	toasts.update((existing) => [...existing, newToast]);

	if (duration > 0) {
		setTimeout(() => {
			toasts.update((existing) => existing.filter((t) => t.id !== id));
		}, duration);
	}
}

export function toastSuccess(message: string, duration?: number) {
	addToast({ message, type: 'success', duration });
}

export function toastError(message: string, duration?: number) {
	addToast({ message, type: 'error', duration });
}

export function toastInfo(message: string, duration?: number) {
	addToast({ message, type: 'info', duration });
}

export function toastWarning(message: string, duration?: number) {
	addToast({ message, type: 'warning', duration });
}

export function dismissToast(id: string) {
	toasts.update((existing) => existing.filter((t) => t.id !== id));
}
