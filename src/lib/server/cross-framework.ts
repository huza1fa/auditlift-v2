/**
 * Cross-framework control domain mapping (SOC 2 ↔ ISO 27001:2022 ↔ PCI DSS v4.0.1).
 * Derived from the baked-in compliance reference; used so a single piece of
 * compliance work (policy, evidence, questionnaire answer) counts toward every
 * enrolled framework.
 */
export type FrameworkSlug = 'soc2' | 'iso27001' | 'pci';

export interface ControlDomain {
	domain: string;
	soc2: string[];
	iso27001: string[];
	pci: string[];
}

export const CONTROL_DOMAINS: ControlDomain[] = [
	{
		domain: 'Access Control',
		soc2: ['CC6.1', 'CC6.2', 'CC6.3'],
		iso27001: ['5.15', '5.16', '5.17', '5.18', '8.2', '8.3', '8.5'],
		pci: ['Req 7', 'Req 8']
	},
	{
		domain: 'Risk Assessment',
		soc2: ['CC3.1', 'CC3.2', 'CC3.3', 'CC3.4'],
		iso27001: ['5.7', '5.19', '5.21', '8.8'],
		pci: ['Req 12.3']
	},
	{
		domain: 'Incident Response',
		soc2: ['CC7.3', 'CC7.4', 'CC7.5'],
		iso27001: ['5.24', '5.25', '5.26', '5.27', '5.28'],
		pci: ['Req 12.10']
	},
	{
		domain: 'Encryption & Cryptography',
		soc2: ['CC6.1', 'CC6.7'],
		iso27001: ['8.24'],
		pci: ['Req 3.5', 'Req 4.2']
	},
	{
		domain: 'Change Management',
		soc2: ['CC8.1'],
		iso27001: ['8.32'],
		pci: ['Req 6.3', 'Req 6.5']
	},
	{
		domain: 'Logging & Monitoring',
		soc2: ['CC4.1', 'CC7.1', 'CC7.2'],
		iso27001: ['8.15', '8.16'],
		pci: ['Req 10']
	},
	{
		domain: 'Vendor / Supplier Management',
		soc2: ['CC9.2'],
		iso27001: ['5.19', '5.20', '5.21', '5.22', '5.23'],
		pci: ['Req 12.8', 'Req 12.9']
	},
	{
		domain: 'Security Awareness Training',
		soc2: ['CC1.4'],
		iso27001: ['6.3'],
		pci: ['Req 12.6']
	},
	{
		domain: 'Physical Security',
		soc2: ['CC6.4'],
		iso27001: ['7.1', '7.2', '7.3', '7.4', '7.5', '7.6'],
		pci: ['Req 9']
	},
	{
		domain: 'Vulnerability Management',
		soc2: ['CC7.1'],
		iso27001: ['8.8'],
		pci: ['Req 5', 'Req 6', 'Req 11.3']
	},
	{
		domain: 'Secure Development (SDLC)',
		soc2: ['CC8.1'],
		iso27001: ['8.25', '8.26', '8.27', '8.28', '8.29', '8.30'],
		pci: ['Req 6.2', 'Req 6.3']
	},
	{
		domain: 'Business Continuity / Availability',
		soc2: ['A1.2', 'A1.3', 'CC7.5'],
		iso27001: ['5.29', '5.30', '8.13', '8.14'],
		pci: ['Req 12.10']
	}
];

const codesBySlug: Record<FrameworkSlug, Map<string, string[]>> = {
	soc2: new Map(),
	iso27001: new Map(),
	pci: new Map()
};

for (const { domain, soc2, iso27001, pci } of CONTROL_DOMAINS) {
	for (const code of soc2) {
		const existing = codesBySlug.soc2.get(code) ?? [];
		codesBySlug.soc2.set(code, [...existing, domain]);
	}
	for (const code of iso27001) {
		const existing = codesBySlug.iso27001.get(code) ?? [];
		codesBySlug.iso27001.set(code, [...existing, domain]);
	}
	for (const code of pci) {
		const existing = codesBySlug.pci.get(code) ?? [];
		codesBySlug.pci.set(code, [...existing, domain]);
	}
}

/**
 * Translates SOC 2 control codes into the equivalent controls of the target
 * framework via shared control domains. Unknown codes return an empty array.
 */
export function translateSoc2Codes(
	soc2Codes: readonly string[],
	target: Exclude<FrameworkSlug, 'soc2'>
): string[] {
	const translated = new Set<string>();
	for (const code of soc2Codes) {
		const domains = codesBySlug.soc2.get(code);
		if (!domains) continue;
		for (const domain of domains) {
			const entry = CONTROL_DOMAINS.find((candidate) => candidate.domain === domain);
			if (!entry) continue;
			const targetCodes = target === 'iso27001' ? entry.iso27001 : entry.pci;
			for (const targetCode of targetCodes) translated.add(targetCode);
		}
	}
	return [...translated];
}

/** Normalizes framework slugs to the canonical set used by this module. */
export function normalizeFrameworkSlug(slug: string): FrameworkSlug | null {
	if (slug === 'soc2' || slug === 'iso27001' || slug === 'pci') return slug;
	return null;
}
