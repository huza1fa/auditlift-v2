import JSZip from 'jszip';
import * as XLSX from 'xlsx';

export interface SpreadsheetSourceLocation {
	sheetName: string;
	questionCell: string;
	answerCell: string | null;
}

export interface ReturnAnswer {
	answer: string;
	sourceLocation: SpreadsheetSourceLocation;
}

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function rowNumber(cellAddress: string): number {
	const match = cellAddress.match(/\d+$/);
	if (!match) throw new Error(`Invalid spreadsheet cell address: ${cellAddress}`);
	return Number(match[0]);
}

function inlineStringCell(address: string, answer: string, existingCell?: string): string {
	const openingTag = existingCell?.match(/^<c\b([^>]*?)(?:\/?)>/i)?.[1] ?? ` r="${address}"`;
	const attributes = openingTag
		.replace(/\s+t=(?:"[^"]*"|'[^']*')/gi, '')
		.replace(/\s+r=(?:"[^"]*"|'[^']*')/gi, ` r="${address}"`);
	return `<c${attributes} t="inlineStr"><is><t xml:space="preserve">${escapeXml(answer)}</t></is></c>`;
}

/**
 * Changes one response cell in a worksheet XML string without deserializing the
 * entire workbook. Styles, validations, drawings, defined names, and untouched
 * XML entries remain intact.
 */
export function writeXlsxCellXml(xml: string, address: string, answer: string): string {
	const row = rowNumber(address);
	const rowPattern = new RegExp(
		`(<row\\b[^>]*\\br=(?:"${row}"|'${row}')[^>]*>)([\\s\\S]*?)(</row>)`,
		'i'
	);
	const rowMatch = xml.match(rowPattern);
	if (!rowMatch) throw new Error(`Could not find row ${row} in the original workbook.`);

	const cellPattern = new RegExp(
		`<c\\b[^>]*\\br=(?:"${escapeRegExp(address)}"|'${escapeRegExp(address)}')[^>]*(?:\\/>|>[\\s\\S]*?</c>)`,
		'i'
	);
	const existingCell = rowMatch[2].match(cellPattern)?.[0];
	const updatedCell = inlineStringCell(address, answer, existingCell);
	const updatedContent = existingCell
		? rowMatch[2].replace(cellPattern, updatedCell)
		: `${rowMatch[2]}${updatedCell}`;

	return xml.replace(rowPattern, `${rowMatch[1]}${updatedContent}${rowMatch[3]}`);
}

async function sheetPaths(zip: JSZip): Promise<Map<string, string>> {
	const workbookXml = await zip.file('xl/workbook.xml')?.async('string');
	const relsXml = await zip.file('xl/_rels/workbook.xml.rels')?.async('string');
	if (!workbookXml || !relsXml)
		throw new Error('The uploaded workbook is missing required XLSX parts.');

	const relationshipTargets = new Map<string, string>();
	for (const match of relsXml.matchAll(
		/<Relationship\b[^>]*\bId="([^"]+)"[^>]*\bTarget="([^"]+)"[^>]*\/?/gi
	)) {
		relationshipTargets.set(match[1], `xl/${match[2].replace(/^\//, '')}`.replace('xl/xl/', 'xl/'));
	}

	const paths = new Map<string, string>();
	for (const match of workbookXml.matchAll(
		/<sheet\b[^>]*\bname="([^"]+)"[^>]*\br:id="([^"]+)"[^>]*\/?/gi
	)) {
		const target = relationshipTargets.get(match[2]);
		if (target) paths.set(match[1], target);
	}
	return paths;
}

/** Preserves the original workbook and writes only identified response cells. */
export async function writeAnswersToXlsx(
	original: Buffer,
	answers: ReturnAnswer[]
): Promise<Buffer> {
	const zip = await JSZip.loadAsync(original, { createFolders: false });
	const pathsBySheet = await sheetPaths(zip);
	const answersBySheet = new Map<string, ReturnAnswer[]>();
	for (const answer of answers) {
		if (!answer.sourceLocation.answerCell) continue;
		const list = answersBySheet.get(answer.sourceLocation.sheetName) ?? [];
		list.push(answer);
		answersBySheet.set(answer.sourceLocation.sheetName, list);
	}

	for (const [sheetName, sheetAnswers] of answersBySheet) {
		const path = pathsBySheet.get(sheetName);
		if (!path) throw new Error(`Could not find worksheet “${sheetName}” in the original workbook.`);
		const file = zip.file(path);
		if (!file)
			throw new Error(`Could not read worksheet “${sheetName}” from the original workbook.`);
		let xml = await file.async('string');
		for (const item of sheetAnswers) {
			xml = writeXlsxCellXml(xml, item.sourceLocation.answerCell!, item.answer);
		}
		zip.file(path, xml);
	}

	return Buffer.from(await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
}

/** CSV has no formatting to preserve; retain its table shape and response column. */
export function writeAnswersToCsv(original: Buffer, answers: ReturnAnswer[]): Buffer {
	const workbook = XLSX.read(original, { type: 'buffer', raw: true });
	for (const item of answers) {
		const sheet = workbook.Sheets[item.sourceLocation.sheetName];
		const cell = item.sourceLocation.answerCell;
		if (!sheet || !cell) continue;
		sheet[cell] = { t: 's', v: item.answer };
	}
	return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'csv', bookSST: false }));
}
