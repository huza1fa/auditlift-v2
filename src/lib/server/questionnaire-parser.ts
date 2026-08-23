import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { getDocumentProxy, extractText } from 'unpdf';

export interface ParsedQuestion {
	sectionName: string | null;
	questionNumber: string | null;
	questionText: string;
	order: number;
}

export interface ParseResult {
	questions: ParsedQuestion[];
	truncated: boolean;
	totalDetected: number;
	warnings: string[];
}

export class ScannedPdfError extends Error {
	constructor() {
		super(
			'This PDF looks scanned or image-based, so no text could be extracted. Export it as a text-based PDF/DOCX/XLSX, or paste the questions directly.'
		);
		this.name = 'ScannedPdfError';
	}
}

const MAX_QUESTIONS = 500;

const QUESTION_HEADERS = [
	'question',
	'questions',
	'prompt',
	'item',
	'requirement',
	'assessment question',
	'control question',
	'question text',
	'description'
];

const SECTION_HEADERS = [
	'section',
	'category',
	'domain',
	'topic',
	'area',
	'group',
	'control area',
	'control domain',
	'subdomain'
];

const ANSWER_HEADERS = ['answer', 'response', 'response text', 'vendor response', 'comments'];

function normalizeText(text: string): string {
	return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function decodeEntities(text: string): string {
	return text
		.replace(/&nbsp;/gi, ' ')
		.replace(/&amp;/gi, '&')
		.replace(/&lt;/gi, '<')
		.replace(/&gt;/gi, '>')
		.replace(/&quot;/gi, '"')
		.replace(/&#39;/gi, "'");
}

function stripHtml(html: string): string {
	return decodeEntities(html.replace(/<[^>]*>/g, ''))
		.replace(/\s+/g, ' ')
		.trim();
}

function detectQuestionNumber(line: string): { number: string; text: string } | null {
	const match = line.match(/^([Qq]\d{1,3}[.)]?|[Qq]?\d{1,3}[.):])\s*(\S.*)/);
	if (!match) return null;
	return { number: match[1].trim(), text: match[2].trim() };
}

function looksLikeSectionHeader(line: string): boolean {
	if (line.length > 80 || line.length < 3) return false;
	if (/^[IVXLCDM]+\.\s+\w/.test(line)) return true;
	if (/^[A-Z][A-Z\s&/-]{4,}$/.test(line)) return true;
	if (/^(Section|Part|Appendix)\s+[A-Z0-9]/i.test(line)) return true;
	if (/^[A-Z]\.\s+\w/.test(line)) return true;
	const headingWords =
		/introduction|overview|background|scope|instructions?|applicant information|company (information|profile)|vendor information|about (you|your organization)|notes|references|document control|revision history|purpose|definitions|glossary|general information|contact information|submission guidelines/i;
	if (headingWords.test(line) && line.split(/\s+/).length <= 8 && !/\?\s*$/.test(line)) return true;
	return false;
}

function finalize(questions: ParsedQuestion[], totalDetected: number): ParseResult {
	return {
		questions,
		truncated: totalDetected > questions.length,
		totalDetected,
		warnings: []
	};
}

function parseTextLines(rawText: string): ParseResult {
	const lines = normalizeText(rawText).split('\n');
	const questions: ParsedQuestion[] = [];
	let currentSection: string | null = null;
	let order = 0;
	let totalDetected = 0;

	for (const raw of lines) {
		const line = raw.trim();
		if (!line) continue;

		if (looksLikeSectionHeader(line)) {
			currentSection = line;
			continue;
		}

		if (line.length < 20) continue;

		const numbered = detectQuestionNumber(line);
		const isQuestion = Boolean(numbered) || line.endsWith('?') || line.length >= 40;
		if (!isQuestion) continue;

		totalDetected++;
		if (questions.length < MAX_QUESTIONS) {
			if (numbered) {
				questions.push({
					sectionName: currentSection,
					questionNumber: numbered.number,
					questionText: numbered.text,
					order: order++
				});
			} else {
				questions.push({
					sectionName: currentSection,
					questionNumber: null,
					questionText: line,
					order: order++
				});
			}
		}
	}

	return finalize(questions, totalDetected);
}

