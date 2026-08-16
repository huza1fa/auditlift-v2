import { describe, expect, it } from 'vitest';
import { parseQuestionnaire } from '../src/lib/server/questionnaire-parser';

describe('questionnaire parser', () => {
	it('preserves numbered questions and section context from CSV uploads', async () => {
		const questions = await parseQuestionnaire(
			Buffer.from(
				'Question,Section\n1. Is MFA required for all administrator accounts?,Access Control\nDo you encrypt customer data at rest and in transit?,Data Protection\n'
			),
			'csv'
		);

		expect(questions).toEqual([
			{
				sectionName: 'Access Control',
				questionNumber: '1.',
				questionText: 'Is MFA required for all administrator accounts?',
				order: 0
			},
			{
				sectionName: 'Data Protection',
				questionNumber: null,
				questionText: 'Do you encrypt customer data at rest and in transit?',
				order: 1
			}
		]);
	});

	it('rejects unsupported questionnaire formats', async () => {
		await expect(parseQuestionnaire(Buffer.from('questions'), 'txt' as 'csv')).rejects.toThrow(
			'Unsupported format: txt'
		);
	});
});
