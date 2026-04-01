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
	() => import('./nodes/19')
];

export const server_loads = [2];

export const dictionary = {
		"/(marketing)": [15,[3]],
		"/(app)/controls": [~4,[2]],
		"/(app)/controls/[controlId]": [~5,[2]],
		"/(app)/dashboard": [~6,[2]],
		"/(app)/evidence": [~7,[2]],
		"/(app)/export": [~8,[2]],
		"/(app)/frameworks": [~9,[2]],
		"/invite/[token]": [~18],
		"/(marketing)/login": [16,[3]],
		"/onboarding": [~19],
		"/(app)/policies": [~10,[2]],
		"/(marketing)/pricing": [17,[3]],
		"/(app)/settings": [~11,[2]],
		"/(app)/settings/activity": [~12,[2]],
		"/(app)/settings/billing": [~13,[2]],
		"/(app)/settings/team": [~14,[2]]
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