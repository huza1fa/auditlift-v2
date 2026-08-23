import { describe, expect, it } from 'vitest';
import {
	filterValidCitations,
	downgradeConfidence,
	isVerifiable
} from '../src/lib/server/answer-citations';

const policyIds = new Set(['policy-1', 'policy-2']);
const controlIds = new Set(['control-1']);

describe('filterValidCitations', () => {
	it('keeps citations that reference real policies and controls', () => {
		const citations = [
			{
				sourceType: 'policy',
				sourceId: 'policy-1',
				sourceTitle: 'Access Control Policy',
				excerpt: 'MFA is required.'
			},
			{
				sourceType: 'control',
				sourceId: 'control-1',
				sourceTitle: 'CC6.1',
				excerpt: 'Logical access.'
			}
		];
		expect(filterValidCitations(citations, policyIds, controlIds)).toEqual(citations);
	});

	it('drops citations with unknown policy or control IDs', () => {
		const citations = [
			{ sourceType: 'policy', sourceId: 'fabricated-id', sourceTitle: 'Fake Policy', excerpt: 'x' },
			{ sourceType: 'control', sourceId: 'missing-control', sourceTitle: 'CC9.9', excerpt: 'y' }
		];
		expect(filterValidCitations(citations, policyIds, controlIds)).toEqual([]);
	});

	it('passes fact and system-description citations through without ID checks', () => {
		const citations = [
			{
				sourceType: 'fact',
				sourceId: 'cloud_provider',
				sourceTitle: 'Cloud provider',
				excerpt: 'AWS us-east-1'
			},
			{
				sourceType: 'system_description',
				sourceId: 'identity_provider',
				sourceTitle: 'Identity provider',
				excerpt: 'Google Workspace SSO'
			}
		];
		expect(filterValidCitations(citations, new Set(), new Set())).toEqual(citations);
	});

	it('returns an empty array for malformed input', () => {
		expect(filterValidCitations(null, policyIds, controlIds)).toEqual([]);
		expect(filterValidCitations([null, 'string', 42], policyIds, controlIds)).toEqual([]);
		expect(
			filterValidCitations([{ sourceType: 'unknown', sourceId: 'x' }], policyIds, controlIds)
		).toEqual([]);
	});
});

describe('downgradeConfidence', () => {
	it('downgrades high to medium and medium to low', () => {
		expect(downgradeConfidence('high')).toBe('medium');
		expect(downgradeConfidence('medium')).toBe('low');
	});

	it('never downgrades below low and leaves gaps untouched', () => {
		expect(downgradeConfidence('low')).toBe('low');
		expect(downgradeConfidence('gap')).toBe('gap');
	});
});

describe('isVerifiable', () => {
	it('targets only org-grounded answers', () => {
		expect(isVerifiable('high')).toBe(true);
		expect(isVerifiable('medium')).toBe(true);
		expect(isVerifiable('low')).toBe(false);
		expect(isVerifiable('gap')).toBe(false);
	});
});
