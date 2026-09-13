import {
	pgTable,
	text,
	integer,
	boolean,
	timestamp,
	uuid,
	jsonb,
	uniqueIndex,
	index,
	primaryKey,
	foreignKey,
	check
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './auth.schema';

// ─── Organizations ────────────────────────────────────────────────────────────

export const organizations = pgTable('organizations', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	domain: text('domain'), // e.g., 'company.com' - extracted from first user's email
	website: text('website'),
	industry: text('industry'),
	teamSize: text('team_size'),
	stack: jsonb('stack').$type<string[]>(),
	dataTypes: jsonb('data_types').$type<string[]>(),
	customerType: text('customer_type'),
	geoReach: text('geo_reach'),
	securityTools: jsonb('security_tools').$type<string[]>(),
	productType: text('product_type'),
	systemDescription: jsonb('system_description').$type<{
		productDescription?: string;
		dataFlowType?: string;
		dataStorageProviders?: string[];
		dataStorageRegion?: string;
		endpointManagement?: string;
		endpointManagementTool?: string;
		identityProvider?: string;
		keyTools?: string;
		additionalContext?: string;
	}>(),
	trialEndsAt: timestamp('trial_ends_at'),
	// A trial organization may download one completed buyer questionnaire. The claim ID
	// lets an interrupted export release only its own reservation without reopening an
	// export that another request has already completed.
	trialQuestionnaireExportedAt: timestamp('trial_questionnaire_exported_at'),
	trialQuestionnaireExportClaimId: uuid('trial_questionnaire_export_claim_id'),
	onboardingComplete: boolean('onboarding_complete').default(false),
	trialReminderSentAt: timestamp('trial_reminder_sent_at'),
	trialExpiredEmailSentAt: timestamp('trial_expired_email_sent_at'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ─── Organization Facts ──────────────────────────────────────────────────────

export type OrganizationFactSource = 'manual' | 'system';
export type OrganizationFactStatus = 'pending' | 'verified';

export const organizationFacts = pgTable(
	'organization_facts',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id, { onDelete: 'cascade' }),
		category: text('category').notNull(),
		label: text('label').notNull(),
		value: text('value').notNull(),
		source: text('source').$type<OrganizationFactSource>().notNull().default('manual'),
		status: text('status').$type<OrganizationFactStatus>().notNull().default('pending'),
		sourceDetail: text('source_detail'),
		createdBy: text('created_by').references(() => user.id, { onDelete: 'set null' }),
		updatedBy: text('updated_by').references(() => user.id, { onDelete: 'set null' }),
		reviewedBy: text('reviewed_by').references(() => user.id, { onDelete: 'set null' }),
		reviewedAt: timestamp('reviewed_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		uniqueIndex('organization_facts_org_category_label_unique_idx').on(
			table.organizationId,
			table.category,
			table.label
		),
		index('organization_facts_org_status_idx').on(table.organizationId, table.status),
		check('organization_facts_source_check', sql`${table.source} in ('manual', 'system')`),
		check('organization_facts_status_check', sql`${table.status} in ('pending', 'verified')`)
	]
);

// ─── Subscriptions ────────────────────────────────────────────────────────────

export const subscriptions = pgTable(
	'subscriptions',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id),
		stripeCustomerId: text('stripe_customer_id'),
		stripeSubscriptionId: text('stripe_subscription_id'),
		status: text('status').notNull().default('trialing'),
		currentPeriodEnd: timestamp('current_period_end'),
		cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
		accessOverrideUntil: timestamp('access_override_until'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		uniqueIndex('subscriptions_org_id_unique_idx').on(table.organizationId),
		index('subscriptions_stripe_sub_id_idx').on(table.stripeSubscriptionId)
	]
);

// ─── Frameworks (seed table) ──────────────────────────────────────────────────

