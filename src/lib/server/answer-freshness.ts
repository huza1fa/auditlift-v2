import { createHash } from 'node:crypto';

export interface VersionedCitation {
	sourceType: string;
	sourceId: string;
	sourceTitle: string;
	excerpt: string;
	/** Written by the server, never trusted from AI or client input. */
	sourceVersion?: string;
}

export interface KnowledgeSource {
	type: string;
	id: string;
	title: string;
	version: string;
	available: boolean;
	currentText?: string;
	questionnaireId?: string | null;
}

export interface ReviewedAnswer {
	id: string;
	questionText: string;
	answer: string;
	scope: string;
	status: string;
	citations: VersionedCitation[] | null;
	reviewedAt: Date;
	expiresAt: Date | null;
	updatedAt: Date;
	sourceQuestionId?: string | null;
}

export interface FreshnessIssue {
	sourceTitle: string;
	reason:
		| 'changed'
		| 'unavailable'
		| 'unversioned'
		| 'expired'
		| 'stale'
		| 'retired'
		| 'cycle'
		| 'scope';
}

/** Stable for reordered object keys; array order remains significant. */
export function fingerprint(value: unknown): string {
	return createHash('sha256')
		.update(
			JSON.stringify(value, (_key, item) => {
				if (item && typeof item === 'object' && !Array.isArray(item)) {
					return Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b)));
				}
				return item;
			})
		)
		.digest('hex');
}

export function answerRevision(entry: ReviewedAnswer): string {
	return fingerprint(entry);
}

