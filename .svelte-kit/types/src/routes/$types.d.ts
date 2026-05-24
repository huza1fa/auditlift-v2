import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;
type RouteParams = {  };
type RouteId = '/';
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureDefined<T> = T extends null | undefined ? {} : T;
type OptionalUnion<U extends Record<string, any>, A extends keyof U = U extends U ? keyof U : never> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;
export type Snapshot<T = any> = Kit.Snapshot<T>;
type LayoutRouteId = RouteId | "/(app)/settings" | "/(app)/settings/activity" | "/(app)/settings/system" | "/(app)/settings/team" | "/(app)/settings/billing" | "/(app)/questionnaires" | "/(app)/questionnaires/[id]" | "/(app)/evidence" | "/(app)/policies" | "/(app)/dashboard" | "/(app)/controls" | "/(app)/controls/[controlId]" | "/(app)/export" | "/(app)/frameworks" | "/(marketing)" | "/(marketing)/privacy" | "/(marketing)/terms" | "/(marketing)/forgot-password" | "/(marketing)/reset-password" | "/(marketing)/pricing" | "/(marketing)/login" | "/invite/[token]" | "/onboarding" | "/share/[token]" | null
type LayoutParams = RouteParams & { id?: string; controlId?: string; token?: string }
type LayoutParentData = EnsureDefined<{}>;

export type LayoutServerData = null;
export type LayoutData = Expand<LayoutParentData>;
export type LayoutProps = { params: LayoutParams; data: LayoutData; children: import("svelte").Snippet }