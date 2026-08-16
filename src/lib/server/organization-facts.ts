import { and, asc, eq } from 'drizzle-orm';
import { db } from './db';
import {
	organizationFacts,
	type OrganizationFactSource,
	type OrganizationFactStatus
} from './db/schema';
import {
	formatVerifiedOrganizationFactsForPrompt,
	type VerifiedOrganizationFact
} from './organization-facts-format';

export {
	formatVerifiedOrganizationFactsForPrompt,
	type VerifiedOrganizationFact,
	type OrganizationFactSource,
	type OrganizationFactStatus
};

export interface CreateOrganizationFactInput {
	organizationId: string;
	actorUserId: string;
	category: string;
	label: string;
	value: string;
	source?: OrganizationFactSource;
	status?: OrganizationFactStatus;
	sourceDetail?: string | null;
}

export interface UpdateOrganizationFactInput {
	organizationId: string;
	factId: string;
	actorUserId: string;
	category?: string;
	label?: string;
	value?: string;
	sourceDetail?: string | null;
	status?: OrganizationFactStatus;
}

export async function listOrganizationFacts(organizationId: string) {
	return db
		.select()
		.from(organizationFacts)
		.where(eq(organizationFacts.organizationId, organizationId))
		.orderBy(asc(organizationFacts.category), asc(organizationFacts.label));
}

export async function getOrganizationFact(organizationId: string, factId: string) {
	const [fact] = await db
		.select()
		.from(organizationFacts)
		.where(
			and(eq(organizationFacts.organizationId, organizationId), eq(organizationFacts.id, factId))
		)
		.limit(1);
	return fact ?? null;
}

export async function createOrganizationFact(input: CreateOrganizationFactInput) {
	const [fact] = await db
		.insert(organizationFacts)
		.values({
			organizationId: input.organizationId,
			category: input.category,
			label: input.label,
			value: input.value,
			source: input.source ?? 'manual',
			status: input.status ?? 'pending',
			sourceDetail: input.sourceDetail ?? null,
			createdBy: input.actorUserId,
			updatedBy: input.actorUserId,
			reviewedBy: input.status === 'verified' ? input.actorUserId : null,
			reviewedAt: input.status === 'verified' ? new Date() : null
		})
		.returning();
	return fact;
}

export async function updateOrganizationFact(input: UpdateOrganizationFactInput) {
	const updateValues = {
		...(input.category !== undefined ? { category: input.category } : {}),
		...(input.label !== undefined ? { label: input.label } : {}),
		...(input.value !== undefined ? { value: input.value } : {}),
		...(input.sourceDetail !== undefined ? { sourceDetail: input.sourceDetail } : {}),
		...(input.status !== undefined
			? {
					status: input.status,
					reviewedBy: input.status === 'verified' ? input.actorUserId : null,
					reviewedAt: input.status === 'verified' ? new Date() : null
				}
			: {}),
		updatedBy: input.actorUserId,
		updatedAt: new Date()
	};

	const [fact] = await db
		.update(organizationFacts)
		.set(updateValues)
		.where(
			and(
				eq(organizationFacts.organizationId, input.organizationId),
				eq(organizationFacts.id, input.factId)
			)
		)
		.returning();
	return fact ?? null;
}

export async function deleteOrganizationFact(organizationId: string, factId: string) {
	const [fact] = await db
		.delete(organizationFacts)
		.where(
			and(eq(organizationFacts.organizationId, organizationId), eq(organizationFacts.id, factId))
		)
		.returning({ id: organizationFacts.id });
	return fact ?? null;
}

export async function getVerifiedOrganizationFacts(
	organizationId: string
): Promise<VerifiedOrganizationFact[]> {
	return db
		.select({
			category: organizationFacts.category,
			label: organizationFacts.label,
			value: organizationFacts.value,
			sourceDetail: organizationFacts.sourceDetail
		})
		.from(organizationFacts)
		.where(
			and(
				eq(organizationFacts.organizationId, organizationId),
				eq(organizationFacts.status, 'verified')
			)
		)
		.orderBy(asc(organizationFacts.category), asc(organizationFacts.label));
}

export async function getVerifiedOrganizationFactsForPrompt(
	organizationId: string
): Promise<string> {
	return formatVerifiedOrganizationFactsForPrompt(
		await getVerifiedOrganizationFacts(organizationId)
	);
}
