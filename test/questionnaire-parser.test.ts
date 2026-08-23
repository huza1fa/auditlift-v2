import { describe, expect, it } from 'vitest';
import * as XLSX from 'xlsx';
import { PDFDocument } from 'pdf-lib';
import {
	parseQuestionnaire,
	parseRawText,
	parseDocxTables,
	ScannedPdfError
} from '../src/lib/server/questionnaire-parser';

function buildXlsx(sheets: Record<string, unknown[][]>): Buffer {
	const workbook = XLSX.utils.book_new();
	for (const [name, rows] of Object.entries(sheets)) {
		XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), name);
	}
	return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}

describe('questionnaire parser', () => {
	it('preserves numbered questions and section context from CSV uploads', async () => {
		const result = await parseQuestionnaire(
			Buffer.from(
				'Question,Section\n1. Is MFA required for all administrator accounts?,Access Control\nDo you encrypt customer data at rest and in transit?,Data Protection\n'
			),
			'csv'
		);

		expect(result.questions).toEqual([
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
		expect(result.truncated).toBe(false);
	});

	it('rejects unsupported questionnaire formats', async () => {
		await expect(parseQuestionnaire(Buffer.from('questions'), 'txt' as 'csv')).rejects.toThrow(
			'Unsupported format: txt'
		);
	});

	it('collects questions from every sheet and prefixes sections when multiple sheets contribute', async () => {
		const buffer = buildXlsx({
			'Access Control': [
				['Question', 'Section'],
				['Is MFA enforced for all users?', 'Authentication'],
				['Are passwords rotated regularly?', 'Authentication']
			],
			'Data Protection': [['Do you encrypt data at rest?']]
		});

		const result = await parseQuestionnaire(buffer, 'xlsx');

		expect(result.questions).toHaveLength(3);
		expect(result.warnings.some((w) => w.includes('2 sheets'))).toBe(true);
		expect(result.questions[0].sectionName).toBe('Access Control — Authentication');
		expect(result.questions[2].sectionName).toBe('Data Protection');
	});

	it('reads a single-sheet workbook without prefixing sections', async () => {
		const buffer = buildXlsx({
			Sheet1: [
				['Question'],
				['Do you perform annual penetration tests?'],
				['Is logging centralized?']
			]
		});

		const result = await parseQuestionnaire(buffer, 'xlsx');

		expect(result.questions).toHaveLength(2);
		expect(result.questions[0].sectionName).toBeNull();
		expect(result.warnings).toHaveLength(0);
	});

	it('forward-fills merged cells before column detection', () => {
		const workbook = XLSX.utils.book_new();
		const sheet = XLSX.utils.aoa_to_sheet([
			['Category', 'Question'],
			['Network Security', 'Do you use a firewall?'],
			['', 'Are VPNs required for remote access?']
		]);
		sheet['!merges'] = [{ s: { r: 2, c: 0 }, e: { r: 3, c: 0 } }];
		XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');

		const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;

		return parseQuestionnaire(buffer, 'xlsx').then((result) => {
			expect(result.questions).toHaveLength(2);
			expect(result.questions[1].sectionName).toBe('Network Security');
		});
	});

	it('detects the question column by content heuristics when no header row exists', async () => {
		const buffer = buildXlsx({
			Sheet1: [
				[
					'AC-1',
					'Access Control',
					'Describe how access requests are approved and reviewed over time.'
				],
				['AC-2', 'Access Control', 'How is privileged access granted and revoked?'],
				['AC-3', 'Monitoring', 'What tooling is used to alert on anomalous access patterns?']
			]
		});

		const result = await parseQuestionnaire(buffer, 'xlsx');

		expect(result.questions).toHaveLength(3);
		expect(result.questions[0].questionText).toContain('access requests are approved');
		expect(result.questions[0].sectionName).toBe('Access Control');
	});

	it('ignores answer columns in pre-filled vendor spreadsheets', async () => {
		const buffer = buildXlsx({
			Sheet1: [
				['Question', 'Answer'],
				['Do you encrypt data in transit?', 'Yes, TLS 1.2+ everywhere.'],
				['Do you have an incident response plan?', 'Yes, reviewed quarterly.']
			]
		});

		const result = await parseQuestionnaire(buffer, 'xlsx');

		expect(result.questions).toHaveLength(2);
		for (const q of result.questions) {
			expect(q.questionText).not.toContain('TLS');
			expect(q.questionText).not.toContain('quarterly');
		}
	});

	it('treats single-cell ALL-CAPS rows as section boundaries inside grids', async () => {
		const buffer = buildXlsx({
			Sheet1: [
				['Question'],
				['DATA PROTECTION'],
				['Do you classify data by sensitivity level?'],
				['Who owns the data classification standard?']
			]
		});

		const result = await parseQuestionnaire(buffer, 'xlsx');

		expect(result.questions).toHaveLength(2);
		expect(result.questions[0].sectionName).toBe('DATA PROTECTION');
		expect(result.questions[1].sectionName).toBe('DATA PROTECTION');
	});

	it('extracts questions from two-column docx tables', () => {
		const html = `<html><body><table>
			<tr><th>Control Question</th><th>Vendor Response</th></tr>
			<tr><td>Do you maintain a documented business continuity plan?</td><td>Yes.</td></tr>
			<tr><td>How often are backups tested for restorability?</td><td>Monthly.</td></tr>
		</table></body></html>`;

		const questions = parseDocxTables(html, []);

		expect(questions).toHaveLength(2);
		expect(questions[0].questionText).toBe(
			'Do you maintain a documented business continuity plan?'
		);
		expect(questions[1].questionText).toContain('backups tested');
	});

	it('throws a distinct error for scanned PDFs with no extractable text', async () => {
		const pdf = await PDFDocument.create();
		pdf.addPage([612, 792]);
		const bytes = await pdf.save();

		await expect(parseQuestionnaire(Buffer.from(bytes), 'pdf')).rejects.toBeInstanceOf(
			ScannedPdfError
		);
	});

	it('parses pasted raw text with numbered questions and sections', () => {
		const result = parseRawText(
			[
				'SECURITY OVERVIEW',
				'1. Describe your vulnerability management program and remediation timelines.',
				'2) How do you handle secrets management across environments?',
				'Thanks',
				''
			].join('\n')
		);

		expect(result.questions).toHaveLength(2);
		expect(result.questions[0].sectionName).toBe('SECURITY OVERVIEW');
		expect(result.questions[0].questionNumber).toBe('1.');
		expect(result.questions[1].questionNumber).toBe('2)');
		expect(result.totalDetected).toBe(2);
	});

	it('reports truncation metadata instead of silently dropping questions', () => {
		const lines: string[] = [];
		for (let i = 1; i <= 600; i++) {
			lines.push(`${i}. Question number ${i} about security controls and compliance posture?`);
		}
		const result = parseRawText(lines.join('\n'));

		expect(result.truncated).toBe(true);
		expect(result.totalDetected).toBe(600);
		expect(result.questions).toHaveLength(500);
	});
});
