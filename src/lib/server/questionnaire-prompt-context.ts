/** Formats verified facts for AI questionnaire prompts after they have been sanitized server-side. */
export function buildVerifiedFactsQuestionnaireContext(verifiedFactsPrompt: string): string {
	if (
		!verifiedFactsPrompt ||
		verifiedFactsPrompt === 'No verified organization facts are available.'
	)
		return '';

	return `
${verifiedFactsPrompt}

The verified organization facts above are authoritative sources for answer drafting. Use relevant facts directly in the answer. Do not infer additional company practices from a fact.`;
}
