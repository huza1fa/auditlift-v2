import { PostHog } from 'posthog-node';
import { env } from '$env/dynamic/public';

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
	// Analytics is optional. It must never prevent application requests when unset.
	if (!env.PUBLIC_POSTHOG_KEY || !env.PUBLIC_POSTHOG_HOST) return null;

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
