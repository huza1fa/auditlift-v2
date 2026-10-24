/**
 * Opt-in HTTP/PostgreSQL integration smoke test. Requires a running local app and
 * an already initialized DISPOSABLE auditlift_verify database. Never uses DATABASE_URL.
 * See docs/answer-freshness.md. Fixtures are left in that disposable database.
 */
import assert from 'node:assert/strict';
import { createHmac, randomUUID } from 'node:crypto';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { hashPassword } from 'better-auth/crypto';
import * as schema from '../src/lib/server/db/schema';
import { answerRevision, fingerprint } from '../src/lib/server/answer-freshness';

const databaseUrl = new URL(process.env.TEST_DATABASE_URL ?? 'invalid:');
const base = new URL(process.env.VERIFY_BASE_URL ?? 'invalid:');
const secret = process.env.VERIFY_AUTH_SECRET;
assert(
	['localhost', '127.0.0.1'].includes(databaseUrl.hostname) &&
		databaseUrl.pathname === '/auditlift_verify',
	'Use an explicit, disposable local TEST_DATABASE_URL named auditlift_verify'
);
assert(
	['localhost', '127.0.0.1'].includes(base.hostname) && base.protocol === 'http:' && !!base.port,
	'VERIFY_BASE_URL must be a local HTTP app on an explicit port'
);
assert(
	secret && secret.length >= 32,
	'VERIFY_AUTH_SECRET must match the local app BETTER_AUTH_SECRET'
);
const client = postgres(databaseUrl.toString(), { ssl: false, max: 2 });
const db = drizzle(client, { schema });
const now = new Date();
const suffix = randomUUID();
const orgId = randomUUID();
const otherOrgId = randomUUID();
const password = `Local-only-${randomUUID()}!`;

async function identity(role: 'owner' | 'admin' | 'member' | 'viewer', organizationId = orgId) {
	const id = randomUUID();
	const email = `${role}-${id}@auditlift-verify.invalid`;
	const token = randomUUID();
	await db.insert(schema.user).values({
		id,
		name: `Test ${role}`,
		email,
		emailVerified: true,
		createdAt: now,
		updatedAt: now
	});
	await db.insert(schema.account).values({
		id: randomUUID(),
		accountId: id,
		providerId: 'credential',
		userId: id,
		password: await hashPassword(password),
		createdAt: now,
		updatedAt: now
	});
	await db.insert(schema.userOrganizations).values({ userId: id, organizationId, role });
	await db.insert(schema.session).values({
		id: randomUUID(),
		token,
		userId: id,
		expiresAt: new Date(Date.now() + 86400000),
		createdAt: now,
		updatedAt: now
	});
	const cookie = `better-auth.session_token=${encodeURIComponent(`${token}.${createHmac('sha256', secret!).update(token).digest('base64')}`)}`;
	return { id, email, cookie };
}

