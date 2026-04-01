
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/(marketing)" | "/(app)" | "/" | "/api" | "/api/auth" | "/api/auth/[...all]" | "/api/billing" | "/api/billing/checkout" | "/api/billing/portal" | "/api/billing/status" | "/api/billing/sync" | "/api/evidence" | "/api/evidence/presign" | "/api/evidence/[id]" | "/api/evidence/[id]/confirm" | "/api/export" | "/api/invites" | "/api/invites/[token]" | "/api/onboarding" | "/api/onboarding/check-domain" | "/api/onboarding/complete" | "/api/onboarding/framework" | "/api/onboarding/organization" | "/api/onboarding/stack" | "/api/onboarding/team" | "/api/policies" | "/api/policies/generate" | "/api/policies/[id]" | "/api/policies/[id]/download" | "/api/settings" | "/api/settings/organization" | "/api/settings/team" | "/api/settings/team/[userId]" | "/api/webhooks" | "/api/webhooks/stripe" | "/(app)/controls" | "/(app)/controls/[controlId]" | "/(app)/dashboard" | "/(app)/evidence" | "/(app)/export" | "/(app)/frameworks" | "/invite" | "/invite/[token]" | "/(marketing)/login" | "/onboarding" | "/(app)/policies" | "/(marketing)/pricing" | "/(app)/settings" | "/(app)/settings/activity" | "/(app)/settings/billing" | "/(app)/settings/team";
		RouteParams(): {
			"/api/auth/[...all]": { all: string };
			"/api/evidence/[id]": { id: string };
			"/api/evidence/[id]/confirm": { id: string };
			"/api/invites/[token]": { token: string };
			"/api/policies/[id]": { id: string };
			"/api/policies/[id]/download": { id: string };
			"/api/settings/team/[userId]": { userId: string };
			"/(app)/controls/[controlId]": { controlId: string };
			"/invite/[token]": { token: string }
		};
		LayoutParams(): {
			"/(marketing)": Record<string, never>;
			"/(app)": { controlId?: string };
			"/": { all?: string; id?: string; token?: string; userId?: string; controlId?: string };
			"/api": { all?: string; id?: string; token?: string; userId?: string };
			"/api/auth": { all?: string };
			"/api/auth/[...all]": { all: string };
			"/api/billing": Record<string, never>;
			"/api/billing/checkout": Record<string, never>;
			"/api/billing/portal": Record<string, never>;
			"/api/billing/status": Record<string, never>;
			"/api/billing/sync": Record<string, never>;
			"/api/evidence": { id?: string };
			"/api/evidence/presign": Record<string, never>;
			"/api/evidence/[id]": { id: string };
			"/api/evidence/[id]/confirm": { id: string };
			"/api/export": Record<string, never>;
			"/api/invites": { token?: string };
			"/api/invites/[token]": { token: string };
			"/api/onboarding": Record<string, never>;
			"/api/onboarding/check-domain": Record<string, never>;
			"/api/onboarding/complete": Record<string, never>;
			"/api/onboarding/framework": Record<string, never>;
			"/api/onboarding/organization": Record<string, never>;
			"/api/onboarding/stack": Record<string, never>;
			"/api/onboarding/team": Record<string, never>;
			"/api/policies": { id?: string };
			"/api/policies/generate": Record<string, never>;
			"/api/policies/[id]": { id: string };
			"/api/policies/[id]/download": { id: string };
			"/api/settings": { userId?: string };
			"/api/settings/organization": Record<string, never>;
			"/api/settings/team": { userId?: string };
			"/api/settings/team/[userId]": { userId: string };
			"/api/webhooks": Record<string, never>;
			"/api/webhooks/stripe": Record<string, never>;
			"/(app)/controls": { controlId?: string };
			"/(app)/controls/[controlId]": { controlId: string };
			"/(app)/dashboard": Record<string, never>;
			"/(app)/evidence": Record<string, never>;
			"/(app)/export": Record<string, never>;
			"/(app)/frameworks": Record<string, never>;
			"/invite": { token?: string };
			"/invite/[token]": { token: string };
			"/(marketing)/login": Record<string, never>;
			"/onboarding": Record<string, never>;
			"/(app)/policies": Record<string, never>;
			"/(marketing)/pricing": Record<string, never>;
			"/(app)/settings": Record<string, never>;
			"/(app)/settings/activity": Record<string, never>;
			"/(app)/settings/billing": Record<string, never>;
			"/(app)/settings/team": Record<string, never>
		};
		Pathname(): "/" | `/api/auth/${string}` & {} | "/api/billing/checkout" | "/api/billing/portal" | "/api/billing/status" | "/api/billing/sync" | "/api/evidence/presign" | `/api/evidence/${string}` & {} | `/api/evidence/${string}/confirm` & {} | "/api/export" | `/api/invites/${string}` & {} | "/api/onboarding/check-domain" | "/api/onboarding/complete" | "/api/onboarding/framework" | "/api/onboarding/organization" | "/api/onboarding/stack" | "/api/onboarding/team" | "/api/policies/generate" | `/api/policies/${string}` & {} | `/api/policies/${string}/download` & {} | "/api/settings/organization" | "/api/settings/team" | `/api/settings/team/${string}` & {} | "/api/webhooks/stripe" | "/controls" | `/controls/${string}` & {} | "/dashboard" | "/evidence" | "/export" | "/frameworks" | `/invite/${string}` & {} | "/login" | "/onboarding" | "/policies" | "/pricing" | "/settings" | "/settings/activity" | "/settings/billing" | "/settings/team";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/robots.txt" | string & {};
	}
}