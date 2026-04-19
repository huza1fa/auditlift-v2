import * as universal_hooks from '../../../src/hooks.ts';

export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27')
];

export const server_loads = [2];

export const dictionary = {
		"/(marketing)": [~18,[4]],
		"/(app)/controls": [~5,[2]],
		"/(app)/controls/[controlId]": [~6,[2]],
		"/(app)/dashboard": [~7,[2]],
		"/(app)/evidence": [~8,[2]],
		"/(app)/export": [~9,[2]],
		"/(marketing)/forgot-password": [19,[4]],
		"/(app)/frameworks": [~10,[2]],
		"/invite/[token]": [~25],
		"/(marketing)/login": [20,[4]],
		"/onboarding": [~26],
		"/(app)/policies": [~11,[2]],
		"/(marketing)/pricing": [21,[4]],
		"/(marketing)/privacy": [22,[4]],
		"/(app)/questionnaires": [~12,[2]],
		"/(app)/questionnaires/[id]": [~13,[2]],
		"/(marketing)/reset-password": [23,[4]],
		"/(app)/settings": [~14,[2,3]],
		"/(app)/settings/activity": [~15,[2,3]],
		"/(app)/settings/billing": [~16,[2,3]],
		"/(app)/settings/team": [~17,[2,3]],
		"/share/[token]": [~27],
		"/(marketing)/terms": [24,[4]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: universal_hooks.reroute || (() => {}),
	transport: universal_hooks.transport || {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';