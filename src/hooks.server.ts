import { auth } from '$lib/server/auth';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userOrganizations, organizations, subscriptions } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { paraglideMiddleware } from '$lib/paraglide/server';

const authHandle: Handle = async ({ event, resolve }) => {
	// CSRF protection for JSON API routes
	const method = event.request.method;
	if (['POST', 'PATCH', 'DELETE', 'PUT'].includes(method)) {
		const pathname = event.url.pathname;
		// Exempt Stripe webhooks — they come from Stripe servers, not browsers
		if (!pathname.startsWith('/api/webhooks/')) {
			const origin = event.request.headers.get('origin');
			const expectedOrigin = env.ORIGIN;
			// Require a non-empty Origin header that matches the expected origin.
			// Requests with a missing or mismatched Origin are rejected.
			if (!origin || !expectedOrigin || origin !== expectedOrigin) {
				return new Response('Forbidden', { status: 403 });
			}
		}
	}

	const session = await auth.api.getSession({ headers: event.request.headers });
	event.locals.session = session;

	if (session?.user) {
		const [userOrg] = await db
			.select()
			.from(userOrganizations)
			.where(eq(userOrganizations.userId, session.user.id))
			.orderBy(asc(userOrganizations.createdAt))
			.limit(1);

		if (userOrg) {
			event.locals.organizationId = userOrg.organizationId;

			// Fetch org + subscription in parallel
			const [[org], [sub]] = await Promise.all([
				db
					.select()
					.from(organizations)
					.where(eq(organizations.id, userOrg.organizationId))
					.limit(1),
				db
					.select()
					.from(subscriptions)
					.where(eq(subscriptions.organizationId, userOrg.organizationId))
					.limit(1)
			]);

			event.locals.organization = org;
			event.locals.subscription = sub ?? null;
		} else {
			event.locals.organizationId = null;
			event.locals.organization = null;
			event.locals.subscription = null;
		}
	}

	const response = await resolve(event);
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	if (!dev) {
		response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	}

	// Only enforce CSP in production — Vite's module system in dev doesn't
	// play well with script-src restrictions (dynamic imports, HMR, eval for source maps)
	if (!dev) {
		response.headers.set(
			'Content-Security-Policy',
			[
				"default-src 'self'",
				"script-src 'self' 'unsafe-inline' https://us-assets.i.posthog.com https://static.cloudflareinsights.com",
				"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
				"font-src 'self' https://fonts.gstatic.com",
				"img-src 'self' data: https:",
				"connect-src 'self' https://api.openrouter.ai https://api.stripe.com https://us.i.posthog.com https://us-assets.i.posthog.com https://cloudflareinsights.com https://*.cloudflareinsights.com https://auditlift-storage-676799697185-us-east-1.s3.us-east-1.amazonaws.com",
				"frame-ancestors 'none'"
			].join('; ')
		);
	}
	return response;
};

const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(
		event.request,
		({ request, locale }: { request: Request; locale: string }) => {
			event.request = request;

			return resolve(event, {
				transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
			});
		}
	);

export const handle = sequence(paraglideHandle, authHandle);
