import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { db } from '$lib/server/db';
import { policies, organizationFrameworks, frameworks } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import {
	STANDARD_POLICY_TYPES,
	POLICY_TITLES,
	type StandardPolicyType
} from '$lib/server/policy-config';

// ─── OpenRouter client ────────────────────────────────────────────────────────

const openrouter = createOpenAI({
	baseURL: 'https://openrouter.ai/api/v1',
	apiKey: env.OPEN_ROUTER_API_KEY ?? '',
	headers: {
		'HTTP-Referer': 'https://auditlift.io',
		'X-Title': 'AuditLift'
	}
});

// ─── Request interface ────────────────────────────────────────────────────────

interface GenerateRequest {
	policyType: string;
	controlId?: string;
	customTitle?: string;
	customPrompt?: string;
}

// ─── Per-policy-type prompt builders ─────────────────────────────────────────

type PolicyContext = {
	companyName: string;
	stack: string;
	teamSize: string;
	framework: string;
};

function buildSectionsPrompt(sections: string[]): string {
	return `Include the following sections (use ## for section headers):\n${sections.map((s) => `- ${s}`).join('\n')}`;
}

function buildBasePrompt(ctx: PolicyContext, extra: string): string {
	return `You are a compliance expert writing an auditor-ready policy document for a software company.

Company context:
- Company name: ${ctx.companyName}
- Tech stack: ${ctx.stack}
- Team size: ${ctx.teamSize}
- Compliance framework: ${ctx.framework}

${extra}

Requirements:
- Write in formal, professional language suitable for an external auditor
- Be specific and actionable — avoid generic boilerplate
- Use the company name "${ctx.companyName}" throughout the document
- Output valid Markdown only (# for title, ## for sections, ### for subsections)
- Include a document header with: Title, Version (1.0), Date (${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}), Owner (Security Team), and Status (Approved)
- Do not include any commentary outside the policy document itself`;
}

