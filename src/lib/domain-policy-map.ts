/**
 * Maps AI-classified question domains to the most relevant standard policy type.
 * Used by gap remediation CTAs and confidence upgrade indicators.
 */
export const DOMAIN_TO_POLICY_TYPE: Record<string, string> = {
	access_control: 'access-control-policy',
	data_security: 'data-classification-policy',
	incident_response: 'incident-response-policy',
	change_management: 'change-management-policy',
	vendor_management: 'vendor-management-policy',
	business_continuity: 'business-continuity-policy',
	cryptography: 'cryptography-policy',
	physical_security: 'physical-security-policy',
	vulnerability_management: 'vulnerability-management-policy',
	privacy: 'privacy-policy',
	remote_work: 'remote-work-policy',
	ai_usage: 'ai-usage-policy',
	data_retention: 'data-retention-policy',
	general: 'security-policy',
	other: 'security-policy'
};

/** Client-safe policy type → human-readable title */
export const POLICY_TYPE_TITLES: Record<string, string> = {
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
	'physical-security-policy': 'Physical Security Policy'
};

export function getSuggestedPolicyType(domain: string | null): string | null {
	if (!domain) return null;
	return DOMAIN_TO_POLICY_TYPE[domain] ?? null;
}

export function getPolicyTitle(type: string): string {
	return POLICY_TYPE_TITLES[type] ?? type;
}
