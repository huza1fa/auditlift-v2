import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const MARGIN = 60;
const LINE_HEIGHT = 14;
const PARAGRAPH_SPACING = 10;
const SECTION_SPACING = 16;
const TITLE_SIZE = 20;
const HEADING_SIZE = 13;
const BODY_SIZE = 10;
const SMALL_SIZE = 8;
const PAGE_W = 612;
const PAGE_H = 792;
const CONTENT_W = PAGE_W - MARGIN * 2;

type PdfFont = Awaited<ReturnType<PDFDocument['embedFont']>>;

interface RenderCtx {
	pdfDoc: PDFDocument;
	page: PDFPage;
	font: PdfFont;
	boldFont: PdfFont;
	y: number;
}

function wrapText(text: string, font: PdfFont, maxWidth: number, fontSize: number): string[] {
	const lines: string[] = [];
	const paragraphs = text.split('\n');

	for (const paragraph of paragraphs) {
		if (paragraph.trim() === '') {
			lines.push('');
			continue;
		}

		const words = paragraph.split(' ');
		let currentLine = '';

		for (const word of words) {
			const testLine = currentLine ? `${currentLine} ${word}` : word;
			const testWidth = font.widthOfTextAtSize(testLine, fontSize);

			if (testWidth > maxWidth && currentLine) {
				lines.push(currentLine);
				currentLine = word;
			} else {
				currentLine = testLine;
			}
		}

		if (currentLine) {
			lines.push(currentLine);
		}
	}

	return lines;
}

function stripMarkdown(text: string): string {
	return text
		.replace(/\*\*(.+?)\*\*/g, '$1')
		.replace(/\*(.+?)\*/g, '$1')
		.replace(/`(.+?)`/g, '$1')
		.replace(/\[(.+?)\]\(.+?\)/g, '$1');
}

function parseMarkdownToBlocks(
	content: string
): Array<{ type: 'title' | 'heading' | 'body'; text: string }> {
	const lines = content.split('\n');
	const blocks: Array<{ type: 'title' | 'heading' | 'body'; text: string }> = [];
	let currentBody: string[] = [];

	function flushBody() {
		const text = currentBody.join('\n').trim();
		if (text) {
			blocks.push({ type: 'body', text });
		}
		currentBody = [];
	}

	for (const line of lines) {
		const trimmed = line.trim();

		if (trimmed.startsWith('# ')) {
			flushBody();
			blocks.push({ type: 'title', text: stripMarkdown(trimmed.replace(/^#\s+/, '')) });
		} else if (trimmed.startsWith('## ')) {
			flushBody();
			blocks.push({ type: 'heading', text: stripMarkdown(trimmed.replace(/^##\s+/, '')) });
		} else if (trimmed.startsWith('### ')) {
			flushBody();
			blocks.push({ type: 'heading', text: stripMarkdown(trimmed.replace(/^###\s+/, '')) });
		} else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
			currentBody.push(`  \u2022 ${stripMarkdown(trimmed.replace(/^[-*]\s+/, ''))}`);
		} else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
			currentBody.push(`  \u2022 ${stripMarkdown(trimmed)}`);
		} else {
			currentBody.push(stripMarkdown(trimmed));
		}
	}

	flushBody();
	return blocks;
}

function addNewPage(ctx: RenderCtx): PDFPage {
	const newPage = ctx.pdfDoc.addPage([PAGE_W, PAGE_H]);
	ctx.page = newPage;
	ctx.y = PAGE_H - MARGIN;
	return newPage;
}

function drawTextLines(ctx: RenderCtx, text: string, fontSize: number, isBold: boolean) {
	const font = isBold ? ctx.boldFont : ctx.font;
	const color = rgb(0.15, 0.15, 0.15);
	const wrappedLines = wrapText(text, font, CONTENT_W, fontSize);

	for (const line of wrappedLines) {
		if (ctx.y - LINE_HEIGHT < MARGIN) {
			addNewPage(ctx);
		}
		ctx.page.drawText(line, {
			x: MARGIN,
			y: ctx.y,
			size: fontSize,
			font,
			color
		});
		ctx.y -= LINE_HEIGHT;
	}
}

import { PDFPage } from 'pdf-lib';

export async function generatePolicyPdf(
	title: string,
	content: string,
	companyName: string
): Promise<Uint8Array> {
	const pdfDoc = await PDFDocument.create();
	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

	const firstPage = pdfDoc.addPage([PAGE_W, PAGE_H]);
	const ctx: RenderCtx = {
		pdfDoc,
		page: firstPage,
		font,
		boldFont,
		y: PAGE_H - MARGIN
	};

	// Title
	drawTextLines(ctx, title, TITLE_SIZE, true);
	ctx.y -= PARAGRAPH_SPACING;

	// Meta line
	const metaText = `${companyName} \u2022 Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
	drawTextLines(ctx, metaText, SMALL_SIZE, false);
	ctx.y -= SECTION_SPACING;

	// Horizontal rule
	const { width } = ctx.page.getSize();
	ctx.page.drawLine({
		start: { x: MARGIN, y: ctx.y },
		end: { x: width - MARGIN, y: ctx.y },
		thickness: 1,
		color: rgb(0.85, 0.85, 0.85)
	});
	ctx.y -= SECTION_SPACING;

	// Content blocks
	const blocks = parseMarkdownToBlocks(content);

	for (const block of blocks) {
		if (block.type === 'heading') {
			ctx.y -= PARAGRAPH_SPACING;
			if (ctx.y - LINE_HEIGHT < MARGIN) {
				addNewPage(ctx);
			}
			drawTextLines(ctx, block.text, HEADING_SIZE, true);
			ctx.y -= PARAGRAPH_SPACING;
		} else if (block.type === 'body') {
			const paragraphs = block.text.split('\n');
			for (const para of paragraphs) {
				if (!para.trim()) {
					ctx.y -= PARAGRAPH_SPACING / 2;
					continue;
				}
				if (ctx.y - LINE_HEIGHT < MARGIN) {
					addNewPage(ctx);
				}
				drawTextLines(ctx, para, BODY_SIZE, false);
				ctx.y -= PARAGRAPH_SPACING / 2;
			}
			ctx.y -= PARAGRAPH_SPACING / 2;
		}
	}

	// Footer on every page
	const pages = pdfDoc.getPages();
	for (let i = 0; i < pages.length; i++) {
		const pg = pages[i];
		const footerY = MARGIN - 10;
		pg.drawLine({
			start: { x: MARGIN, y: footerY + 8 },
			end: { x: width - MARGIN, y: footerY + 8 },
			thickness: 0.5,
			color: rgb(0.9, 0.9, 0.9)
		});
		pg.drawText(`${companyName} \u2014 Confidential`, {
			x: MARGIN,
			y: footerY,
			size: SMALL_SIZE,
			font,
			color: rgb(0.6, 0.6, 0.6)
		});

		const pageNum = `Page ${i + 1} of ${pages.length}`;
		const pageNumW = font.widthOfTextAtSize(pageNum, SMALL_SIZE);
		pg.drawText(pageNum, {
			x: width - MARGIN - pageNumW,
			y: footerY,
			size: SMALL_SIZE,
			font,
			color: rgb(0.6, 0.6, 0.6)
		});
	}

	return pdfDoc.save();
}
