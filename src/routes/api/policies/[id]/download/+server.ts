import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { policies } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { generatePolicyPdf } from '$lib/server/pdf';
import { requireActiveOrganizationRole } from '$lib/server/auth-utils';
import { logActivity } from '$lib/server/activity';

export const GET: RequestHandler = async ({ locals, params }) => {
	const { organizationId, userId } = await requireActiveOrganizationRole(
		locals,
		'viewer',
		'Insufficient permissions',
		'Trial expired. Upgrade to download policies.'
	);

	const policyId = params.id;
	if (!policyId) {
		throw error(400, 'Missing policy ID');
	}

	const [policy] = await db
		.select()
		.from(policies)
		.where(and(eq(policies.id, policyId), eq(policies.organizationId, organizationId)))
		.limit(1);

	if (!policy) {
		throw error(404, 'Policy not found');
	}

	logActivity({
		organizationId,
		userId,
		userName: locals.session!.user.name ?? locals.session!.user.email,
		action: 'policy.download',
		entityType: 'policy',
		entityId: policy.id,
		entityName: policy.title
	}).catch(console.error);

	const companyName = locals.organization?.name ?? 'Auditlift';

	const pdfBytes = await generatePolicyPdf(policy.title, policy.content, companyName);

	// Sanitize filename for Content-Disposition
	const safeFilename = policy.title.replace(/[^a-zA-Z0-9_-]/g, '_');

	return new Response(new Blob([Buffer.from(pdfBytes)], { type: 'application/pdf' }), {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="${safeFilename}.pdf"`,
			'Content-Length': pdfBytes.length.toString()
		}
	});
};
