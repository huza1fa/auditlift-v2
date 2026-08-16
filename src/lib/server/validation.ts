import { z } from 'zod';

export const InviteTeamMemberSchema = z.object({
	email: z.string().email().max(254),
	role: z.enum(['admin', 'member', 'viewer']).default('member')
});

export const GeneratePolicySchema = z.object({
	policyType: z.string().min(1).max(100),
	controlId: z.string().uuid().optional(),
	controlIds: z.array(z.string().uuid()).min(1).max(50).optional(),
	questionnaireId: z.string().uuid().optional(),
	customTitle: z.string().min(1).max(200).optional(),
	customPrompt: z.string().min(1).max(2000).optional()
});

export const PatchPolicySchema = z
	.object({
		content: z.string().min(1).max(500_000).optional(),
		title: z.string().min(1).max(200).optional()
	})
	.refine((data) => data.content !== undefined || data.title !== undefined, {
		message: 'At least one field required'
	});

export const PresignEvidenceSchema = z.object({
	controlId: z.string().uuid(),
	filename: z.string().min(1).max(255),
	mimeType: z.string().min(1).max(100),
	sizeBytes: z
		.number()
		.int()
		.positive()
		.max(10 * 1024 * 1024)
});

export const StackSchema = z.object({
	stack: z
		.array(z.enum(['AWS', 'GCP', 'Azure', 'GitHub', 'GitLab', 'Vercel', 'Cloudflare', 'Other']))
		.default([])
});

export const OrganizationSchema = z.object({
	name: z.string().trim().min(1).max(100),
	website: z
		.string()
		.max(500)
		.optional()
		.nullable()
		.transform((v) => {
			if (!v || v.trim() === '') return null;
			const trimmed = v.trim();
			// Auto-prepend https:// if no scheme present
			return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
		}),
	industry: z.string().max(100).optional().nullable()
});

export const ExportSchema = z.object({
	policyIds: z.array(z.string().uuid()).optional(),
	evidenceIds: z.array(z.string().uuid()).optional()
});

export const ImproveAnswerSchema = z.object({
	refinementPrompt: z.string().min(1).max(500)
});

export const SystemDescriptionSchema = z.object({
	productDescription: z.string().max(500).optional().default(''),
	dataFlowType: z.enum(['cloud-saas', 'on-prem', 'hybrid', 'api-only', '']).optional().default(''),
	dataStorageProviders: z.array(z.string().max(100)).max(20).optional().default([]),
	dataStorageRegion: z.string().max(100).optional().default(''),
	endpointManagement: z
		.enum(['mdm', 'compliance-tool', 'manual', 'none', ''])
		.optional()
		.default(''),
	endpointManagementTool: z.string().max(100).optional().default(''),
	identityProvider: z.string().max(100).optional().default(''),
	keyTools: z.string().max(500).optional().default(''),
	additionalContext: z.string().max(1000).optional().default('')
});

const OrganizationFactFields = {
	category: z.string().trim().min(1).max(100),
	label: z.string().trim().min(1).max(200),
	value: z.string().trim().min(1).max(10_000),
	sourceDetail: z.string().trim().min(1).max(2_000).nullable().optional()
};

export const CreateOrganizationFactSchema = z
	.object({
		...OrganizationFactFields,
		status: z.enum(['pending', 'verified']).optional()
	})
	.strict();

export const UpdateOrganizationFactSchema = z
	.object({
		category: OrganizationFactFields.category.optional(),
		label: OrganizationFactFields.label.optional(),
		value: OrganizationFactFields.value.optional(),
		sourceDetail: OrganizationFactFields.sourceDetail,
		status: z.enum(['pending', 'verified']).optional()
	})
	.strict()
	.refine(
		(data) =>
			data.category !== undefined ||
			data.label !== undefined ||
			data.value !== undefined ||
			data.sourceDetail !== undefined ||
			data.status !== undefined,
		{ message: 'At least one field is required' }
	);
