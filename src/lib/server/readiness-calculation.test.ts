import { describe, expect, it } from 'vitest';
import { calculateReadiness } from './readiness-calculation';

const controls = [
	{ id: 'evidence', code: 'CC1.1', title: 'Evidence', category: 'Test' },
	{ id: 'policy', code: 'CC1.2', title: 'Policy', category: 'Test' },
	{ id: 'questionnaire', code: 'CC1.3', title: 'Questionnaire', category: 'Test' },
	{ id: 'blocker', code: 'CC1.4', title: 'Blocker', category: 'Test' }
];

describe('calculateReadiness', () => {
	it('counts evidence, policies, and questionnaire mappings as coverage', () => {
		const result = calculateReadiness(controls, new Set(['evidence', 'policy', 'questionnaire']));

		expect(result.score).toBe(75);
		expect(result.completedControls).toBe(3);
		expect(result.blockers).toEqual([controls[3]]);
	});
});
