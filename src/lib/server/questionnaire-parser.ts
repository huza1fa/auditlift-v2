import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { getDocumentProxy, extractText } from 'unpdf';

export interface ParsedQuestion {
	sectionName: string | null;
	questionNumber: string | null;
	questionText: string;
	order: number;
}

const MAX_QUESTIONS = 200;

function normalizeText(text: string): string {
	return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function detectQuestionNumber(line: string): { number: string; text: string } | null {
	// Matches: "1. ...", "1) ...", "1: ...", "Q1. ...", "Q1) ..."
	const match = line.match(/^([Qq]?\d+[.):\s])\s*(.+)/);
	if (!match) return null;
	return { number: match[1].trim(), text: match[2].trim() };
}

function looksLikeSectionHeader(line: string): boolean {
	// Short lines in ALL CAPS or starting with Roman numerals, or starting with a letter-dot pattern
	if (line.length > 80) return false;
	if (/^[IVXLCDM]+\.?\s+\w/.test(line)) return true; // Roman numerals
	if (/^[A-Z][A-Z\s]{4,}$/.test(line)) return true; // ALL CAPS
	if (/^Section\s+\d+/i.test(line)) return true;
	if (/^Part\s+\d+/i.test(line)) return true;
	if (/^[A-Z]\.\s+\w/.test(line)) return true; // "A. Section Name"
	return false;
}

function parseTextLines(rawText: string): ParsedQuestion[] {
	const lines = normalizeText(rawText).split('\n');
	const questions: ParsedQuestion[] = [];
	let currentSection: string | null = null;
	let order = 0;

	for (const raw of lines) {
		const line = raw.trim();
		if (!line) continue;

		// Check if this looks like a section header (skip it as a question, capture as section)
		if (looksLikeSectionHeader(line) && line.length < 80) {
			currentSection = line;
			continue;
		}

		// Must be at least 20 chars to be a meaningful question
		if (line.length < 20) continue;

		const numbered = detectQuestionNumber(line);
		if (numbered) {
			questions.push({
				sectionName: currentSection,
				questionNumber: numbered.number,
				questionText: numbered.text,
				order: order++
			});
		} else {
			// Heuristic: ends with '?' or is a statement long enough to be a question
			if (line.endsWith('?') || line.length >= 40) {
				questions.push({
					sectionName: currentSection,
					questionNumber: null,
					questionText: line,
					order: order++
				});
			}
		}

		if (questions.length >= MAX_QUESTIONS) break;
	}

	return questions;
}

async function parseXlsxOrCsv(buffer: Buffer): Promise<ParsedQuestion[]> {
	const workbook = XLSX.read(buffer, { type: 'buffer' });
	const sheetName = workbook.SheetNames[0];
	if (!sheetName) return [];

	const sheet = workbook.Sheets[sheetName];
	// Convert to array-of-arrays (raw values)
	const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: '' });

	const questions: ParsedQuestion[] = [];
	let currentSection: string | null = null;
	let order = 0;

	for (const row of rows) {
		if (!Array.isArray(row)) continue;

		const col0 = String(row[0] ?? '').trim();
		const col1 = row[1] !== undefined ? String(row[1]).trim() : null;

		if (!col0) continue;

		// If col1 exists, treat col1 as section and col0 as question text (or vice versa)
		// Convention: col0 = question text, col1 = section name (if provided)
		const questionText = col0;
		const sectionHint = col1 && col1.length > 0 ? col1 : null;

		if (sectionHint) {
			currentSection = sectionHint;
		}

		if (questionText.length < 20) continue;

		const numbered = detectQuestionNumber(questionText);
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
				questionText,
				order: order++
			});
		}

		if (questions.length >= MAX_QUESTIONS) break;
	}

	return questions;
}

async function parseDocx(buffer: Buffer): Promise<ParsedQuestion[]> {
	const result = await mammoth.extractRawText({ buffer });
	return parseTextLines(result.value);
}

async function parsePdf(buffer: Buffer): Promise<ParsedQuestion[]> {
	const pdf = await getDocumentProxy(new Uint8Array(buffer));
	const { text } = await extractText(pdf, { mergePages: true });
	return parseTextLines(text);
}

export async function parseQuestionnaire(
	buffer: Buffer,
	format: 'xlsx' | 'csv' | 'pdf' | 'docx'
): Promise<ParsedQuestion[]> {
	switch (format) {
		case 'xlsx':
		case 'csv':
			return parseXlsxOrCsv(buffer);
		case 'docx':
			return parseDocx(buffer);
		case 'pdf':
			return parsePdf(buffer);
		default:
			throw new Error(`Unsupported format: ${format}`);
	}
}
