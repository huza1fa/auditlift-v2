import posthog from 'posthog-js';
import { env } from '$env/dynamic/public';
import type { HandleClientError } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { markPostHogInitialized } from '$lib/posthog';

export async function init() {
	if (!env.PUBLIC_POSTHOG_KEY) {
		if (dev) {
			throw new Error(
				'PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_KEY is configured'
			);
		}
		return;
	}
	if (!env.PUBLIC_POSTHOG_HOST) {
		if (dev) {
			throw new Error(
				'PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured'
			);
		}
		return;
	}

	posthog.init(env.PUBLIC_POSTHOG_KEY, {
		api_host: env.PUBLIC_POSTHOG_HOST,
		ui_host: env.PUBLIC_POSTHOG_HOST,
		person_profiles: 'always',
		autocapture: false,
		mask_all_text: true,
		capture_pageview: false,
		capture_pageleave: true,
		capture_exceptions: true,
		tracing_headers: [window.location.hostname],
		session_recording: {
			maskAllInputs: true,
			maskTextSelector: '*'
		}
	});
	markPostHogInitialized();
}

export const handleError: HandleClientError = async ({ error, status, message }) => {
	if (env.PUBLIC_POSTHOG_KEY && env.PUBLIC_POSTHOG_HOST) {
		posthog.captureException(error);
	}

	return { message, status };
};