try {
	await db.insert(schema.organizations).values(
		[orgId, otherOrgId].map((id) => ({
			id,
			name: `Freshness verification ${id.slice(0, 8)}`,
			slug: `verify-${id}`,
			onboardingComplete: true,
			trialEndsAt: new Date(Date.now() + 86400000)
		}))
	);
	const owner = await identity('owner');
	const viewer = await identity('viewer');
	const member = await identity('member');
	const otherOwner = await identity('owner', otherOrgId);
	const [policy] = await db
		.insert(schema.policies)
		.values({
			organizationId: orgId,
			type: 'data-retention-policy',
			title: 'Retention policy',
			content: 'We retain customer data for 90 days.'
		})
		.returning();
	const [questionnaire] = await db
		.insert(schema.questionnaires)
		.values({
			organizationId: orgId,
			filename: `verification-${suffix}.pdf`,
			storageKey: 'local-test-not-downloaded',
			sourceFormat: 'pdf',
			status: 'ready',
			totalQuestions: 1,
			answeredCount: 1,
			highCount: 1,
			dealReadinessScore: 100
		})
		.returning();
	const [question] = await db
		.insert(schema.questionnaireQuestions)
		.values({
			organizationId: orgId,
			questionnaireId: questionnaire.id,
			questionText: 'How long do you retain customer data?',
			generatedAnswer: '90 days.',
			userEditedAnswer: 'Our confirmed retention period is 90 days.',
			confidence: 'high',
			citations: [
				{
					sourceType: 'policy',
					sourceId: policy.id,
					sourceTitle: policy.title,
					excerpt: '90 days',
					sourceVersion: fingerprint({ title: policy.title, content: policy.content })
				}
			]
		})
		.returning();
	const qPath = `/api/questionnaires/${questionnaire.id}`;
	async function request(
		path: string,
		method = 'GET',
		body?: unknown,
		cookie = owner.cookie,
		expected = 200
	) {
		const response = await fetch(new URL(path, base), {
			method,
			headers: { Origin: base.origin, Cookie: cookie, 'Content-Type': 'application/json' },
			...(body === undefined ? {} : { body: JSON.stringify(body) })
		});
		assert.equal(response.status, expected, `${method} ${path}: ${await response.clone().text()}`);
		return response;
	}
	const detail = async () => (await request(qPath)).json();
	const storedEntry = async (id: string) =>
		(
			await db
				.select()
				.from(schema.answerLibraryEntries)
				.where(eq(schema.answerLibraryEntries.id, id))
		)[0];
	let state = await detail();
	assert.equal(state.questions[0].freshnessIssues.length, 0);
	const approval = {
		scope: 'Company-wide',
		sourceRevision: state.freshnessRevision,
		questionRevision: state.questions[0].reviewRevision
	};
	await request(`${qPath}/questions/${question.id}/library`, 'POST', approval, '', 401);
	await request(`${qPath}/questions/${question.id}/library`, 'POST', approval, viewer.cookie, 403);
	await request(
		`${qPath}/questions/${question.id}/library`,
		'POST',
		approval,
		otherOwner.cookie,
		404
	);
	const { entry } = await (
		await request(`${qPath}/questions/${question.id}/library`, 'POST', approval)
	).json();
	assert(entry.expiresAt, 'New approvals must have a default re-review date');
	console.log('PASS: explicit approval, default expiry, authentication, roles, tenant ownership');

	await request(`/api/policies/${policy.id}`, 'PATCH', {
		content: 'We retain customer data for 30 days.'
	});
	state = await detail();
	assert.equal(state.questions[0].freshnessIssues[0].reason, 'changed');
	assert.equal(state.questions[0].userEditedAnswer, question.userEditedAnswer);
	const html = await (await request('/answer-library')).text();
	assert(html.includes('Needs review') && html.includes('Source changed'));
	const entryPath = `/api/answer-library/${entry.id}`;
	let reviewedEntry = await storedEntry(entry.id);
	let review = {
		action: 'approve',
		revision: answerRevision(reviewedEntry),
		sourceRevision: state.freshnessRevision,
		answer: '30 days.',
		scope: 'Company-wide',
		expiresAt: null,
		sourceIndexes: [0],
		sourceExcerpts: { 0: '30 days' },
		confirmed: true
	};
	await request(entryPath, 'PATCH', { ...review, confirmed: false }, owner.cookie, 400);
	await request(entryPath, 'PATCH', review, member.cookie, 403);
	await request(entryPath, 'PATCH', review, otherOwner.cookie, 404);
	await request(
		entryPath,
		'PATCH',
		{ ...review, sourceExcerpts: { 0: '90 days' } },
		owner.cookie,
		409
	);
	await request(entryPath, 'PATCH', { ...review, revision: '0'.repeat(64) }, owner.cookie, 409);
	await request(
		entryPath,
		'PATCH',
		{ ...review, sourceRevision: '0'.repeat(64) },
		owner.cookie,
		409
	);
	await request(entryPath, 'PATCH', review);
	await request(entryPath, 'PATCH', review, owner.cookie, 409);
	console.log(
		'PASS: changed-source detection, preserved wording, quote validation, concurrent-review protection'
	);

	state = await detail();
	const sourceReview = {
		revision: state.questions[0].reviewRevision,
		sourceRevision: state.freshnessRevision,
		sourceIndexes: [0],
		sourceExcerpts: { 0: '30 days' },
		confirmed: true
	};
	await request(
		`${qPath}/questions/${question.id}/review`,
		'POST',
		sourceReview,
		viewer.cookie,
		403
	);
	await request(`${qPath}/questions/${question.id}/review`, 'POST', sourceReview);
	state = await detail();
	assert.equal(state.questions[0].freshnessIssues.length, 0);
	assert.equal(
		state.questions[0].userEditedAnswer,
		question.userEditedAnswer,
		'Signing off sources must not overwrite human wording'
	);
	console.log('PASS: explicit question source review clears warnings without overwriting answers');

	await request(`/api/policies/${policy.id}`, 'PATCH', {
		content: 'We retain customer data for 14 days.'
	});
	const warning = await (
		await request(`${qPath}/export`, 'GET', undefined, owner.cookie, 409)
	).json();
	assert.equal(warning.code, 'ANSWER_REVIEW_REQUIRED');
	assert.equal(
		(await db.select().from(schema.organizations).where(eq(schema.organizations.id, orgId)))[0]
			.trialQuestionnaireExportedAt,
		null
	);
	await request(`/api/policies/${policy.id}`, 'PATCH', {
		content: 'We retain customer data for 7 days.'
	});
	await request(
		`${qPath}/export?acknowledgeFreshness=${warning.reviewToken}`,
		'GET',
		undefined,
		owner.cookie,
		409
	);
	const latestWarning = await (
		await request(`${qPath}/export`, 'GET', undefined, owner.cookie, 409)
	).json();
	const exported = await request(
		`${qPath}/export?acknowledgeFreshness=${latestWarning.reviewToken}`
	);
	assert.equal(exported.headers.get('X-AuditLift-Export-Mode'), 'review');
	assert((await exported.text()).includes(question.userEditedAnswer!));
	assert(
		(await db.select().from(schema.organizations).where(eq(schema.organizations.id, orgId)))[0]
			.trialQuestionnaireExportedAt
	);
	console.log(
		'PASS: export warnings, stale acknowledgement rejection, atomic trial export preservation'
	);

	reviewedEntry = await storedEntry(entry.id);
	await request(entryPath, 'PATCH', { action: 'retire', revision: answerRevision(reviewedEntry) });
	assert.equal((await storedEntry(entry.id)).status, 'retired');
	await db
		.update(schema.questionnaireQuestions)
		.set({
			citations: [
				{
					sourceType: 'approved_answer',
					sourceId: entry.id,
					sourceTitle: entry.questionText,
					excerpt: entry.answer,
					sourceVersion: answerRevision(reviewedEntry)
				}
			]
		})
		.where(eq(schema.questionnaireQuestions.id, question.id));
	state = await detail();
	assert.equal(state.questions[0].freshnessIssues[0].reason, 'stale');
	const [foreignPolicy] = await db
		.insert(schema.policies)
		.values({
			organizationId: otherOrgId,
			type: 'security-policy',
			title: 'Private other-tenant policy',
			content: 'OTHER_TENANT_SECRET'
		})
		.returning();
	await db
		.update(schema.questionnaireQuestions)
		.set({
			citations: [
				{
					sourceType: 'policy',
					sourceId: foreignPolicy.id,
					sourceTitle: 'Unknown policy',
					excerpt: 'untrusted',
					sourceVersion: 'forged'
				}
			]
		})
		.where(eq(schema.questionnaireQuestions.id, question.id));
	state = await detail();
	assert.equal(state.questions[0].freshnessIssues[0].reason, 'unavailable');
	assert.equal(state.currentSources[`policy:${foreignPolicy.id}`].currentText, '');
	assert(!JSON.stringify(state).includes('OTHER_TENANT_SECRET'));
	const csrfResponse = await fetch(new URL(entryPath, base), {
		method: 'PATCH',
		headers: { Cookie: owner.cookie, 'Content-Type': 'application/json' },
		body: JSON.stringify({ action: 'retire', revision: answerRevision(reviewedEntry) })
	});
	assert.equal(csrfResponse.status, 403);
	await db
		.update(schema.organizations)
		.set({ trialEndsAt: new Date(0) })
		.where(eq(schema.organizations.id, orgId));
	await request(
		entryPath,
		'PATCH',
		{ action: 'retire', revision: answerRevision(await storedEntry(entry.id)) },
		owner.cookie,
		402
	);
	console.log(
		'PASS: retired-answer dependencies, cross-tenant source isolation, CSRF and expired-access gates'
	);
	await db
		.update(schema.organizations)
		.set({ trialEndsAt: new Date(Date.now() + 86400000) })
		.where(eq(schema.organizations.id, orgId));
	const [fact] = await db
		.insert(schema.organizationFacts)
		.values({
			organizationId: orgId,
			category: 'security',
			label: `Backup schedule ${suffix}`,
			value: 'Daily backups',
			status: 'verified',
			reviewedAt: now,
			reviewedBy: owner.id
		})
		.returning();
	await db
		.update(schema.questionnaireQuestions)
		.set({
			citations: [
				{
					sourceType: 'fact',
					sourceId: fact.id,
					sourceTitle: fact.label,
					excerpt: fact.value,
					sourceVersion: fingerprint({
						category: fact.category,
						label: fact.label,
						value: fact.value,
						sourceDetail: fact.sourceDetail,
						reviewedAt: fact.reviewedAt
					})
				}
			]
		})
		.where(eq(schema.questionnaireQuestions.id, question.id));
	assert.equal((await detail()).questions[0].freshnessIssues.length, 0);
	await request(`/api/settings/facts/${fact.id}`, 'PATCH', { value: 'Hourly backups' });
	assert.equal((await detail()).questions[0].freshnessIssues[0].reason, 'unavailable');
	await request(`/api/settings/facts/${fact.id}`, 'PATCH', { status: 'verified' });
	assert.equal((await detail()).questions[0].freshnessIssues[0].reason, 'changed');
	await request(`/api/settings/facts/${fact.id}`, 'DELETE');
	assert.equal((await detail()).questions[0].freshnessIssues[0].reason, 'unavailable');
	console.log(
		'PASS: edited facts lose verification, re-verification changes their fingerprint, and deletion invalidates citations'
	);

	// Leave a usable local browser fixture, never a production credential.
	await db
		.update(schema.organizations)
		.set({ trialEndsAt: new Date(Date.now() + 86400000) })
		.where(eq(schema.organizations.id, orgId));
	await db
		.update(schema.questionnaireQuestions)
		.set({ citations: question.citations })
		.where(eq(schema.questionnaireQuestions.id, question.id));
	await Bun.write(
		'/tmp/opencode/auditlift-freshness-local-fixture.json',
		JSON.stringify({
			url: base.origin,
			email: owner.email,
			password,
			questionnaireId: questionnaire.id
		})
	);
	console.log(
		'All local HTTP/PostgreSQL freshness checks passed. Browser fixture saved under /tmp/opencode.'
	);
} finally {
	await client.end();
}
