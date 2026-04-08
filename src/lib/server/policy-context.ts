/**
 * Rich company context for AI policy generation.
 * Assembled from onboarding data stored on the organizations table.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RichPolicyContext {
	companyName: string;
	industry: string;
	productType: string | null;
	teamSize: string;
	stack: string;
	framework: string;
	dataTypes: string[]; // 'pii' | 'phi' | 'financial' | 'business'
	customerType: string | null; // 'b2b' | 'b2c' | 'enterprise' | 'internal'
	geoReach: string | null; // 'us' | 'eu' | 'global'
	securityTools: string[]; // 'sso' | 'mdm' | 'password_manager' | 'ci_cd' | 'code_review'
}

// ─── Label maps ───────────────────────────────────────────────────────────────

const PRODUCT_TYPE_LABELS: Record<string, string> = {
	saas: 'B2B/B2C SaaS web application',
	api: 'API / developer platform',
	mobile: 'Mobile application',
	internal: 'Internal tooling'
};

const CUSTOMER_TYPE_LABELS: Record<string, string> = {
	b2b: 'business customers (B2B)',
	b2c: 'consumers (B2C)',
	enterprise: 'enterprise and government customers',
	internal: 'internal users only'
};

// ─── System prompt builder ────────────────────────────────────────────────────

export function buildSystemPrompt(ctx: RichPolicyContext): string {
	const parts: string[] = [];

	// Identity
	parts.push(
		`You are a compliance expert writing production-ready, auditor-grade security policy documents for ${ctx.companyName}.`,
		'',
		'Output a complete, formal policy document in valid Markdown. Do not include any commentary, preamble, or text outside the policy document itself.',
		''
	);

	// Company profile
	parts.push('## Company Profile');
	parts.push(`- **Name:** ${ctx.companyName}`);
	parts.push(`- **Industry:** ${ctx.industry}`);
	if (ctx.productType) {
		parts.push(`- **Product type:** ${PRODUCT_TYPE_LABELS[ctx.productType] ?? ctx.productType}`);
	}
	parts.push(`- **Team size:** ${ctx.teamSize}`);
	parts.push(`- **Tech stack:** ${ctx.stack}`);
	parts.push(`- **Target compliance framework:** ${ctx.framework}`);
	parts.push('');

	// Data & privacy context
	parts.push('## Data & Privacy Context');
	const hasNoSensitiveData =
		ctx.dataTypes.length === 0 ||
		(ctx.dataTypes.length === 1 && ctx.dataTypes.includes('business'));

	if (hasNoSensitiveData) {
		parts.push(
			`${ctx.companyName} processes business/operational data only. No personal, health, or financial data of end users is handled. Data-related policies should reflect a lower-risk data posture.`
		);
	} else {
		parts.push(`${ctx.companyName} processes the following categories of sensitive data:`);

		if (ctx.dataTypes.includes('pii')) {
			parts.push('- **Personal data (PII)** of end users or employees');
			if (ctx.geoReach === 'eu' || ctx.geoReach === 'global') {
				parts.push(
					'  → **GDPR applies:** Policies must include lawful basis for processing, data subject rights (access, erasure, rectification, portability), 72-hour breach notification to the supervisory authority, and standard contractual clauses for international data transfers.'
				);
			}
			if (ctx.customerType === 'b2c') {
				parts.push(
					'  → **Consumer product:** CCPA/privacy obligations may apply. Privacy notices must be clear, accessible, and prominent.'
				);
			}
		}

		if (ctx.dataTypes.includes('phi')) {
			parts.push('- **Protected health data (PHI)**');
			parts.push(
				'  → **HIPAA applies:** Business Associate Agreements (BAAs) required with all vendors that access PHI. Breach notification within 60 days to affected individuals and HHS. Minimum necessary access principle must be enforced. All PHI access must be logged and auditable.'
			);
		}

		if (ctx.dataTypes.includes('financial')) {
			parts.push('- **Financial/payment data**');
			parts.push(
				'  → **PCI-DSS alignment recommended.** Financial records must be retained for a minimum of 7 years. Segregation of duties required for financial system access. Encryption of financial data at rest and in transit is mandatory.'
			);
		}
	}
	parts.push('');

	// Customer context
	parts.push('## Customer Context');
	const customerDesc = CUSTOMER_TYPE_LABELS[ctx.customerType ?? ''] ?? 'business customers';
	parts.push(`${ctx.companyName} serves ${customerDesc}.`);

	if (ctx.customerType === 'enterprise') {
		parts.push(
			'→ Enterprise and government customers conduct formal vendor security assessments. They will request SOC 2 reports, penetration test summaries, and security addenda. All policies must include audit rights clauses and support external security review processes.'
		);
	} else if (ctx.customerType === 'b2c') {
		parts.push(
			'→ Consumer-facing product. Privacy and data handling policies must use plain, accessible language where applicable. Terms must be easy to understand by non-technical users.'
		);
	} else if (ctx.customerType === 'b2b') {
		parts.push(
			'→ B2B customers review security posture during procurement. Policies should be written to be shareable with customer security and legal teams without redaction.'
		);
	}
	parts.push('');

	// Security posture
	parts.push('## Existing Security Posture');
	if (ctx.securityTools.length === 0) {
		parts.push(
			`${ctx.companyName} has no formal security tooling in place yet. Policies should provide prescriptive, step-by-step guidance on implementing foundational controls. Include realistic implementation notes where appropriate.`
		);
	} else {
		parts.push(`The following tools and practices are already in place at ${ctx.companyName}:`);

		if (ctx.securityTools.includes('sso')) {
			parts.push(
				'- **SSO/Identity provider in use** — Reference SSO as the mandatory authentication mechanism throughout. Policies should require all systems to integrate with SSO and prohibit direct credential-based access where SSO is available.'
			);
		}
		if (ctx.securityTools.includes('mdm')) {
			parts.push(
				'- **MDM (Mobile Device Management) in use** — Remote work, acceptable use, and device policies should reference MDM enrollment as a requirement for accessing company systems from any device.'
			);
		}
		if (ctx.securityTools.includes('password_manager')) {
			parts.push(
				'- **Company password manager deployed** — Password policies should designate the password manager as the required credential storage method. Direct storage in browsers or plaintext is prohibited.'
			);
		}
		if (ctx.securityTools.includes('ci_cd')) {
			parts.push(
				'- **CI/CD pipeline in use** — Change management policies should reference automated pipeline gates, required status checks, and pipeline-enforced controls as part of the change approval process.'
			);
		}
		if (ctx.securityTools.includes('code_review')) {
			parts.push(
				'- **Code review process in place** — Change management and secure development policies should mandate peer review before merge as a compensating control for change risk.'
			);
		}
	}
	parts.push('');

	// Writing calibration
	parts.push('## Writing Calibration');
	parts.push(
		`- **Team size:** Calibrate control complexity to a ${ctx.teamSize} team. Do not prescribe controls that require dedicated security headcount unless the team size justifies it.`
	);
	parts.push(
		`- **Company name:** Use "${ctx.companyName}" throughout — never use placeholders like "[Company Name]" or "[Organization]".`
	);
	if (ctx.stack && ctx.stack !== 'various tools') {
		parts.push(
			`- **Tech stack references:** Reference the actual stack (${ctx.stack}) where relevant to the policy topic (e.g. naming the cloud provider for data residency, referencing GitHub for code review).`
		);
	}
	parts.push(
		'- **Format:** Valid Markdown only. # for document title, ## for sections, ### for subsections. Include a document header block: Title, Version (1.0), Date, Owner (Security Team), Status (Approved).'
	);
	parts.push(
		'- **Tone:** Formal, professional, specific. No vague boilerplate — every sentence should be actionable.'
	);

	return parts.join('\n');
}

// ─── Context assembler ────────────────────────────────────────────────────────

/**
 * Build a RichPolicyContext from an org record and resolved framework name.
 * All new fields default gracefully if not yet populated (existing orgs won't have them).
 */
export function buildRichContext(
	org: {
		name: string;
		industry?: string | null;
		productType?: string | null;
		teamSize?: string | null;
		stack?: string[] | string | null;
		dataTypes?: string[] | null;
		customerType?: string | null;
		geoReach?: string | null;
		securityTools?: string[] | null;
	},
	frameworkName: string
): RichPolicyContext {
	const stack = Array.isArray(org.stack)
		? org.stack.join(', ')
		: ((org.stack as string | null | undefined) ?? 'various tools');

	return {
		companyName: org.name,
		industry: org.industry ?? 'Software',
		productType: org.productType ?? null,
		teamSize: org.teamSize ?? 'n/a',
		stack,
		framework: frameworkName,
		dataTypes: Array.isArray(org.dataTypes) ? org.dataTypes : [],
		customerType: org.customerType ?? null,
		geoReach: org.geoReach ?? null,
		securityTools: Array.isArray(org.securityTools) ? org.securityTools : []
	};
}
