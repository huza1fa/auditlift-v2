import posthog from 'posthog-js';
import { browser } from '$app/environment';
import { PUBLIC_POSTHOG_KEY, PUBLIC_POSTHOG_HOST } from '$env/static/public';

export function initPostHog() {
	if (!browser) return;
	if (!PUBLIC_POSTHOG_KEY || PUBLIC_POSTHOG_KEY === 'dummy-key') return;

	posthog.init(PUBLIC_POSTHOG_KEY, {
		api_host: PUBLIC_POSTHOG_HOST,
		person_profiles: 'always',
		capture_pageview: false,
		capture_pageleave: true,
		session_recording: {
			maskAllInputs: false,
			maskInputOptions: { password: true }
		},
		on_request_error: () => {},
		loaded: (posthog) => {
			if (location.hostname === 'localhost') {
				posthog.opt_out_capturing();
			}
		}
	});
}

export function identifyUser(
	userId: string,
	email: string,
	name: string | null | undefined,
	org: { id: string; name: string } | null | undefined,
	extra: Record<string, unknown> = {}
) {
	if (!browser) return;
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
	if (!browser) return;
	posthog.capture(event, properties);
}

export { posthog };
