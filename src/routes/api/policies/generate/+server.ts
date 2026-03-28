import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { policies, organizationFrameworks, frameworks } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';

const TEMPLATE_DIR = path.join(process.cwd(), 'src/lib/server/policy-templates');

const POLICY_TYPES = [
	'security-policy',
	'access-control-policy',
	'incident-response-policy'
] as const;
type PolicyType = (typeof POLICY_TYPES)[number];

const POLICY_TITLES: Record<PolicyType, string> = {
	'security-policy': 'Security Policy',
	'access-control-policy': 'Access Control Policy',
	'incident-response-policy': 'Incident Response Policy'
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session || !locals.organizationId) throw error(401, 'Unauthorized');
	const orgId = locals.organizationId;
	const org = locals.organization;
	if (!org) throw error(400, 'No organization found');

	const { policyType, controlId } = await request.json();
	if (!POLICY_TYPES.includes(policyType as PolicyType)) throw error(400, 'Invalid policy type');

	const templatePath = path.join(TEMPLATE_DIR, `${policyType}.md`);
	let template = await fs.readFile(templatePath, 'utf-8');

	// Get framework name
	const [orgFramework] = await db
		.select({ framework: frameworks })
		.from(organizationFrameworks)
		.innerJoin(frameworks, eq(organizationFrameworks.frameworkId, frameworks.id))
		.where(eq(organizationFrameworks.organizationId, orgId))
		.limit(1);

	const stack = Array.isArray(org.stack)
		? org.stack.join(', ')
		: ((org.stack as string | null | undefined) ?? 'various tools');

	const replacements: Record<string, string> = {
		'{{companyName}}': org.name,
		'{{stack}}': stack,
		'{{teamSize}}': org.teamSize ?? 'n/a',
		'{{date}}': new Date().toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}),
		'{{framework}}': orgFramework?.framework.name ?? 'SOC 2'
	};

	for (const [key, val] of Object.entries(replacements)) {
		template = template.replaceAll(key, val);
	}

	const [policy] = await db
		.insert(policies)
		.values({
			organizationId: orgId,
			controlId: (controlId as string | null | undefined) ?? null,
			type: policyType as string,
			title: POLICY_TITLES[policyType as PolicyType],
			content: template,
			generatedAt: new Date()
		})
		.returning();

	return json({ policy });
};