export const frameworks = pgTable('frameworks', {
	id: uuid('id').primaryKey().defaultRandom(),
	slug: text('slug').notNull().unique(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	recommended: boolean('recommended').default(false),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ─── Controls (seed table) ────────────────────────────────────────────────────

export const controls = pgTable(
	'controls',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		frameworkId: uuid('framework_id')
			.notNull()
			.references(() => frameworks.id),
		code: text('code').notNull(),
		title: text('title').notNull(),
		description: text('description').notNull(),
		whyItMatters: text('why_it_matters').notNull(),
		whatAuditorExpects: text('what_auditor_expects').notNull(),
		category: text('category').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [uniqueIndex('controls_framework_code_idx').on(table.frameworkId, table.code)]
);

// ─── Organization Frameworks ──────────────────────────────────────────────────

export const organizationFrameworks = pgTable(
	'organization_frameworks',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id),
		frameworkId: uuid('framework_id')
			.notNull()
			.references(() => frameworks.id),
		activatedAt: timestamp('activated_at').notNull().defaultNow(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		uniqueIndex('organization_frameworks_org_framework_unique_idx').on(
			table.organizationId,
			table.frameworkId
		),
		index('org_fw_org_id_idx').on(table.organizationId)
	]
);

// ─── Evidence ─────────────────────────────────────────────────────────────────

export const evidence = pgTable(
	'evidence',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id),
		controlId: uuid('control_id')
			.notNull()
			.references(() => controls.id),
		filename: text('filename').notNull(),
		storageKey: text('storage_key').notNull(),
		mimeType: text('mime_type').notNull(),
		sizeBytes: integer('size_bytes').notNull(),
		status: text('status').notNull().default('active'), // 'pending' | 'active'
		notes: text('notes'),
		uploadedBy: text('uploaded_by').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
		deletedAt: timestamp('deleted_at')
	},
	(table) => [
		index('evidence_org_control_idx').on(table.organizationId, table.controlId),
		index('evidence_org_status_deleted_idx').on(table.organizationId, table.status, table.deletedAt)
	]
);

// ─── Policies ─────────────────────────────────────────────────────────────────

export const policies = pgTable(
	'policies',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id),
		// Retained for older consumers; policyControls is the authoritative association.
		controlId: uuid('control_id').references(() => controls.id),
		frameworkId: uuid('framework_id').references(() => frameworks.id),
		type: text('type').notNull(),
		title: text('title').notNull(),
		content: text('content').notNull(),
		isCustom: boolean('is_custom').default(false).notNull(),
		customPrompt: text('custom_prompt'),
		generatedAt: timestamp('generated_at'),
		editedAt: timestamp('edited_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
		archivedAt: timestamp('archived_at')
	},
	(table) => [
		uniqueIndex('policies_id_organization_unique_idx').on(table.id, table.organizationId),
		index('policies_org_archived_idx').on(table.organizationId, table.archivedAt),
		index('policies_control_org_idx').on(table.controlId, table.organizationId)
	]
);

// ─── Policy Controls ──────────────────────────────────────────────────────────

export const policyControls = pgTable(
	'policy_controls',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id, { onDelete: 'cascade' }),
		policyId: uuid('policy_id')
			.notNull()
			.references(() => policies.id, { onDelete: 'cascade' }),
		controlId: uuid('control_id')
			.notNull()
			.references(() => controls.id),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		uniqueIndex('policy_controls_policy_control_unique_idx').on(table.policyId, table.controlId),
		index('policy_controls_org_control_idx').on(table.organizationId, table.controlId),
		index('policy_controls_org_policy_idx').on(table.organizationId, table.policyId),
		foreignKey({
			columns: [table.policyId, table.organizationId],
			foreignColumns: [policies.id, policies.organizationId],
			name: 'policy_controls_policy_organization_fk'
		}).onDelete('cascade')
	]
);

// ─── Readiness Scores ─────────────────────────────────────────────────────────

export const readinessScores = pgTable(
	'readiness_scores',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id),
		frameworkId: uuid('framework_id')
			.notNull()
			.references(() => frameworks.id),
		score: integer('score').notNull().default(0),
		blockerCount: integer('blocker_count').notNull().default(0),
		computedAt: timestamp('computed_at').notNull().defaultNow(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		uniqueIndex('readiness_scores_org_framework_idx').on(table.organizationId, table.frameworkId)
	]
);

// ─── User Organizations ───────────────────────────────────────────────────────

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export const userOrganizations = pgTable(
	'user_organizations',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: text('user_id').notNull(), // Better Auth user.id is text
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id),
		role: text('role').notNull().default('member'), // 'owner' | 'admin' | 'member' | 'viewer'
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		uniqueIndex('uo_user_organization_unique_idx').on(table.userId, table.organizationId),
		index('uo_user_id_idx').on(table.userId)
	]
);

// ─── Organization Invitations ───────────────────────────────────────────────

