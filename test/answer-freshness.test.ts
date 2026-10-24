import { describe, expect, it } from 'vitest';
import {
	answerRevision,
	createFreshnessContext,
	fingerprint,
	type KnowledgeSource,
	type ReviewedAnswer,
	type VersionedCitation
} from '../src/lib/server/answer-freshness';
import {
	quotesMatchSources,
	ReviewAnswerSchema,
	selectReviewedCitations
} from '../src/lib/server/answer-review';

const now = new Date('2026-10-24T12:00:00Z');
const policy: KnowledgeSource = {
	type: 'policy',
	id: 'policy-1',
	title: 'Retention',
	available: true,
	version: 'version-1',
	currentText: 'We retain data for 90 days.'
};
const citation: VersionedCitation = {
	sourceType: 'policy',
	sourceId: policy.id,
	sourceTitle: policy.title,
	excerpt: '90 days',
	sourceVersion: policy.version
};
function entry(id = 'answer-1', changes: Partial<ReviewedAnswer> = {}): ReviewedAnswer {
	return {
		id,
		questionText: 'How long is data retained?',
		answer: '90 days',
		scope: 'Company-wide',
		status: 'approved',
		citations: [citation],
		reviewedAt: now,
		updatedAt: now,
		expiresAt: null,
		...changes
	};
}
function reference(answer: ReviewedAnswer): VersionedCitation {
	return {
		sourceType: 'approved_answer',
		sourceId: answer.id,
		sourceTitle: answer.questionText,
		excerpt: answer.answer,
		sourceVersion: answerRevision(answer)
	};
}

describe('answer freshness dependency graph', () => {
	it('reuses an approved answer only while all its sources are current', () => {
		const context = createFreshnessContext([policy], [entry()], now);
		expect(context.approvedEntries()).toHaveLength(1);
		expect(context.citationIssues([citation])).toEqual([]);
	});
	it.each([
		[{ ...policy, version: 'version-2' }, 'changed'],
		[{ ...policy, available: false }, 'unavailable']
	] as const)('flags changed or archived sources', (source, reason) => {
		const context = createFreshnessContext([source], [entry()], now);
		expect(context.entryIssues('answer-1')[0].reason).toBe(reason);
		expect(context.approvedEntries()).toEqual([]);
	});
	it('flags deleted or cross-tenant sources, without a database lookup per answer', () => {
		const context = createFreshnessContext([], [entry()], now);
		expect(context.entryIssues('answer-1')[0].reason).toBe('unavailable');
	});
	it('treats legacy citations as needing review rather than silently trusting current content', () => {
		const context = createFreshnessContext(
			[policy],
			[entry('a', { citations: [{ ...citation, sourceVersion: undefined }] })],
			now
		);
		expect(context.entryIssues('a')[0].reason).toBe('unversioned');
	});
	it.each(['fact', 'system_description', 'control'])(
		'detects version changes for %s sources',
		(type) => {
			const source = {
				...policy,
				type,
				id: type === 'system_description' ? 'organization' : policy.id
			};
			const c = { ...citation, sourceType: type };
			expect(
				createFreshnessContext([{ ...source, version: 'new' }], [], now).citationIssues([c])[0]
					.reason
			).toBe('changed');
		}
	);
	it('does not leak questionnaire-scoped facts into company-wide reuse or other buyers', () => {
		const fact = { ...policy, type: 'fact', questionnaireId: 'buyer-a' };
		const c = { ...citation, sourceType: 'fact' };
		const context = createFreshnessContext([fact], [], now);
		expect(context.citationIssues([c], 'buyer-a')).toEqual([]);
		expect(context.citationIssues([c], 'buyer-b')[0].reason).toBe('unavailable');
		expect(context.citationIssues([c])[0].reason).toBe('unavailable');
		expect(context.reviewSources([c])[0].currentText).toBe('');
	});
	it('never treats a buyer-specific scope label as permission for company-wide reuse', () => {
		const context = createFreshnessContext(
			[policy],
			[entry('buyer-answer', { scope: 'Buyer A only' })],
			now
		);
		expect(context.entryIssues('buyer-answer')[0].reason).toBe('scope');
		expect(context.approvedEntries()).toEqual([]);
	});
	it('handles expiration exactly at the deadline', () => {
		expect(
			createFreshnessContext([policy], [entry('a', { expiresAt: now })], now).entryIssues('a')[0]
				.reason
		).toBe('expired');
	});
	it.each(['stale', 'retired'])('excludes %s entries', (status) => {
		expect(
			createFreshnessContext([policy], [entry('a', { status })], now).approvedEntries()
		).toEqual([]);
	});
	it('propagates changes through multiple generations of reused answers', () => {
		const a = entry('a');
		const b = entry('b', { citations: [reference(a)] });
		const c = entry('c', { citations: [reference(b)] });
		const context = createFreshnessContext([{ ...policy, version: 'new' }], [a, b, c], now);
		expect(context.approvedEntries()).toEqual([]);
		expect(context.entryIssues('c')[0].reason).toBe('stale');
	});
	it('requires re-review of downstream answers even after their supporting answer is reapproved', () => {
		const a = entry('a');
		const b = entry('b', { citations: [reference(a)] });
		const changed = { ...a, answer: '30 days', reviewedAt: new Date(now.getTime() + 1) };
		const context = createFreshnessContext([policy], [changed, b], now);
		expect(context.entryIssues('b')[0].reason).toBe('changed');
	});
	it('fails closed for deleted approved-answer references', () => {
		expect(createFreshnessContext([], [], now).citationIssues([reference(entry())])[0].reason).toBe(
			'unavailable'
		);
	});
	it('detects self-references and indirect cycles without recursion loops', () => {
		const a = entry('a', { citations: [] });
		const b = entry('b', { citations: [reference(a)] });
		a.citations = [reference(b)];
		const context = createFreshnessContext([], [a, b], now);
		expect(context.approvedEntries()).toEqual([]);
		expect(context.dependsOn(a.citations, 'a')).toBe(true);
		expect(context.entryIssues('a')[0].reason).toBe('cycle');
		expect(context.dependsOn(a.citations, 'unrelated')).toBe(false);
	});
	it('bounds pathological dependency depth', () => {
		const entries = [entry('0', { citations: [] })];
		for (let index = 1; index < 150; index++)
			entries.push(entry(String(index), { citations: [reference(entries[index - 1])] }));
		const context = createFreshnessContext([], entries.reverse(), now);
		expect(() => context.approvedEntries()).not.toThrow();
		expect(context.entryIssues('149').length).toBeGreaterThan(0);
	});
	it('preserves manual attestation without claiming supporting citations exist', () => {
		expect(
			createFreshnessContext([], [entry('a', { citations: [] })], now).approvedEntries()
		).toHaveLength(1);
	});
	it('ignores supplied source versions when stamping and never fabricates missing source versions', () => {
		const context = createFreshnessContext([policy], [], now);
		expect(context.stamp([{ ...citation, sourceVersion: 'forged' }])[0].sourceVersion).toBe(
			policy.version
		);
		expect(
			context.stamp([{ ...citation, sourceId: 'missing', sourceVersion: 'forged' }])[0]
				.sourceVersion
		).toBeUndefined();
	});
	it('leaves original question wording and citations immutable during freshness checks', () => {
		const answer = entry();
		const original = structuredClone(answer);
		createFreshnessContext([{ ...policy, version: 'changed' }], [answer], now).approvedEntries();
		expect(answer).toEqual(original);
	});
	it('keeps review tokens stable across database row ordering', () => {
		const sources = [policy, { ...policy, id: 'policy-2' }];
		const entries = [entry('a'), entry('b')];
		const a = createFreshnessContext(sources, entries, now);
		const b = createFreshnessContext([...sources].reverse(), [...entries].reverse(), now);
		expect(a.revision).toBe(b.revision);
		expect(a.reviewToken([{ id: 'q' }])).toBe(b.reviewToken([{ id: 'q' }]));
	});
	it('invalidates export acknowledgement on answer, source, and expiration changes', () => {
		const base = createFreshnessContext([policy], [entry()], now).reviewToken(['answer']);
		expect(
			createFreshnessContext([{ ...policy, version: 'new' }], [entry()], now).reviewToken([
				'answer'
			])
		).not.toBe(base);
		expect(
			createFreshnessContext([policy], [entry()], now).reviewToken(['edited answer'])
		).not.toBe(base);
		const expiring = entry('a', { expiresAt: new Date(now.getTime() + 1) });
		expect(createFreshnessContext([policy], [expiring], now).revision).not.toBe(
			createFreshnessContext([policy], [expiring], new Date(now.getTime() + 2)).revision
		);
	});
	it('hashes source objects independently of object-key order', () => {
		expect(fingerprint({ a: 1, b: { c: 2, d: 3 } })).toBe(fingerprint({ b: { d: 3, c: 2 }, a: 1 }));
	});
});