const POLICY_PROMPTS: Record<StandardPolicyType, (ctx: PolicyContext) => string> = {
	'security-policy': (ctx) =>
		buildBasePrompt(
			ctx,
			`This is the overarching Security Policy for ${ctx.companyName}.
It addresses ${ctx.framework} controls including CC1.1, CC1.2, CC2.1, CC5.1, CC6.1, CC9.1.

${buildSectionsPrompt([
	'Purpose',
	'Scope',
	'Information Security Principles',
	'Asset Classification',
	'Access Control',
	'Incident Management',
	'Risk Assessment',
	'Compliance & Enforcement'
])}`
		),

	'access-control-policy': (ctx) =>
		buildBasePrompt(
			ctx,
			`This is the Access Control Policy for ${ctx.companyName}.
It addresses ${ctx.framework} controls including CC6.1, CC6.2, CC6.3, CC6.6, CC6.7.

${buildSectionsPrompt([
	'Purpose',
	'Scope',
	'Access Control Principles',
	'User Registration & Provisioning',
	'Authentication Requirements (include MFA mandate)',
	'Privileged Access Management',
	'Access Reviews (quarterly)',
	'Remote Access',
	'Termination & Offboarding Procedures'
])}`
		),

	'incident-response-policy': (ctx) =>
		buildBasePrompt(
			ctx,
			`This is the Incident Response Policy for ${ctx.companyName}.
It addresses ${ctx.framework} controls including CC7.3, CC7.4, CC7.5.

${buildSectionsPrompt([
	'Purpose',
	'Scope',
	'Incident Classification (P1 Critical / P2 High / P3 Medium / P4 Low with examples)',
	'Response Team & Roles',
	'Detection & Reporting (include reporting channels)',
	'Containment & Eradication',
	'Recovery Procedures',
	'Post-Incident Review (include blameless retrospective)',
	'Communication Templates (internal and external)'
])}`
		),

	'change-management-policy': (ctx) =>
		buildBasePrompt(
			ctx,
			`This is the Change Management Policy for ${ctx.companyName}.
It addresses ${ctx.framework} controls including CC8.1, CC3.4.

${buildSectionsPrompt([
	'Purpose',
	'Scope',
	'Change Types (Standard / Normal / Emergency)',
	'Change Request & Approval Process',
	'Testing Requirements (including staging environments)',
	'Rollback Procedures',
	'Documentation Requirements',
	'Emergency Change Process'
])}`
		),

	'vulnerability-management-policy': (ctx) =>
		buildBasePrompt(
			ctx,
			`This is the Vulnerability Management Policy for ${ctx.companyName}.
It addresses ${ctx.framework} controls including CC7.1, CC7.2.

${buildSectionsPrompt([
	'Purpose',
	'Scope',
	'Vulnerability Scanning Schedule (automated, frequency)',
	'Severity Classification (Critical / High / Medium / Low with CVSS guidance)',
	'Remediation SLAs per severity tier',
	'Penetration Testing (annual minimum)',
	'Patch Management Process',
	'Exception Handling & Risk Acceptance'
])}`
		),

	'data-classification-policy': (ctx) =>
		buildBasePrompt(
			ctx,
			`This is the Data Classification Policy for ${ctx.companyName}.
It addresses ${ctx.framework} controls including CC6.1, CC6.5, P1.1, P2.1.

${buildSectionsPrompt([
	'Purpose',
	'Scope',
	'Classification Tiers (Public / Internal / Confidential / Restricted — with definitions and examples)',
	'Handling Requirements per Classification Tier',
	'Labeling & Marking Standards',
	'Retention & Disposal Requirements',
	'Third-Party Sharing Rules'
])}`
		),

	'business-continuity-policy': (ctx) =>
		buildBasePrompt(
			ctx,
			`This is the Business Continuity Policy for ${ctx.companyName}.
It addresses ${ctx.framework} controls including A1.2, A1.3, CC9.1.

${buildSectionsPrompt([
	'Purpose',
	'Scope',
	'RTO and RPO Objectives (define targets per system tier)',
	'Business Impact Analysis',
	'Recovery Strategies (infrastructure, data, personnel)',
	'Testing Schedule (tabletop and full DR tests)',
	'Communication Plan (internal and customer-facing)',
	'Roles & Responsibilities'
])}`
		),

	'vendor-management-policy': (ctx) =>
		buildBasePrompt(
			ctx,
			`This is the Vendor Management Policy for ${ctx.companyName}.
It addresses ${ctx.framework} controls including CC9.2.

${buildSectionsPrompt([
	'Purpose',
	'Scope',
	'Vendor Risk Tiers (Critical / High / Medium / Low)',
	'Due Diligence & Assessment Process',
	'Contractual Security Requirements (DPA, SLAs, audit rights)',
	'Ongoing Monitoring & Annual Reviews',
	'Termination Procedures & Data Return',
	'Sub-processor Management'
])}`
		),

	'cryptography-policy': (ctx) =>
		buildBasePrompt(
			ctx,
			`This is the Cryptography Policy for ${ctx.companyName}.
It addresses ${ctx.framework} controls including CC6.1, CC6.7.

${buildSectionsPrompt([
	'Purpose',
	'Scope',
	'Approved Encryption Algorithms (AES-256 for data at rest, TLS 1.2+ for transit, RSA-2048+ or ECDSA P-256+ for asymmetric)',
	'Prohibited Algorithms (MD5, SHA-1, DES, RC4, SSL 3.0, TLS 1.0/1.1)',
	'Key Management Lifecycle (generation, storage, rotation, revocation)',
	'Certificate Management (PKI, renewal schedule)',
	'Encryption Requirements by Data Classification',
	'Exception Process'
])}`
		),

	'acceptable-use-policy': (ctx) =>
		buildBasePrompt(
			ctx,
			`This is the Acceptable Use Policy for ${ctx.companyName}.
It addresses ${ctx.framework} controls including CC1.4, CC2.2.

${buildSectionsPrompt([
	'Purpose',
	'Scope',
	'Permitted Use of Company Systems & Data',
	'Prohibited Activities (detailed list)',
	'Internet & Email Usage',
	'Software Installation',
	'Monitoring & Privacy Notice',
	'Reporting Security Violations',
	'Consequences of Non-Compliance'
])}`
		),

	'password-policy': (ctx) =>
		buildBasePrompt(
			ctx,
			`This is the Password Policy for ${ctx.companyName}.
It addresses ${ctx.framework} controls including CC6.1, CC6.6.

${buildSectionsPrompt([
	'Purpose',
	'Scope',
	'Password Requirements (minimum length ≥14 chars, complexity, history ≥10)',
	'MFA Requirements (mandatory for all systems, approved second factors)',
	'Password Storage Standards (hashing algorithm requirements)',
	'Service Account & API Key Management',
	'Password Manager Usage',
	'Password Exceptions & Compensating Controls'
])}`
		),

	'remote-work-policy': (ctx) =>
		buildBasePrompt(
			ctx,
			`This is the Remote Work Policy for ${ctx.companyName}.
It addresses ${ctx.framework} controls including CC6.6, CC6.7.

${buildSectionsPrompt([
	'Purpose',
	'Scope',
	'Equipment Requirements (company-issued vs BYOD rules)',
	'Network Security (VPN requirements, home WiFi standards, public WiFi prohibition)',
	'Data Handling at Remote Sites',
	'Physical Security at Remote Locations (clean desk, screen locks)',
	'Video Conferencing Security',
	'Incident Reporting from Remote Locations'
])}`
		),

	'privacy-policy': (ctx) =>
		buildBasePrompt(
			ctx,
			`This is the Privacy Policy for ${ctx.companyName}.
It addresses ${ctx.framework} controls including P1.1, P2.1, P3.1, P4.1, P5.1, P6.1, P7.1, P8.1.

${buildSectionsPrompt([
	'Purpose & Scope',
	'Data Collected (categories of personal data)',
	'Legal Basis for Processing',
	'How Data Is Used',
	'Data Subject Rights (access, rectification, erasure, portability)',
	'Data Retention Periods',
	'Third-Party Sharing & Sub-processors',
	'Security Measures',
	'International Transfers',
	'Contact Information & DPO'
])}`
		),

	'ai-usage-policy': (ctx) =>
		buildBasePrompt(
			ctx,
			`This is the AI Usage Policy for ${ctx.companyName}.
It addresses ${ctx.framework} controls including CC2.2, CC6.1.

${buildSectionsPrompt([
	'Purpose',
	'Scope',
	'Approved AI Tools & Platforms',
	'Prohibited Uses (no Confidential or Restricted data in public AI tools)',
	'Data Classification Requirements for AI Inputs',
	'Output Review & Validation Requirements',
	'Vendor Assessment for AI Tools',
	'Intellectual Property Considerations',
	'Incident Reporting for AI-related Issues',
	'Policy Review Cadence (AI landscape changes rapidly)'
])}`
		),

	'data-retention-policy': (ctx) =>
		buildBasePrompt(
			ctx,
			`This is the Data Retention Policy for ${ctx.companyName}.
It addresses ${ctx.framework} controls including CC6.5, P4.1.

${buildSectionsPrompt([
	'Purpose',
	'Scope',
	'Retention Schedule by Data Type (financial, customer, employee, security logs, etc.)',
	'Legal & Regulatory Minimums',
	'Legal Hold Process',
	'Secure Disposal Methods (overwrite standards, physical destruction)',
	'Archival Procedures',
	'Roles & Responsibilities'
])}`
		),

	'physical-security-policy': (ctx) =>
		buildBasePrompt(
			ctx,
			`This is the Physical Security Policy for ${ctx.companyName}.
It addresses ${ctx.framework} controls including CC6.4.

${buildSectionsPrompt([
	'Purpose',
	'Scope',
	'Facility Access Controls (badge systems, key management)',
	'Visitor Management (registration, escort requirements)',
	'Clean Desk & Clear Screen Policy',
	'Media & Equipment Handling',
	'Equipment Disposal (secure erasure before disposal)',
	'CCTV & Physical Monitoring',
	'Remote Office & Home Office Physical Security'
])}`
		)
};

