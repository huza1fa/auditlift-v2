import { z } from 'zod';

export const AnswerCitationSchema = z.object({
	sourceType: z.enum(['policy', 'control', 'fact', 'system_description']),
	sourceId: z.string(),
	sourceTitle: z.string(),
	excerpt: z.string().max(300)
});

export type AnswerCitation = z.infer<typeof AnswerCitationSchema>;

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'gap';

/**
 * Keeps only citations whose policy/control IDs actually exist for the org.
 * Fact and system-description citations have no enforceable ID, so they pass
 * through as-is.
 */
export function filterValidCitations(
	citations: unknown,
	validPolicyIds: Set<string>,
	validControlIds: Set<string>
): AnswerCitation[] {
	if (!Array.isArray(citations)) return [];
	return citations.filter((c): c is AnswerCitation => {
		if (!c || typeof c !== 'object') return false;
		const citation = c as Partial<AnswerCitation>;
		if (
			typeof citation.sourceId !== 'string' ||
			typeof citation.sourceTitle !== 'string' ||
			typeof citation.excerpt !== 'string'
		)
			return false;
		if (
			citation.sourceType !== 'policy' &&
			citation.sourceType !== 'control' &&
			citation.sourceType !== 'fact' &&
			citation.sourceType !== 'system_description'
		)
			return false;
		if (citation.sourceType === 'policy') return validPolicyIds.has(citation.sourceId);
		if (citation.sourceType === 'control') return validControlIds.has(citation.sourceId);
		return true;
	});
}

/** One-level confidence downgrade for answers that fail verification. */
export function downgradeConfidence(confidence: ConfidenceLevel): ConfidenceLevel {
	if (confidence === 'high') return 'medium';
	if (confidence === 'medium') return 'low';
	return confidence;
}

export interface VerificationItem {
	index: number;
	questionText: string;
	answer: string;
	confidence: ConfidenceLevel;
	citations: Array<{ sourceTitle: string; excerpt: string }>;
}

/** Only org-grounded answers are worth spending a verification call on. */
export function isVerifiable(confidence: ConfidenceLevel): boolean {
	return confidence === 'high' || confidence === 'medium';
}
