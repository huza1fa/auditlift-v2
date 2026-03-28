import type { Session, User } from 'better-auth/minimal';
import type { InferSelectModel } from 'drizzle-orm';
import type { organizations, subscriptions } from '$lib/server/db/schema';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			session: { user: User; session: Session } | null;
			organizationId: string | null;
			organization: InferSelectModel<typeof organizations> | null;
			subscription: InferSelectModel<typeof subscriptions> | null;
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
