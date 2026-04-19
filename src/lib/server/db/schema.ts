import {
	pgTable,
	text,
	integer,
	boolean,
	timestamp,
	uuid,
	jsonb,
	uniqueIndex,
	index
} from 'drizzle-orm/pg-core';

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
	onboardingComplete: boolean('onboarding_complete').default(false),
	trialReminderSentAt: timestamp('trial_reminder_sent_at'),
	trialExpiredEmailSentAt: timestamp('trial_expired_email_sent_at'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

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
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		index('subscriptions_org_id_idx').on(table.organizationId),
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
	(table) => [index('org_fw_org_id_idx').on(table.organizationId)]
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
		index('evidence_org_status_deleted_idx').on(
			table.organizationId,
			table.status,
			table.deletedAt
		)
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
		index('policies_org_archived_idx').on(table.organizationId, table.archivedAt),
		index('policies_control_org_idx').on(table.controlId, table.organizationId)
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
	(table) => [index('uo_user_id_idx').on(table.userId)]
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

// ─── Questionnaires ───────────────────────────────────────────────────────────

export const questionnaires = pgTable(
	'questionnaires',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id),
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
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [index('questionnaires_org_id_idx').on(table.organizationId)]
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
		domain: text('domain'),
		mappedControlIds: jsonb('mapped_control_ids').$type<string[]>().default([]),
		mappedPolicyIds: jsonb('mapped_policy_ids').$type<string[]>().default([]),
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

// ─── Re-export auth schema ────────────────────────────────────────────────────

export * from './auth.schema';
