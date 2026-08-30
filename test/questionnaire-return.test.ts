import { describe, expect, it } from 'vitest';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import { writeAnswersToCsv, writeAnswersToXlsx } from '../src/lib/server/questionnaire-return';

describe('questionnaire return-to-sender export', () => {
	it('updates only response cells and preserves untouched XLSX parts', async () => {
		const zip = new JSZip();
		zip.file(
			'xl/workbook.xml',
			'<workbook xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Security Review" sheetId="1" r:id="rId1"/><sheet name="Notes" sheetId="2" r:id="rId2"/></sheets></workbook>'
		);
		zip.file(
			'xl/_rels/workbook.xml.rels',
			'<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Target="worksheets/sheet2.xml"/></Relationships>'
		);
		zip.file('xl/styles.xml', '<styleSheet><cellXfs count="1"/></styleSheet>');
		zip.file(
			'xl/worksheets/sheet1.xml',
			'<worksheet><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>Question</t></is></c><c r="B1" t="inlineStr"><is><t>Answer</t></is></c></row><row r="2"><c r="A2" t="inlineStr"><is><t>Do you encrypt data?</t></is></c><c r="B2" s="4"/></row></sheetData></worksheet>'
		);
		zip.file(
			'xl/worksheets/sheet2.xml',
			'<worksheet><sheetData><row r="1"/></sheetData></worksheet>'
		);

		const original = Buffer.from(await zip.generateAsync({ type: 'nodebuffer' }));
		const result = await writeAnswersToXlsx(original, [
			{
				answer: 'Yes, AES-256 at rest & TLS in transit.',
				sourceLocation: { sheetName: 'Security Review', questionCell: 'A2', answerCell: 'B2' }
			}
		]);
		const returned = await JSZip.loadAsync(result);

		expect(await returned.file('xl/worksheets/sheet1.xml')?.async('string')).toContain(
			'<c r="B2" s="4" t="inlineStr"><is><t xml:space="preserve">Yes, AES-256 at rest &amp; TLS in transit.</t></is></c>'
		);
		expect(await returned.file('xl/styles.xml')?.async('string')).toBe(
			'<styleSheet><cellXfs count="1"/></styleSheet>'
		);
		expect(await returned.file('xl/worksheets/sheet2.xml')?.async('string')).toBe(
			'<worksheet><sheetData><row r="1"/></sheetData></worksheet>'
		);
	});

	it('fills the original CSV response column', () => {
		const original = Buffer.from('Question,Answer\nDo you encrypt data?,\n');
		const result = writeAnswersToCsv(original, [
			{
				answer: 'Yes',
				sourceLocation: { sheetName: 'Sheet1', questionCell: 'A2', answerCell: 'B2' }
			}
		]);
		const parsed = XLSX.utils.sheet_to_json(XLSX.read(result, { type: 'buffer' }).Sheets.Sheet1, {
			header: 1
		});

		expect(parsed).toEqual([
			['Question', 'Answer'],
			['Do you encrypt data?', 'Yes']
		]);
	});
});
