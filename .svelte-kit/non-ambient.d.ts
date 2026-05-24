
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
		RouteId(): "/(marketing)" | "/(app)" | "/" | "/api" | "/api/auth" | "/api/auth/[...all]" | "/api/billing" | "/api/billing/checkout" | "/api/billing/portal" | "/api/billing/status" | "/api/billing/sync" | "/api/consulting" | "/api/consulting/request" | "/api/evidence" | "/api/evidence/presign" | "/api/evidence/[id]" | "/api/evidence/[id]/confirm" | "/api/export" | "/api/invites" | "/api/invites/[token]" | "/api/onboarding" | "/api/onboarding/check-domain" | "/api/onboarding/complete" | "/api/onboarding/framework" | "/api/onboarding/organization" | "/api/onboarding/posture" | "/api/onboarding/profile" | "/api/onboarding/stack" | "/api/onboarding/team" | "/api/policies" | "/api/policies/generate" | "/api/policies/[id]" | "/api/policies/[id]/download" | "/api/policies/[id]/restore" | "/api/questionnaires" | "/api/questionnaires/upload" | "/api/questionnaires/[id]" | "/api/questionnaires/[id]/export" | "/api/questionnaires/[id]/questions" | "/api/questionnaires/[id]/questions/[qid]" | "/api/questionnaires/[id]/questions/[qid]/improve" | "/api/questionnaires/[id]/reprocess" | "/api/questionnaires/[id]/share" | "/api/questionnaires/[id]/stream" | "/api/settings" | "/api/settings/organization" | "/api/settings/system-description" | "/api/settings/team" | "/api/settings/team/[userId]" | "/api/webhooks" | "/api/webhooks/stripe" | "/(app)/controls" | "/(app)/controls/[controlId]" | "/(app)/dashboard" | "/(app)/evidence" | "/(app)/export" | "/(marketing)/forgot-password" | "/(app)/frameworks" | "/invite" | "/invite/[token]" | "/(marketing)/login" | "/onboarding" | "/(app)/policies" | "/(marketing)/pricing" | "/(marketing)/privacy" | "/(app)/questionnaires" | "/(app)/questionnaires/[id]" | "/(marketing)/reset-password" | "/(app)/settings" | "/(app)/settings/activity" | "/(app)/settings/billing" | "/(app)/settings/system" | "/(app)/settings/team" | "/share" | "/share/[token]" | "/sitemap.xml" | "/(marketing)/terms";
		RouteParams(): {
			"/api/auth/[...all]": { all: string };
			"/api/evidence/[id]": { id: string };
			"/api/evidence/[id]/confirm": { id: string };
			"/api/invites/[token]": { token: string };
			"/api/policies/[id]": { id: string };
			"/api/policies/[id]/download": { id: string };
			"/api/policies/[id]/restore": { id: string };
			"/api/questionnaires/[id]": { id: string };
			"/api/questionnaires/[id]/export": { id: string };
			"/api/questionnaires/[id]/questions": { id: string };
			"/api/questionnaires/[id]/questions/[qid]": { id: string; qid: string };
			"/api/questionnaires/[id]/questions/[qid]/improve": { id: string; qid: string };
			"/api/questionnaires/[id]/reprocess": { id: string };
			"/api/questionnaires/[id]/share": { id: string };
			"/api/questionnaires/[id]/stream": { id: string };
			"/api/settings/team/[userId]": { userId: string };
			"/(app)/controls/[controlId]": { controlId: string };
			"/invite/[token]": { token: string };
			"/(app)/questionnaires/[id]": { id: string };
			"/share/[token]": { token: string }
		};
		LayoutParams(): {
			"/(marketing)": Record<string, never>;
			"/(app)": { controlId?: string; id?: string };
			"/": { all?: string; id?: string; token?: string; qid?: string; userId?: string; controlId?: string };
			"/api": { all?: string; id?: string; token?: string; qid?: string; userId?: string };
			"/api/auth": { all?: string };
			"/api/auth/[...all]": { all: string };
			"/api/billing": Record<string, never>;
			"/api/billing/checkout": Record<string, never>;
			"/api/billing/portal": Record<string, never>;
			"/api/billing/status": Record<string, never>;
			"/api/billing/sync": Record<string, never>;
			"/api/consulting": Record<string, never>;
			"/api/consulting/request": Record<string, never>;
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
			"/api/onboarding/posture": Record<string, never>;
			"/api/onboarding/profile": Record<string, never>;
			"/api/onboarding/stack": Record<string, never>;
			"/api/onboarding/team": Record<string, never>;
			"/api/policies": { id?: string };
			"/api/policies/generate": Record<string, never>;
			"/api/policies/[id]": { id: string };
			"/api/policies/[id]/download": { id: string };
			"/api/policies/[id]/restore": { id: string };
			"/api/questionnaires": { id?: string; qid?: string };
			"/api/questionnaires/upload": Record<string, never>;
			"/api/questionnaires/[id]": { id: string; qid?: string };
			"/api/questionnaires/[id]/export": { id: string };
			"/api/questionnaires/[id]/questions": { id: string; qid?: string };
			"/api/questionnaires/[id]/questions/[qid]": { id: string; qid: string };
			"/api/questionnaires/[id]/questions/[qid]/improve": { id: string; qid: string };
			"/api/questionnaires/[id]/reprocess": { id: string };
			"/api/questionnaires/[id]/share": { id: string };
			"/api/questionnaires/[id]/stream": { id: string };
			"/api/settings": { userId?: string };
			"/api/settings/organization": Record<string, never>;
			"/api/settings/system-description": Record<string, never>;
			"/api/settings/team": { userId?: string };
			"/api/settings/team/[userId]": { userId: string };
			"/api/webhooks": Record<string, never>;
			"/api/webhooks/stripe": Record<string, never>;
			"/(app)/controls": { controlId?: string };
			"/(app)/controls/[controlId]": { controlId: string };
			"/(app)/dashboard": Record<string, never>;
			"/(app)/evidence": Record<string, never>;
			"/(app)/export": Record<string, never>;
			"/(marketing)/forgot-password": Record<string, never>;
			"/(app)/frameworks": Record<string, never>;
			"/invite": { token?: string };
			"/invite/[token]": { token: string };
			"/(marketing)/login": Record<string, never>;
			"/onboarding": Record<string, never>;
			"/(app)/policies": Record<string, never>;
			"/(marketing)/pricing": Record<string, never>;
			"/(marketing)/privacy": Record<string, never>;
			"/(app)/questionnaires": { id?: string };
			"/(app)/questionnaires/[id]": { id: string };
			"/(marketing)/reset-password": Record<string, never>;
			"/(app)/settings": Record<string, never>;
			"/(app)/settings/activity": Record<string, never>;
			"/(app)/settings/billing": Record<string, never>;
			"/(app)/settings/system": Record<string, never>;
			"/(app)/settings/team": Record<string, never>;
			"/share": { token?: string };
			"/share/[token]": { token: string };
			"/sitemap.xml": Record<string, never>;
			"/(marketing)/terms": Record<string, never>
		};
		Pathname(): "/" | `/api/auth/${string}` & {} | "/api/billing/checkout" | "/api/billing/portal" | "/api/billing/status" | "/api/billing/sync" | "/api/consulting/request" | "/api/evidence/presign" | `/api/evidence/${string}` & {} | `/api/evidence/${string}/confirm` & {} | "/api/export" | `/api/invites/${string}` & {} | "/api/onboarding/check-domain" | "/api/onboarding/complete" | "/api/onboarding/framework" | "/api/onboarding/organization" | "/api/onboarding/posture" | "/api/onboarding/profile" | "/api/onboarding/stack" | "/api/onboarding/team" | "/api/policies/generate" | `/api/policies/${string}` & {} | `/api/policies/${string}/download` & {} | `/api/policies/${string}/restore` & {} | "/api/questionnaires" | "/api/questionnaires/upload" | `/api/questionnaires/${string}` & {} | `/api/questionnaires/${string}/export` & {} | `/api/questionnaires/${string}/questions/${string}` & {} | `/api/questionnaires/${string}/questions/${string}/improve` & {} | `/api/questionnaires/${string}/reprocess` & {} | `/api/questionnaires/${string}/share` & {} | `/api/questionnaires/${string}/stream` & {} | "/api/settings/organization" | "/api/settings/system-description" | "/api/settings/team" | `/api/settings/team/${string}` & {} | "/api/webhooks/stripe" | "/controls" | `/controls/${string}` & {} | "/dashboard" | "/evidence" | "/export" | "/forgot-password" | "/frameworks" | `/invite/${string}` & {} | "/login" | "/onboarding" | "/policies" | "/pricing" | "/privacy" | "/questionnaires" | `/questionnaires/${string}` & {} | "/reset-password" | "/settings" | "/settings/activity" | "/settings/billing" | "/settings/system" | "/settings/team" | `/share/${string}` & {} | "/sitemap.xml" | "/terms";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.ico" | "/robots.txt" | string & {};
	}
}