/** One tenant-scoped, request-local dependency graph. No per-answer database queries. */
export function createFreshnessContext(
	sources: KnowledgeSource[],
	entries: ReviewedAnswer[],
	now = new Date()
) {
	const sourceMap = new Map(sources.map((source) => [`${source.type}:${source.id}`, source]));
	const entryMap = new Map(entries.map((entry) => [entry.id, entry]));
	const revisions = new Map(entries.map((entry) => [entry.id, answerRevision(entry)]));
	const memo = new Map<string, FreshnessIssue[]>();
	const visiting = new Set<string>();
	const reviewSourceCache = new Map<string, { available: boolean; currentText: string }>();

	function sourceFor(citation: VersionedCitation, questionnaireId?: string) {
		const source = sourceMap.get(
			citation.sourceType === 'system_description'
				? 'system_description:organization'
				: `${citation.sourceType}:${citation.sourceId}`
		);
		if (source?.questionnaireId && source.questionnaireId !== questionnaireId) return undefined;
		return source;
	}

	function citationIssues(
		citations: VersionedCitation[] | null,
		questionnaireId?: string
	): FreshnessIssue[] {
		return (citations ?? []).flatMap((citation): FreshnessIssue[] => {
			const issue = (reason: FreshnessIssue['reason']) => [
				{ sourceTitle: citation.sourceTitle, reason }
			];
			if (citation.sourceType === 'approved_answer') {
				const entry = entryMap.get(citation.sourceId);
				if (!entry) return issue('unavailable');
				const dependencyIssues = entryIssues(entry.id);
				if (dependencyIssues.length)
					return issue(
						dependencyIssues.some((item) => item.reason === 'cycle') ? 'cycle' : 'stale'
					);
				if (!citation.sourceVersion) return issue('unversioned');
				return citation.sourceVersion === revisions.get(entry.id) ? [] : issue('changed');
			}
			const source = sourceFor(citation, questionnaireId);
			if (!source?.available) return issue('unavailable');
			if (!citation.sourceVersion) return issue('unversioned');
			return citation.sourceVersion === source.version ? [] : issue('changed');
		});
	}

	function entryIssues(id: string): FreshnessIssue[] {
		if (memo.has(id)) return memo.get(id)!;
		const entry = entryMap.get(id);
		if (!entry) return [{ sourceTitle: '', reason: 'unavailable' }];
		if (visiting.has(id)) return [{ sourceTitle: entry.questionText, reason: 'cycle' }];
		// Fail closed on pathological graphs without overflowing the JavaScript stack.
		if (visiting.size >= 64) return [{ sourceTitle: entry.questionText, reason: 'stale' }];
		const issues: FreshnessIssue[] = [];
		if (entry.scope !== 'Company-wide') {
			issues.push({ sourceTitle: entry.scope, reason: 'scope' });
		}
		if (entry.status !== 'approved') {
			issues.push({
				sourceTitle: entry.questionText,
				reason: entry.status === 'retired' ? 'retired' : 'stale'
			});
		}
		if (entry.expiresAt && entry.expiresAt <= now) {
			issues.push({ sourceTitle: entry.questionText, reason: 'expired' });
		}
		visiting.add(id);
		issues.push(...citationIssues(entry.citations));
		visiting.delete(id);
		memo.set(id, issues);
		return issues;
	}

	function dependsOn(citations: VersionedCitation[], targetId: string): boolean {
		const seen = new Set<string>();
		const pending = citations
			.filter((c) => c.sourceType === 'approved_answer')
			.map((c) => c.sourceId);
		while (pending.length) {
			const id = pending.pop()!;
			if (id === targetId) return true;
			if (seen.has(id)) continue;
			seen.add(id);
			for (const citation of entryMap.get(id)?.citations ?? []) {
				if (citation.sourceType === 'approved_answer') pending.push(citation.sourceId);
			}
		}
		return false;
	}

	/** Captures exactly the sources supplied to drafting or explicitly reviewed by a human. */
	function stamp<T extends VersionedCitation>(
		citations: T[],
		questionnaireId?: string
	): Array<Omit<T, 'sourceVersion'> & { sourceVersion?: string }> {
		return citations.map((citation) => {
			const { sourceVersion: _ignored, ...clean } = citation;
			const entry =
				citation.sourceType === 'approved_answer' ? entryMap.get(citation.sourceId) : undefined;
			const source = sourceFor(citation, questionnaireId);
			const version =
				entry && entryIssues(entry.id).length === 0
					? revisions.get(entry.id)
					: source?.available
						? source.version
						: undefined;
			return {
				...clean,
				sourceTitle: entry?.questionText ?? source?.title ?? clean.sourceTitle,
				...(version ? { sourceVersion: version } : {})
			};
		});
	}

	const revision = fingerprint({
		sources: sources
			.map(({ type, id, version, available, questionnaireId }) => ({
				type,
				id,
				version,
				available,
				questionnaireId
			}))
			.sort((a, b) => `${a.type}:${a.id}`.localeCompare(`${b.type}:${b.id}`)),
		entries: entries
			.map((entry) => ({
				id: entry.id,
				version: revisions.get(entry.id),
				expired: !!entry.expiresAt && entry.expiresAt <= now
			}))
			.sort((a, b) => a.id.localeCompare(b.id))
	});
	return {
		entries,
		revision,
		entryIssues,
		citationIssues,
		stamp,
		dependsOn,
		reviewSources: (citations: VersionedCitation[] | null, questionnaireId?: string) =>
			(citations ?? []).map((citation) => {
				const key = `${citation.sourceType}:${citation.sourceId}:${questionnaireId ?? ''}`;
				const cached = reviewSourceCache.get(key);
				if (cached) return cached;
				const entry =
					citation.sourceType === 'approved_answer' ? entryMap.get(citation.sourceId) : undefined;
				const source = sourceFor(citation, questionnaireId);
				const result = {
					available: entry ? entryIssues(entry.id).length === 0 : source?.available === true,
					currentText: entry?.answer ?? source?.currentText ?? ''
				};
				reviewSourceCache.set(key, result);
				return result;
			}),
		approvedEntries: () => entries.filter((entry) => entryIssues(entry.id).length === 0),
		// Bind export acknowledgement to current source state, not just warning counts.
		reviewToken: (questions: unknown) => fingerprint({ revision, questions })
	};
}