describe('explicit human review validation', () => {
	const input = {
		action: 'approve' as const,
		revision: 'a'.repeat(64),
		sourceRevision: 'b'.repeat(64),
		answer: '30 days',
		scope: 'Company-wide',
		expiresAt: null,
		sourceIndexes: [0],
		sourceExcerpts: { 0: '30 days' },
		confirmed: true as const
	};
	it('requires explicit confirmation and optimistic revisions', () => {
		expect(ReviewAnswerSchema.safeParse(input).success).toBe(true);
		expect(ReviewAnswerSchema.safeParse({ ...input, confirmed: false }).success).toBe(false);
		expect(ReviewAnswerSchema.safeParse({ ...input, sourceRevision: '' }).success).toBe(false);
	});
	it('rejects blank answers, invalid dates, negative indices, oversized quotes and input', () => {
		for (const change of [
			{ answer: ' ' },
			{ expiresAt: 'tomorrow' },
			{ sourceIndexes: [-1] },
			{ sourceExcerpts: { 0: 'x'.repeat(301) } },
			{ answer: 'x'.repeat(10001) }
		]) {
			expect(ReviewAnswerSchema.safeParse({ ...input, ...change }).success).toBe(false);
		}
	});
	it('uses only existing citations and rejects forged selections', () => {
		expect(selectReviewedCitations([citation], input)?.[0].sourceId).toBe(citation.sourceId);
		expect(selectReviewedCitations([citation], { ...input, sourceIndexes: [99] })).toBeNull();
		expect(selectReviewedCitations([citation], { ...input, sourceExcerpts: {} })).toBeNull();
		expect(selectReviewedCitations([citation], { ...input, sourceIndexes: [] })).toEqual([]);
	});
	it('requires verbatim current evidence, normalizing whitespace only', () => {
		expect(
			quotesMatchSources(
				[citation],
				[{ available: true, currentText: 'We retain data for 90\n days.' }]
			)
		).toBe(true);
		expect(
			quotesMatchSources(
				[citation],
				[{ available: true, currentText: 'We retain data for 30 days.' }]
			)
		).toBe(false);
		expect(
			quotesMatchSources([citation], [{ available: false, currentText: policy.currentText! }])
		).toBe(false);
	});
});
