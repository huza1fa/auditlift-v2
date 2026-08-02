import posthog from 'posthog-js';
import { browser } from '$app/environment';

let initialized = false;

export function markPostHogInitialized() {
	initialized = true;
}

export function identifyUser(
	userId: string,
	email: string,
	name: string | null | undefined,
	org: { id: string; name: string } | null | undefined,
	extra: Record<string, unknown> = {}
) {
	if (!browser || !initialized) return;
	posthog.identify(userId, {
		email,
		name: name ?? '',
		...extra
	});
	if (org) {
		posthog.group('organization', org.id, { name: org.name });
	}
}

export function captureEvent(event: string, properties: Record<string, unknown> = {}) {
	if (!browser || !initialized) return;
	posthog.capture(event, properties);
}

export function resetPostHog() {
	if (!browser || !initialized) return;
	posthog.reset();
}
