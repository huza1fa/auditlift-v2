import {
	pgTable,
	text,
	integer,
	boolean,
	timestamp,
	uuid,
	jsonb,
	uniqueIndex
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
	trialEndsAt: timestamp('trial_ends_at'),
	onboardingComplete: boolean('onboarding_complete').default(false),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ─── Subscriptions ────────────────────────────────────────────────────────────

export const subscriptions = pgTable('subscriptions', {
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
});

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

export const organizationFrameworks = pgTable('organization_frameworks', {
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
});

// ─── Evidence ─────────────────────────────────────────────────────────────────

export const evidence = pgTable('evidence', {
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
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ─── Policies ─────────────────────────────────────────────────────────────────

export const policies = pgTable('policies', {
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
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

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

export const userOrganizations = pgTable('user_organizations', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id').notNull(), // Better Auth user.id is text
	organizationId: uuid('organization_id')
		.notNull()
		.references(() => organizations.id),
	role: text('role').notNull().default('member'), // 'owner' | 'admin' | 'member' | 'viewer'
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

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

// ─── Re-export auth schema ────────────────────────────────────────────────────

export * from './auth.schema';
