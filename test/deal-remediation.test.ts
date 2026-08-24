import { describe, expect, it } from 'vitest';
import { buildRemediationPlan, type RemediationQuestion } from '../src/lib/server/deal-remediation';

const controls = [
	{ id: 'control-access', code: 'CC6.1', title: 'Logical access', category: 'Access' },
	{ id: 'control-evidence', code: 'CC7.2', title: 'Monitoring', category: 'Operations' }
];

describe('buildRemediationPlan', () => {
	it('prioritizes policy, evidence, fact confirmation, and review deterministically', () => {
		const result = buildRemediationPlan({
			questions: [
				{
					id: 'medium',
					order: 4,
					questionText: 'Do you enforce MFA?',
					domain: 'access_control',
					confidence: 'medium',
					gapReason: null,
					gapRemediation: null,
					generatedAnswer: 'MFA is required.',
					userEditedAnswer: null,
					mappedControlIds: ['control-access'],
					mappedPolicyIds: ['policy-access']
				},
				{
					id: 'low',
					order: 3,
					questionText: 'Which identity provider do you use?',
					domain: 'access_control',
					confidence: 'low',
					gapReason: null,
					gapRemediation: null,
					generatedAnswer: 'Confirm your identity provider.',
					userEditedAnswer: null,
					mappedControlIds: ['control-access'],
					mappedPolicyIds: []
				},
				{
					id: 'policy',
					order: 2,
					questionText: 'Describe access reviews.',
					domain: 'access_control',
					confidence: 'gap',
					gapReason: 'No policy exists.',
					gapRemediation: 'Generate an access control policy.',
					generatedAnswer: null,
					userEditedAnswer: null,
					mappedControlIds: ['control-access'],
					mappedPolicyIds: []
				},
				{
					id: 'evidence',
					order: 1,
					questionText: 'Provide a screenshot of monitoring alerts.',
					domain: 'vulnerability_management',
					confidence: 'gap',
					gapReason: 'Evidence is missing.',
					gapRemediation: 'Upload monitoring evidence.',
					generatedAnswer: null,
					userEditedAnswer: null,
					mappedControlIds: ['control-evidence'],
					mappedPolicyIds: []
				}
			],
			controls,
			existingPolicyIds: new Set(['policy-access']),
			controlIdsWithPolicy: new Set(),
			controlIdsWithEvidence: new Set()
		});

		expect(result.actions.map((action) => action.type)).toEqual([
			'generate_policy',
			'upload_evidence',
			'confirm_fact',
			'answer_now'
		]);
		expect(result.actions.map((action) => action.priority)).toEqual([1, 2, 3, 4]);
		expect(result.actions[0]).toMatchObject({
			proposedPolicyType: 'access-control-policy',
			questionIds: ['policy'],
			controlImpact: [controls[0]]
		});
		expect(result.counts.byType).toEqual({
			answer_now: { actions: 1, questions: 1 },
			confirm_fact: { actions: 1, questions: 1 },
			generate_policy: { actions: 1, questions: 1 },
			upload_evidence: { actions: 1, questions: 1 }
		});
	});

	it('does not recommend work that a reviewed answer or non-question already resolves', () => {
		const result = buildRemediationPlan({
			questions: [
				{
					id: 'reviewed',
					order: 1,
					questionText: 'Provide monitoring evidence.',
					domain: 'general',
					confidence: 'gap',
					gapReason: 'Evidence missing',
					gapRemediation: 'Upload evidence',
					generatedAnswer: null,
					userEditedAnswer: 'Reviewed answer',
					mappedControlIds: ['control-evidence'],
					mappedPolicyIds: []
				},
				{
					id: 'heading',
					order: 2,
					questionText: 'Security overview',
					domain: 'general',
					confidence: 'gap',
					gapReason: 'Not a question - this is a section heading.',
					gapRemediation: null,
					generatedAnswer: null,
					userEditedAnswer: null,
					mappedControlIds: [],
					mappedPolicyIds: []
				}
			],
			controls,
			existingPolicyIds: new Set(),
			controlIdsWithPolicy: new Set(),
			controlIdsWithEvidence: new Set(['control-evidence'])
		});

		expect(result.actions).toEqual([]);
		expect(result.controlImpact).toEqual({
			controlsAffected: 0,
			controlsWithExistingPolicy: 0,
			controlsWithEvidence: 0
		});
	});

	it('does not present an internal processing failure as a customer remediation task', () => {
		const result = buildRemediationPlan({
			questions: [
				{
					id: 'retry',
					order: 1,
					questionText: 'Do you have an incident response plan?',
					domain: 'incident_response',
					confidence: 'gap',
					gapReason: 'Processing failed due to an internal error.',
					gapRemediation: 'Confirm company facts.',
					generatedAnswer: null,
					userEditedAnswer: null,
					mappedControlIds: [],
					mappedPolicyIds: []
				}
			],
			controls,
			existingPolicyIds: new Set(),
			controlIdsWithPolicy: new Set(),
			controlIdsWithEvidence: new Set()
		});

		expect(result.actions).toEqual([]);
	});

	it('groups and orders the same plan regardless of input order', () => {
		const questions: RemediationQuestion[] = [
			{
				id: 'second',
				order: 2,
				questionText: 'Describe access reviews.',
				domain: 'access_control',
				confidence: 'gap',
				gapReason: 'No policy exists.',
				gapRemediation: 'Generate an access control policy.',
				generatedAnswer: null,
				userEditedAnswer: null,
				mappedControlIds: ['control-access'],
				mappedPolicyIds: []
			},
			{
				id: 'first',
				order: 1,
				questionText: 'How is access approved?',
				domain: 'access_control',
				confidence: 'gap',
				gapReason: 'No policy exists.',
				gapRemediation: 'Generate an access control policy.',
				generatedAnswer: null,
				userEditedAnswer: null,
				mappedControlIds: ['control-access'],
				mappedPolicyIds: []
			}
		];
		const context = {
			controls,
			existingPolicyIds: new Set<string>(),
			controlIdsWithPolicy: new Set<string>(),
			controlIdsWithEvidence: new Set<string>()
		};

		expect(buildRemediationPlan({ ...context, questions })).toEqual(
			buildRemediationPlan({ ...context, questions: [...questions].reverse() })
		);
	});
});
