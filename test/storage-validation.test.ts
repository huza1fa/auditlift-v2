import { describe, expect, it } from 'vitest';
import {
	hasValidFileSignature,
	MAX_FILE_SIZE,
	sanitizeFilename,
	validateFileSize,
	validateFileType
} from '../src/lib/server/storage';

function docxPackage(files: string[]): Buffer {
	const localEntries: Buffer[] = [];
	const centralEntries: Buffer[] = [];
	let offset = 0;

	for (const file of files) {
		const filename = Buffer.from(file);
		const local = Buffer.alloc(30 + filename.length);
		local.writeUInt32LE(0x04034b50, 0);
		local.writeUInt16LE(20, 4);
		local.writeUInt16LE(filename.length, 26);
		filename.copy(local, 30);
		localEntries.push(local);

		const central = Buffer.alloc(46 + filename.length);
		central.writeUInt32LE(0x02014b50, 0);
		central.writeUInt16LE(20, 4);
		central.writeUInt16LE(20, 6);
		central.writeUInt16LE(filename.length, 28);
		central.writeUInt32LE(offset, 42);
		filename.copy(central, 46);
		centralEntries.push(central);
		offset += local.length;
	}

	const centralDirectory = Buffer.concat(centralEntries);
	const end = Buffer.alloc(22);
	end.writeUInt32LE(0x06054b50, 0);
	end.writeUInt16LE(files.length, 8);
	end.writeUInt16LE(files.length, 10);
	end.writeUInt32LE(centralDirectory.length, 12);
	end.writeUInt32LE(offset, 16);

	return Buffer.concat([...localEntries, centralDirectory, end]);
}

describe('evidence filename and content validation', () => {
	it('allows only supported file types and valid size bounds', () => {
		expect(validateFileType('application/pdf')).toBe(true);
		expect(validateFileType('image/svg+xml')).toBe(false);
		expect(validateFileSize(1)).toBe(true);
		expect(validateFileSize(MAX_FILE_SIZE)).toBe(true);
		expect(validateFileSize(0)).toBe(false);
		expect(validateFileSize(MAX_FILE_SIZE + 1)).toBe(false);
	});

	it('removes traversal, null bytes, and unsupported filename characters', () => {
		expect(sanitizeFilename('../../payment report\u0000.pdf')).toBe('payment_report_.pdf');
		expect(sanitizeFilename('..\\..\\evidence..final?.png')).toBe('evidence.final_.png');
	});

	it('checks PDF, PNG, JPEG, and CSV content signatures', () => {
		expect(hasValidFileSignature(Buffer.from('%PDF-1.7'), 'application/pdf')).toBe(true);
		expect(hasValidFileSignature(Buffer.from('not a PDF'), 'application/pdf')).toBe(false);
		expect(
			hasValidFileSignature(
				Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
				'image/png'
			)
		).toBe(true);
		expect(hasValidFileSignature(Buffer.from([0xff, 0xd8, 0xff, 0xe0]), 'image/jpeg')).toBe(true);
		expect(hasValidFileSignature(Buffer.from('name,value\nAuditLift,1\n'), 'text/csv')).toBe(true);
		expect(hasValidFileSignature(Buffer.from('name\0,value'), 'text/csv')).toBe(false);
		expect(hasValidFileSignature(Buffer.from([0xc3, 0x28]), 'text/csv')).toBe(false);
	});

	it('requires the DOCX package files rather than accepting an arbitrary ZIP', () => {
		expect(
			hasValidFileSignature(
				docxPackage(['[Content_Types].xml', 'word/document.xml']),
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
			)
		).toBe(true);
		expect(
			hasValidFileSignature(
				docxPackage(['[Content_Types].xml', 'image.png']),
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
			)
		).toBe(false);
	});
});
