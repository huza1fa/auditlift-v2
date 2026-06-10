import { PostHog } from 'posthog-node';
import { env } from '$env/dynamic/private';

let posthogInstance: PostHog | null = null;

function getPostHog(): PostHog | null {
	if (posthogInstance) return posthogInstance;
	const apiKey = env.PUBLIC_POSTHOG_KEY;
	const host = env.PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';
	if (!apiKey) {
		console.warn('[PostHog] PUBLIC_POSTHOG_KEY not set — server-side analytics disabled');
		return null;
	}
	posthogInstance = new PostHog(apiKey, { host, flushAt: 1, flushInterval: 0 });
	return posthogInstance;
}

export function captureServerEvent({
	event,
	distinctId,
	properties = {},
	groups = {}
}: {
	event: string;
	distinctId: string;
	properties?: Record<string, unknown>;
	groups?: Record<string, string>;
}) {
	const client = getPostHog();
	if (!client) return;
	try {
		client.capture({
			distinctId,
			event,
			properties,
			groups
		});
	} catch (err) {
		console.error('[PostHog] capture error:', err);
	}
}

export function identifyUserServer({
	distinctId,
	properties = {}
}: {
	distinctId: string;
	properties?: Record<string, unknown>;
}) {
	const client = getPostHog();
	if (!client) return;
	try {
		client.identify({
			distinctId,
			properties
		});
	} catch (err) {
		console.error('[PostHog] identify error:', err);
	}
}

export function shutdownPostHog() {
	if (posthogInstance) {
		posthogInstance.shutdown();
		posthogInstance = null;
	}
}