function fillMergedCells(sheet: XLSX.WorkSheet) {
	const merges = sheet['!merges'] as XLSX.Range[] | undefined;
	if (!merges) return;
	for (const merge of merges) {
		const topLeft = XLSX.utils.encode_cell({ r: merge.s.r, c: merge.s.c });
		const value = sheet[topLeft]?.v;
		if (value === undefined || value === null || String(value).trim() === '') continue;
		for (let r = merge.s.r; r <= merge.e.r; r++) {
			for (let c = merge.s.c; c <= merge.e.c; c++) {
				const addr = XLSX.utils.encode_cell({ r, c });
				const existing = sheet[addr];
				if (
					!existing ||
					existing.v === undefined ||
					existing.v === null ||
					String(existing.v).trim() === ''
				) {
					sheet[addr] = { t: typeof value === 'number' ? 'n' : 's', v: value } as XLSX.CellObject;
				}
			}
		}
	}
}

function cellText(row: unknown[], col: number): string {
	const value = row[col];
	if (value === undefined || value === null) return '';
	return String(value).replace(/\s+/g, ' ').trim();
}

function matchesAny(value: string, candidates: string[]): boolean {
	const normalized = value.toLowerCase().replace(/[:*]/g, '').trim();
	return candidates.some((h) => normalized === h);
}

function isNumericColumn(values: string[]): boolean {
	const nonEmpty = values.filter((v) => v.length > 0);
	if (nonEmpty.length === 0) return false;
	return nonEmpty.filter((v) => /^\d+(\.\d+)?$/.test(v)).length / nonEmpty.length > 0.7;
}

interface ColumnMap {
	questionCol: number;
	sectionCol: number | null;
	headerRowIndex: number | null;
}

function detectGridColumns(rows: string[][]): ColumnMap | null {
	const width = Math.max(...rows.map((r) => r.length), 0);
	if (width === 0) return null;

	for (let i = 0; i < Math.min(rows.length, 5); i++) {
		const row = rows[i].map((c) => c.toLowerCase().trim());
		const questionCol = row.findIndex((c) => matchesAny(c, QUESTION_HEADERS));
		if (questionCol !== -1) {
			const sectionCol = row.findIndex((c) => matchesAny(c, SECTION_HEADERS));
			return { questionCol, sectionCol: sectionCol !== -1 ? sectionCol : null, headerRowIndex: i };
		}
	}

	const maxCols = Math.min(width, 12);
	const stats: { avgLen: number; values: string[]; distinct: Set<string> }[] = [];
	for (let c = 0; c < maxCols; c++) {
		const values = rows.map((r) => cellText(r, c)).filter((v) => v.length > 0);
		const avgLen = values.length ? values.reduce((sum, v) => sum + v.length, 0) / values.length : 0;
		stats.push({ avgLen, values, distinct: new Set(values.map((v) => v.toLowerCase())) });
	}

	let questionCol = -1;
	let bestAvg = 0;
	for (let c = 0; c < maxCols; c++) {
		if (isNumericColumn(stats[c].values)) continue;
		if (stats[c].avgLen >= 25 && stats[c].avgLen > bestAvg) {
			bestAvg = stats[c].avgLen;
			questionCol = c;
		}
	}
	if (questionCol === -1) return null;

	let sectionCol: number | null = null;
	let bestDistinct = 0;
	for (let c = 0; c < maxCols; c++) {
		if (c === questionCol) continue;
		const s = stats[c];
		if (s.avgLen === 0 || s.avgLen > 45 || isNumericColumn(s.values)) continue;
		if (matchesAny(rows.find((r) => cellText(r, c))?.[c] ?? '', ANSWER_HEADERS)) continue;
		if (s.distinct.size >= bestDistinct && s.distinct.size < rows.length * 0.9) {
			bestDistinct = s.distinct.size;
			sectionCol = c;
		}
	}

	return { questionCol, sectionCol, headerRowIndex: null };
}

