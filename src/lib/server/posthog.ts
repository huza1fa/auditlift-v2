import { PostHog } from 'posthog-node';
import { env } from '$env/dynamic/private';

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
	// Analytics is optional. It must never prevent application requests when unset.
	if (!env.PUBLIC_POSTHOG_KEY || !env.PUBLIC_POSTHOG_HOST) return null;
	// Browser traffic uses the same-origin proxy, while server traffic can use
	// PostHog directly and avoid an unnecessary trip back through the public app.
	const host = env.POSTHOG_HOST || env.PUBLIC_POSTHOG_HOST;

	if (!posthogClient) {
		posthogClient = new PostHog(env.PUBLIC_POSTHOG_KEY, {
			host,
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