// ─── Custom policy prompt ─────────────────────────────────────────────────────

function buildCustomPrompt(ctx: PolicyContext, customTitle: string, customPrompt: string): string {
	return buildBasePrompt(
		ctx,
		`This is the "${customTitle}" policy for ${ctx.companyName}, targeting ${ctx.framework} compliance.

The policy owner has described what this policy should cover:
"${customPrompt}"

Using the description above, write a complete, auditor-ready policy document. Structure it with clear sections appropriate for the subject matter. Be specific to the company context provided.`
	);
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session || !locals.organizationId) throw error(401, 'Unauthorized');
	const orgId = locals.organizationId;
	const org = locals.organization;
	if (!org) throw error(400, 'No organization found');

	const body = (await request.json()) as GenerateRequest;
	const { policyType, controlId, customTitle, customPrompt } = body;

	const isCustom = policyType === 'custom';
	const isStandard = (STANDARD_POLICY_TYPES as readonly string[]).includes(policyType);

	if (!isCustom && !isStandard) {
		throw error(400, `Invalid policy type: "${policyType}"`);
	}

	if (isCustom) {
		if (!customTitle || typeof customTitle !== 'string' || customTitle.trim().length === 0) {
			throw error(400, 'customTitle is required for custom policy type');
		}
		if (!customPrompt || typeof customPrompt !== 'string' || customPrompt.trim().length === 0) {
			throw error(400, 'customPrompt is required for custom policy type');
		}
	}

	// Resolve org's primary framework
	const [orgFramework] = await db
		.select({ framework: frameworks })
		.from(organizationFrameworks)
		.innerJoin(frameworks, eq(organizationFrameworks.frameworkId, frameworks.id))
		.where(eq(organizationFrameworks.organizationId, orgId))
		.limit(1);

	const frameworkName = orgFramework?.framework.name ?? 'SOC 2';
	const frameworkId = orgFramework?.framework.id ?? null;

	const stack = Array.isArray(org.stack)
		? org.stack.join(', ')
		: ((org.stack as string | null | undefined) ?? 'various tools');

	const ctx: PolicyContext = {
		companyName: org.name,
		stack,
		teamSize: org.teamSize ?? 'n/a',
		framework: frameworkName
	};

	// Build prompt
	const prompt = isCustom
		? buildCustomPrompt(ctx, customTitle!, customPrompt!)
		: POLICY_PROMPTS[policyType as StandardPolicyType](ctx);

	// Generate with AI
	let content: string;
	try {
		const result = await generateText({
			model: openrouter('openai/gpt-4o-mini'),
			prompt,
			maxTokens: 4096
		});
		content = result.text;
	} catch (err) {
		console.error('[policy-generate] AI generation failed:', err);
		throw error(
			500,
			'Policy generation failed. Please try again. If the problem persists, contact support.'
		);
	}

	// Determine title
	const title = isCustom ? (customTitle as string) : (POLICY_TITLES[policyType] ?? policyType);

	// Persist to DB
	const [policy] = await db
		.insert(policies)
		.values({
			organizationId: orgId,
			controlId: (controlId as string | null | undefined) ?? null,
			frameworkId: frameworkId ?? null,
			type: policyType,
			title,
			content,
			isCustom,
			customPrompt: isCustom ? (customPrompt as string) : null,
			generatedAt: new Date()
		})
		.returning();

	return json({ policy });
};