function parseGridRows(rows: string[][], warnings: string[]): ParsedQuestion[] {
	const columns = detectGridColumns(rows);
	if (!columns) return [];

	const questions: ParsedQuestion[] = [];
	let currentSection: string | null = null;
	let order = 0;

	const dataStart = columns.headerRowIndex !== null ? columns.headerRowIndex + 1 : 0;

	for (let i = dataStart; i < rows.length; i++) {
		const row = rows[i];
		const questionText = cellText(row, columns.questionCol);

		const nonEmpty = row.filter((c) => c.length > 0);
		if (nonEmpty.length === 1 && looksLikeSectionHeader(nonEmpty[0])) {
			currentSection = nonEmpty[0];
			continue;
		}

		if (!questionText) continue;
		if (columns.headerRowIndex === null && matchesAny(questionText, QUESTION_HEADERS)) continue;

		if (columns.sectionCol !== null) {
			const sectionHint = cellText(row, columns.sectionCol);
			if (sectionHint) currentSection = sectionHint;
		} else if (columns.questionCol > 0) {
			const leading = cellText(row, columns.questionCol - 1);
			if (leading && leading !== questionText && !detectQuestionNumber(questionText)) {
				currentSection = leading;
			}
		}

		const numbered = detectQuestionNumber(questionText);
		questions.push({
			sectionName: currentSection,
			questionNumber: numbered ? numbered.number : null,
			questionText: numbered ? numbered.text : questionText,
			order: order++
		});

		if (questions.length >= MAX_QUESTIONS) {
			warnings.push('Some questions were skipped because the document exceeded the limit.');
			break;
		}
	}

	return questions;
}

function collectSheets(workbook: XLSX.WorkBook, warnings: string[]): ParsedQuestion[] {
	const perSheet: { name: string; questions: ParsedQuestion[] }[] = [];

	for (const name of workbook.SheetNames) {
		const sheet = workbook.Sheets[name];
		if (!sheet) continue;
		fillMergedCells(sheet);
		const gridRows = (
			XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', blankrows: false }) as unknown[][]
		).map((row) => row.map((_, c) => cellText(row, c)));
		const questions = parseGridRows(gridRows, warnings);
		if (questions.length > 0) perSheet.push({ name, questions });
	}

	if (perSheet.length === 0) return [];
	if (perSheet.length === 1) return perSheet[0].questions;

	warnings.push(`Questions were found on ${perSheet.length} sheets.`);
	return perSheet.flatMap(({ name, questions }) =>
		questions.map((q) => ({
			...q,
			sectionName: q.sectionName ? `${name} — ${q.sectionName}` : name
		}))
	);
}

function parseXlsxOrCsv(buffer: Buffer): ParseResult {
	const warnings: string[] = [];
	let workbook: XLSX.WorkBook;
	try {
		workbook = XLSX.read(buffer, { type: 'buffer' });
	} catch {
		throw new Error('Could not read spreadsheet file');
	}

	const questions = collectSheets(workbook, warnings);
	if (questions.length === 0) {
		const lines = workbook.SheetNames.map((name) => {
			const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[name]);
			return parseTextLines(csv);
		});
		const merged = lines.reduce<ParseResult>(
			(acc, result) => ({
				questions: [...acc.questions, ...result.questions],
				truncated: acc.truncated || result.truncated,
				totalDetected: acc.totalDetected + result.totalDetected,
				warnings: [...acc.warnings, ...result.warnings]
			}),
			{ questions: [], truncated: false, totalDetected: 0, warnings: [] }
		);
		merged.questions = merged.questions.slice(0, MAX_QUESTIONS).map((q, i) => ({ ...q, order: i }));
		merged.truncated = merged.truncated || merged.totalDetected > MAX_QUESTIONS;
		merged.warnings.push(...warnings);
		return merged;
	}

	const capped = questions.slice(0, MAX_QUESTIONS).map((q, i) => ({ ...q, order: i }));
	return {
		questions: capped,
		truncated: questions.length > MAX_QUESTIONS,
		totalDetected: questions.length,
		warnings
	};
}

interface HtmlTableRow {
	cells: string[];
}

