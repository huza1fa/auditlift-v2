
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
		RouteId(): "/(marketing)" | "/(app)" | "/" | "/api" | "/api/auth" | "/api/auth/[...all]" | "/api/evidence" | "/api/evidence/upload" | "/api/evidence/[id]" | "/api/export" | "/api/onboarding" | "/api/onboarding/complete" | "/api/onboarding/framework" | "/api/onboarding/organization" | "/api/onboarding/stack" | "/api/onboarding/team" | "/api/policies" | "/api/policies/generate" | "/(app)/controls" | "/(app)/controls/[controlId]" | "/(app)/dashboard" | "/(app)/evidence" | "/(app)/export" | "/(app)/frameworks" | "/(marketing)/login" | "/onboarding" | "/(app)/policies" | "/(app)/settings" | "/(app)/settings/billing";
		RouteParams(): {
			"/api/auth/[...all]": { all: string };
			"/api/evidence/[id]": { id: string };
			"/(app)/controls/[controlId]": { controlId: string }
		};
		LayoutParams(): {
			"/(marketing)": Record<string, never>;
			"/(app)": { controlId?: string };
			"/": { all?: string; id?: string; controlId?: string };
			"/api": { all?: string; id?: string };
			"/api/auth": { all?: string };
			"/api/auth/[...all]": { all: string };
			"/api/evidence": { id?: string };
			"/api/evidence/upload": Record<string, never>;
			"/api/evidence/[id]": { id: string };
			"/api/export": Record<string, never>;
			"/api/onboarding": Record<string, never>;
			"/api/onboarding/complete": Record<string, never>;
			"/api/onboarding/framework": Record<string, never>;
			"/api/onboarding/organization": Record<string, never>;
			"/api/onboarding/stack": Record<string, never>;
			"/api/onboarding/team": Record<string, never>;
			"/api/policies": Record<string, never>;
			"/api/policies/generate": Record<string, never>;
			"/(app)/controls": { controlId?: string };
			"/(app)/controls/[controlId]": { controlId: string };
			"/(app)/dashboard": Record<string, never>;
			"/(app)/evidence": Record<string, never>;
			"/(app)/export": Record<string, never>;
			"/(app)/frameworks": Record<string, never>;
			"/(marketing)/login": Record<string, never>;
			"/onboarding": Record<string, never>;
			"/(app)/policies": Record<string, never>;
			"/(app)/settings": Record<string, never>;
			"/(app)/settings/billing": Record<string, never>
		};
		Pathname(): "/" | `/api/auth/${string}` & {} | "/api/evidence/upload" | `/api/evidence/${string}` & {} | "/api/export" | "/api/onboarding/complete" | "/api/onboarding/framework" | "/api/onboarding/organization" | "/api/onboarding/stack" | "/api/onboarding/team" | "/api/policies/generate" | "/controls" | `/controls/${string}` & {} | "/dashboard" | "/evidence" | "/export" | "/frameworks" | "/login" | "/onboarding" | "/policies" | "/settings" | "/settings/billing";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/robots.txt" | string & {};
	}
}