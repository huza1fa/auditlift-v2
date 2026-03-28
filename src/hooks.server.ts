import { auth } from '$lib/server/auth';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userOrganizations, organizations, subscriptions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { paraglideMiddleware } from '$lib/paraglide/server';

const authHandle: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });
	event.locals.session = session;

	if (session?.user) {
		// Attach organizationId to locals
		const [userOrg] = await db
			.select()
			.from(userOrganizations)
			.where(eq(userOrganizations.userId, session.user.id))
			.limit(1);

		if (userOrg) {
			event.locals.organizationId = userOrg.organizationId;

			const [org] = await db
				.select()
				.from(organizations)
				.where(eq(organizations.id, userOrg.organizationId))
				.limit(1);
			event.locals.organization = org;

			const [sub] = await db
				.select()
				.from(subscriptions)
				.where(eq(subscriptions.organizationId, userOrg.organizationId))
				.limit(1);
			event.locals.subscription = sub ?? null;
		} else {
			event.locals.organizationId = null;
			event.locals.organization = null;
			event.locals.subscription = null;
		}
	}

	return resolve(event);
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