function extractHtmlTables(html: string): HtmlTableRow[][] {
	const tables: HtmlTableRow[][] = [];
	const tableMatches = html.matchAll(/<table[\s\S]*?<\/table>/gi);
	for (const tableMatch of tableMatches) {
		const rows: HtmlTableRow[] = [];
		const rowMatches = tableMatch[0].matchAll(/<tr[\s\S]*?<\/tr>/gi);
		for (const rowMatch of rowMatches) {
			const cells: string[] = [];
			const cellMatches = rowMatch[0].matchAll(/<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi);
			for (const cellMatch of cellMatches) {
				cells.push(stripHtml(cellMatch[1]));
			}
			if (cells.length > 0) rows.push({ cells });
		}
		if (rows.length > 0) tables.push(rows);
	}
	return tables;
}

export function parseDocxTables(html: string, warnings: string[]): ParsedQuestion[] {
	const tables = extractHtmlTables(html);
	if (tables.length === 0) return [];

	const allRows = tables.flat();
	const questions: ParsedQuestion[] = [];
	let currentSection: string | null = null;
	let order = 0;

	for (const row of allRows) {
		const meaningful = row.cells.filter((c) => c.length > 0);
		if (meaningful.length === 1 && looksLikeSectionHeader(meaningful[0])) {
			currentSection = meaningful[0];
			continue;
		}

		if (row.cells.length >= 2) {
			const questionText = meaningful.reduce((a, b) => (b.length > a.length ? b : a), '');
			if (questionText.length < 20) continue;
			if (row.cells.some((c) => matchesAny(c, QUESTION_HEADERS))) continue;

			const others = meaningful.filter((c) => c !== questionText);
			const sectionCandidate = others.find((c) => c.length <= 60 && !c.endsWith('?'));
			if (sectionCandidate && looksLikeSectionHeader(sectionCandidate))
				currentSection = sectionCandidate;

			const numbered = detectQuestionNumber(questionText);
			questions.push({
				sectionName: currentSection,
				questionNumber: numbered ? numbered.number : null,
				questionText: numbered ? numbered.text : questionText,
				order: order++
			});
		}

		if (questions.length >= MAX_QUESTIONS) {
			warnings.push('Some questions were skipped because the document exceeded the limit.');
			break;
		}
	}

	return questions;
}

async function parseDocx(buffer: Buffer, warnings: string[]): Promise<ParseResult> {
	const [htmlResult, rawResult] = await Promise.all([
		mammoth.convertToHtml({ buffer }).catch(() => null),
		mammoth.extractRawText({ buffer })
	]);

	if (htmlResult) {
		const tableQuestions = parseDocxTables(htmlResult.value, warnings);
		if (tableQuestions.length > 0) {
			const capped = tableQuestions.slice(0, MAX_QUESTIONS).map((q, i) => ({ ...q, order: i }));
			return {
				questions: capped,
				truncated: tableQuestions.length > MAX_QUESTIONS,
				totalDetected: tableQuestions.length,
				warnings
			};
		}
	}

	return parseTextLines(rawResult.value);
}

function preprocessPdfText(text: string): string {
	return text
		.replace(/[ \t]+/g, ' ')
		.replace(/([a-z?!,])\s+([Qq]?\d{1,3}[.)]\s+)/g, '$1\n$2')
		.replace(/(^|\n)\s*(\d{1,3}[.)]\s+)/g, '$1$2')
		.replace(/([a-z?!,]) ((?:Section|Part|Appendix)\s+\d)/gi, '$1\n$2');
}

async function parsePdf(buffer: Buffer): Promise<ParseResult> {
	const pdf = await getDocumentProxy(new Uint8Array(buffer));
	const { text } = await extractText(pdf, { mergePages: true });

	if (text.replace(/\s+/g, '').length < 100) {
		throw new ScannedPdfError();
	}

	return parseTextLines(preprocessPdfText(text));
}

export function parseRawText(rawText: string): ParseResult {
	return parseTextLines(normalizeText(rawText));
}

export async function parseQuestionnaire(
	buffer: Buffer,
	format: 'xlsx' | 'csv' | 'pdf' | 'docx'
): Promise<ParseResult> {
	switch (format) {
		case 'xlsx':
		case 'csv':
			return parseXlsxOrCsv(buffer);
		case 'docx':
			return parseDocx(buffer, []);
		case 'pdf':
			return parsePdf(buffer);
		default:
			throw new Error(`Unsupported format: ${format}`);
	}
}
