import { PostHog } from 'posthog-node';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
	if (!env.PUBLIC_POSTHOG_KEY) {
		if (dev) {
			throw new Error(
				'PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_KEY is configured'
			);
		}
		return null;
	}
	if (!env.PUBLIC_POSTHOG_HOST) {
		if (dev) {
			throw new Error(
				'PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured'
			);
		}
		return null;
	}

	if (!posthogClient) {
		posthogClient = new PostHog(env.PUBLIC_POSTHOG_KEY, {
			host: env.PUBLIC_POSTHOG_HOST,
			flushAt: 1,
			flushInterval: 0,
			enableExceptionAutocapture: true
		});
	}

	return posthogClient;
}

type ServerEvent = {
	event: string;
	distinctId?: string;
	properties?: Record<string, unknown>;
	groups?: Record<string, string>;
};

export async function captureServerEvent({ event, distinctId, properties, groups }: ServerEvent) {
	const posthog = getPostHogClient();
	if (!posthog) return;

	posthog.capture({
		event,
		...(distinctId ? { distinctId } : {}),
		...(properties ? { properties } : {}),
		...(groups ? { groups } : {})
	});
	await posthog.flush();
}

export async function identifyUserServer({
	distinctId,
	properties
}: {
	distinctId: string;
	properties: Record<string, unknown>;
}) {
	const posthog = getPostHogClient();
	if (!posthog) return;

	posthog.identify({ distinctId, properties });
	await posthog.flush();
}
