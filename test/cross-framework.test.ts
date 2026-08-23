import { describe, expect, it } from 'vitest';
import {
	translateSoc2Codes,
	normalizeFrameworkSlug,
	CONTROL_DOMAINS
} from '../src/lib/server/cross-framework';

describe('translateSoc2Codes', () => {
	it('maps access control codes to ISO 27001 equivalents', () => {
		const iso = translateSoc2Codes(['CC6.1', 'CC6.2', 'CC6.3'], 'iso27001');
		expect(iso).toContain('5.15');
		expect(iso).toContain('5.16');
		expect(iso).toContain('8.5');
	});

	it('maps incident response codes to PCI requirements', () => {
		const pci = translateSoc2Codes(['CC7.3', 'CC7.4'], 'pci');
		expect(pci).toContain('Req 12.10');
	});

	it('deduplicates codes reached through multiple domains', () => {
		const iso = translateSoc2Codes(['CC6.1', 'CC6.7'], 'iso27001');
		expect(new Set(iso).size).toBe(iso.length);
		expect(iso).toContain('8.24');
	});

	it('returns an empty array for unknown codes and empty input', () => {
		expect(translateSoc2Codes(['XX9.9'], 'iso27001')).toEqual([]);
		expect(translateSoc2Codes([], 'pci')).toEqual([]);
	});
});

describe('normalizeFrameworkSlug', () => {
	it('accepts canonical slugs and rejects everything else', () => {
		expect(normalizeFrameworkSlug('soc2')).toBe('soc2');
		expect(normalizeFrameworkSlug('iso27001')).toBe('iso27001');
		expect(normalizeFrameworkSlug('pci')).toBe('pci');
		expect(normalizeFrameworkSlug('SOC 2')).toBeNull();
		expect(normalizeFrameworkSlug('gdpr')).toBeNull();
	});
});

describe('CONTROL_DOMAINS integrity', () => {
	it('every domain defines all three frameworks', () => {
		for (const domain of CONTROL_DOMAINS) {
			expect(domain.soc2.length).toBeGreaterThan(0);
			expect(domain.iso27001.length).toBeGreaterThan(0);
			expect(domain.pci.length).toBeGreaterThan(0);
		}
	});
});