export const organizationInvitations = pgTable('organization_invitations', {
	id: uuid('id').primaryKey().defaultRandom(),
	organizationId: uuid('organization_id')
		.notNull()
		.references(() => organizations.id),
	email: text('email').notNull(),
	role: text('role').notNull().default('member'), // 'admin' | 'member' | 'viewer'
	token: text('token').notNull().unique(),
	invitedBy: text('invited_by').notNull(), // userId
	status: text('status').notNull().default('pending'), // 'pending' | 'accepted' | 'declined'
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// ─── Activity Logs ────────────────────────────────────────────────────────────

export const activityLogs = pgTable(
	'activity_logs',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id),
		userId: text('user_id').notNull(),
		userName: text('user_name'),
		action: text('action').notNull(), // 'evidence.upload' | 'evidence.delete' | 'policy.generate' | 'policy.edit'
		entityType: text('entity_type').notNull(), // 'evidence' | 'policy'
		entityId: text('entity_id').notNull(),
		entityName: text('entity_name'),
		controlCode: text('control_code'),
		details: text('details'),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [index('activity_org_created_idx').on(table.organizationId, table.createdAt)]
);

// ─── Readiness Snapshots ──────────────────────────────────────────────────────

export const readinessSnapshots = pgTable('readiness_snapshots', {
	id: uuid('id').primaryKey().defaultRandom(),
	organizationId: uuid('organization_id')
		.notNull()
		.references(() => organizations.id),
	frameworkId: uuid('framework_id')
		.notNull()
		.references(() => frameworks.id),
	score: integer('score').notNull(),
	snapshotAt: timestamp('snapshot_at').defaultNow().notNull()
});

// ─── Deals ──────────────────────────────────────────────────────────────────

export type DealStatus = 'active' | 'submitted' | 'won' | 'lost' | 'archived';

/**
 * A customer security review. Deals keep the revenue-facing work distinct from
 * the underlying compliance artifacts that support it.
 */
export const deals = pgTable(
	'deals',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id, { onDelete: 'cascade' }),
		customerName: text('customer_name').notNull(),
		name: text('name').notNull(),
		status: text('status').$type<DealStatus>().notNull().default('active'),
		deadlineAt: timestamp('deadline_at'),
		ownerId: text('owner_id').references(() => user.id, { onDelete: 'set null' }),
		notes: text('notes'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		index('deals_org_status_idx').on(table.organizationId, table.status),
		index('deals_org_deadline_idx').on(table.organizationId, table.deadlineAt),
		check(
			'deals_status_check',
			sql`${table.status} in ('active', 'submitted', 'won', 'lost', 'archived')`
		)
	]
);

// ─── Questionnaires ───────────────────────────────────────────────────────────

export const questionnaires = pgTable(
	'questionnaires',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id),
		dealId: uuid('deal_id').references(() => deals.id, { onDelete: 'set null' }),
		filename: text('filename').notNull(),
		storageKey: text('storage_key').notNull(),
		sourceFormat: text('source_format').notNull(), // 'xlsx' | 'csv' | 'pdf' | 'docx'
		status: text('status').notNull().default('processing'), // 'processing' | 'ready' | 'error'
		totalQuestions: integer('total_questions').notNull().default(0),
		answeredCount: integer('answered_count').notNull().default(0),
		gapCount: integer('gap_count').notNull().default(0),
		dealReadinessScore: integer('deal_readiness_score').notNull().default(0),
		highCount: integer('high_count').notNull().default(0),
		mediumCount: integer('medium_count').notNull().default(0),
		lowCount: integer('low_count').notNull().default(0),
		errorMessage: text('error_message'),
		shareToken: text('share_token').unique(),
		sharedAt: timestamp('shared_at'),
		shareExpiresAt: timestamp('share_expires_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		index('questionnaires_org_id_idx').on(table.organizationId),
		index('questionnaires_deal_id_idx').on(table.dealId)
	]
);

// ─── Questionnaire Questions ──────────────────────────────────────────────────

export const questionnaireQuestions = pgTable(
	'questionnaire_questions',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		questionnaireId: uuid('questionnaire_id')
			.notNull()
			.references(() => questionnaires.id),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id),
		sectionName: text('section_name'),
		questionNumber: text('question_number'),
		questionText: text('question_text').notNull(),
		sourceLocation: jsonb('source_location').$type<{
			sheetName: string;
			questionCell: string;
			answerCell: string | null;
		}>(),
		domain: text('domain'),
		mappedControlIds: jsonb('mapped_control_ids').$type<string[]>().default([]),
		mappedPolicyIds: jsonb('mapped_policy_ids').$type<string[]>().default([]),
		citations:
			jsonb('citations').$type<
				Array<{ sourceType: string; sourceId: string; sourceTitle: string; excerpt: string }>
			>(),
		generatedAnswer: text('generated_answer'),
		confidence: text('confidence'), // 'high' | 'medium' | 'low' | 'gap' | null = unprocessed
		gapReason: text('gap_reason'),
		gapRemediation: text('gap_remediation'),
		userEditedAnswer: text('user_edited_answer'),
		order: integer('order').notNull().default(0),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		index('qq_questionnaire_id_idx').on(table.questionnaireId),
		index('qq_org_id_idx').on(table.organizationId)
	]
);

