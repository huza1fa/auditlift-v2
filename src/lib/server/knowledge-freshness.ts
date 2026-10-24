import { eq } from 'drizzle-orm';
import { db } from './db';
import {
	answerLibraryEntries,
	controls,
	organizationFacts,
	organizations,
	policies
} from './db/schema';
import { createFreshnessContext, fingerprint, type KnowledgeSource } from './answer-freshness';

/** Fixed query count, tenant-scoped before constructing the dependency graph. */
export async function loadKnowledgeFreshness(
	organizationId: string,
	database: Pick<typeof db, 'select'> = db
) {
	const [entries, policyRows, facts, orgs, controlRows] = await Promise.all([
		database
			.select()
			.from(answerLibraryEntries)
			.where(eq(answerLibraryEntries.organizationId, organizationId)),
		database
			.select({
				id: policies.id,
				title: policies.title,
				content: policies.content,
				archivedAt: policies.archivedAt
			})
			.from(policies)
			.where(eq(policies.organizationId, organizationId)),
		database
			.select()
			.from(organizationFacts)
			.where(eq(organizationFacts.organizationId, organizationId)),
		database
			.select({ systemDescription: organizations.systemDescription })
			.from(organizations)
			.where(eq(organizations.id, organizationId)),
		// Controls are public, seeded framework definitions, not tenant records.
		database.select().from(controls)
	]);
	const sources: KnowledgeSource[] = [
		...policyRows.map((policy) => ({
			type: 'policy',
			id: policy.id,
			title: policy.title,
			currentText: policy.content,
			available: !policy.archivedAt,
			version: fingerprint({ title: policy.title, content: policy.content })
		})),
		...facts.map((fact) => ({
			type: 'fact',
			id: fact.id,
			title: fact.label,
			currentText: fact.value,
			available: fact.status === 'verified',
			questionnaireId:
				fact.scope === 'questionnaire' ? (fact.questionnaireId ?? 'invalid-scope') : null,
			version: fingerprint({
				category: fact.category,
				label: fact.label,
				value: fact.value,
				sourceDetail: fact.sourceDetail,
				reviewedAt: fact.reviewedAt
			})
		})),
		...controlRows.map((control) => ({
			type: 'control',
			id: control.id,
			title: control.title,
			currentText: `${control.code}: ${control.title}\n${control.description}\n${control.whatAuditorExpects}`,
			available: true,
			version: fingerprint({
				code: control.code,
				title: control.title,
				description: control.description,
				whatAuditorExpects: control.whatAuditorExpects
			})
		})),
		{
			type: 'system_description',
			id: 'organization',
			title: 'System description',
			currentText: JSON.stringify(orgs[0]?.systemDescription ?? {}),
			available: !!orgs[0]?.systemDescription,
			version: fingerprint(orgs[0]?.systemDescription ?? null)
		}
	];
	return {
		...createFreshnessContext(sources, entries),
		policyRows,
		facts,
		controlRows,
		systemDescription: orgs[0]?.systemDescription
	};
}
