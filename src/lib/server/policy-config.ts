export const STANDARD_POLICY_TYPES = [
	'security-policy',
	'access-control-policy',
	'incident-response-policy',
	'change-management-policy',
	'vulnerability-management-policy',
	'data-classification-policy',
	'business-continuity-policy',
	'vendor-management-policy',
	'cryptography-policy',
	'acceptable-use-policy',
	'password-policy',
	'remote-work-policy',
	'privacy-policy',
	'ai-usage-policy',
	'data-retention-policy',
	'physical-security-policy'
] as const;

export type StandardPolicyType = (typeof STANDARD_POLICY_TYPES)[number];

export const POLICY_TITLES: Record<string, string> = {
	'security-policy': 'Security Policy',
	'access-control-policy': 'Access Control Policy',
	'incident-response-policy': 'Incident Response Policy',
	'change-management-policy': 'Change Management Policy',
	'vulnerability-management-policy': 'Vulnerability Management Policy',
	'data-classification-policy': 'Data Classification Policy',
	'business-continuity-policy': 'Business Continuity Policy',
	'vendor-management-policy': 'Vendor Management Policy',
	'cryptography-policy': 'Cryptography Policy',
	'acceptable-use-policy': 'Acceptable Use Policy',
	'password-policy': 'Password Policy',
	'remote-work-policy': 'Remote Work Policy',
	'privacy-policy': 'Privacy Policy',
	'ai-usage-policy': 'AI Usage Policy',
	'data-retention-policy': 'Data Retention Policy',
	'physical-security-policy': 'Physical Security Policy',
	custom: 'Custom Policy'
};

export const POLICY_GROUPS: { label: string; types: string[] }[] = [
	{
		label: 'Security Fundamentals',
		types: ['security-policy', 'access-control-policy', 'password-policy', 'acceptable-use-policy']
	},
	{
		label: 'Operations',
		types: [
			'incident-response-policy',
			'change-management-policy',
			'vulnerability-management-policy',
			'physical-security-policy'
		]
	},
	{
		label: 'Data & Privacy',
		types: ['data-classification-policy', 'data-retention-policy', 'privacy-policy']
	},
	{
		label: 'Business Continuity',
		types: ['business-continuity-policy']
	},
	{
		label: 'Vendor & Suppliers',
		types: ['vendor-management-policy']
	},
	{
		label: 'Technology',
		types: ['cryptography-policy', 'remote-work-policy', 'ai-usage-policy']
	}
];