// ─── Answer Library ─────────────────────────────────────────────────────────

export type AnswerLibraryStatus = 'approved' | 'stale';

/**
 * Human-approved answers harvested from finished security reviews. These are
 * company claims with provenance, not unreviewed AI output.
 */
export const answerLibraryEntries = pgTable(
	'answer_library_entries',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id, { onDelete: 'cascade' }),
		questionText: text('question_text').notNull(),
		answer: text('answer').notNull(),
		scope: text('scope').notNull().default('Company-wide'),
		status: text('status').$type<AnswerLibraryStatus>().notNull().default('approved'),
		citations:
			jsonb('citations').$type<
				Array<{ sourceType: string; sourceId: string; sourceTitle: string; excerpt: string }>
			>(),
		sourceQuestionnaireId: uuid('source_questionnaire_id').references(() => questionnaires.id, {
			onDelete: 'set null'
		}),
		sourceQuestionId: uuid('source_question_id').references(() => questionnaireQuestions.id, {
			onDelete: 'set null'
		}),
		reviewedBy: text('reviewed_by').references(() => user.id, { onDelete: 'set null' }),
		reviewedAt: timestamp('reviewed_at').notNull().defaultNow(),
		expiresAt: timestamp('expires_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		uniqueIndex('answer_library_source_question_unique_idx').on(
			table.organizationId,
			table.sourceQuestionId
		),
		index('answer_library_org_status_idx').on(table.organizationId, table.status),
		index('answer_library_org_updated_idx').on(table.organizationId, table.updatedAt)
	]
);

// ─── Questionnaire Processing Jobs ───────────────────────────────────────────

export const questionnaireProcessingJobs = pgTable(
	'questionnaire_processing_jobs',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		questionnaireId: uuid('questionnaire_id')
			.notNull()
			.references(() => questionnaires.id, { onDelete: 'cascade' }),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id),
		kind: text('kind').notNull().default('initial'), // 'initial' | 'reprocess'
		status: text('status').notNull().default('queued'), // 'queued' | 'running' | 'retry_wait' | 'completed' | 'failed'
		attemptCount: integer('attempt_count').notNull().default(0),
		maxAttempts: integer('max_attempts').notNull().default(5),
		nextAttemptAt: timestamp('next_attempt_at').notNull().defaultNow(),
		lockedAt: timestamp('locked_at'),
		lockToken: uuid('lock_token'),
		lastError: text('last_error'),
		completedAt: timestamp('completed_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		uniqueIndex('questionnaire_processing_jobs_questionnaire_unique_idx').on(table.questionnaireId),
		index('questionnaire_processing_jobs_ready_idx').on(table.status, table.nextAttemptAt)
	]
);

// ─── Policy Versions ──────────────────────────────────────────────────────────

export const policyVersions = pgTable('policy_versions', {
	id: uuid('id').primaryKey().defaultRandom(),
	policyId: uuid('policy_id')
		.notNull()
		.references(() => policies.id, { onDelete: 'cascade' }),
	organizationId: uuid('organization_id')
		.notNull()
		.references(() => organizations.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	savedAt: timestamp('saved_at').notNull().defaultNow(),
	savedBy: text('saved_by').notNull()
});

// ─── Consulting Requests ─────────────────────────────────────────────────────

export const consultingRequests = pgTable('consulting_requests', {
	id: uuid('id').primaryKey().defaultRandom(),
	organizationId: uuid('organization_id').references(() => organizations.id),
	name: text('name').notNull(),
	email: text('email').notNull(),
	company: text('company'),
	topic: text('topic').notNull(),
	message: text('message'),
	status: text('status').notNull().default('new'), // 'new' | 'contacted' | 'closed'
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// ─── Rate Limit Counters ─────────────────────────────────────────────────────

export const rateLimitCounters = pgTable(
	'rate_limit_counters',
	{
		key: text('key').notNull(),
		windowStart: timestamp('window_start').notNull(),
		count: integer('count').notNull().default(0)
	},
	(table) => [
		primaryKey({ columns: [table.key, table.windowStart] }),
		index('rate_limit_window_idx').on(table.windowStart)
	]
);

// ─── Re-export auth schema ────────────────────────────────────────────────────

export * from './auth.schema';
