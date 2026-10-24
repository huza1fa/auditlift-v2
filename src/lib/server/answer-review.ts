import { z } from 'zod';
import type { VersionedCitation } from './answer-freshness';
import type { CurrentAnswerSource } from '../answer-sources';

const reviewRevision = z.string().regex(/^[a-f0-9]{64}$/);
export const SourceReviewSchema = z.object({
	sourceRevision: reviewRevision,
	sourceIndexes: z.array(z.number().int().min(0)).max(100),
	sourceExcerpts: z.record(z.string().regex(/^\d{1,3}$/), z.string().trim().min(1).max(300)),
	confirmed: z.literal(true)
});
export const QuestionSourceReviewSchema = SourceReviewSchema.extend({ revision: reviewRevision });
export const ReviewAnswerSchema = z.discriminatedUnion('action', [
	z.object({ action: z.literal('retire'), revision: reviewRevision }),
	z
		.object({
			action: z.literal('approve'),
			revision: reviewRevision,
			answer: z.string().trim().min(1).max(10000),
			scope: z.literal('Company-wide'),
			expiresAt: z.string().datetime().nullable()
		})
		.extend(SourceReviewSchema.shape)
]);

/** No client-supplied IDs or source versions: selections can only refer to existing citations. */
export function selectReviewedCitations(
	citations: VersionedCitation[] | null,
	input: z.infer<typeof SourceReviewSchema>
): VersionedCitation[] | null {
	const original = citations ?? [];
	if (input.sourceIndexes.some((index) => index >= original.length)) return null;
	const selected = [...new Set(input.sourceIndexes)];
	if (selected.some((index) => !input.sourceExcerpts[index])) return null;
	return selected.map((index) => ({ ...original[index], excerpt: input.sourceExcerpts[index] }));
}

export function quotesMatchSources(
	citations: VersionedCitation[],
	sources: CurrentAnswerSource[]
): boolean {
	const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();
	return citations.every(
		(citation, index) =>
			sources[index]?.available &&
			!!normalize(citation.excerpt) &&
			normalize(sources[index].currentText).includes(normalize(citation.excerpt))
	);
}
