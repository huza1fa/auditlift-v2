import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { pgTable, timestamp, text, boolean, jsonb, uuid, index as index$1, uniqueIndex, integer } from "drizzle-orm/pg-core";
import { b as private_env } from "./shared-server.js";
const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull()
});
const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" })
});
const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull()
});
const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at")
});
const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  domain: text("domain"),
  // e.g., 'company.com' - extracted from first user's email
  website: text("website"),
  industry: text("industry"),
  teamSize: text("team_size"),
  stack: jsonb("stack").$type(),
  dataTypes: jsonb("data_types").$type(),
  customerType: text("customer_type"),
  geoReach: text("geo_reach"),
  securityTools: jsonb("security_tools").$type(),
  productType: text("product_type"),
  trialEndsAt: timestamp("trial_ends_at"),
  onboardingComplete: boolean("onboarding_complete").default(false),
  trialReminderSentAt: timestamp("trial_reminder_sent_at"),
  trialExpiredEmailSentAt: timestamp("trial_expired_email_sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    status: text("status").notNull().default("trialing"),
    currentPeriodEnd: timestamp("current_period_end"),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
  },
  (table) => [
    index$1("subscriptions_org_id_idx").on(table.organizationId),
    index$1("subscriptions_stripe_sub_id_idx").on(table.stripeSubscriptionId)
  ]
);
const frameworks = pgTable("frameworks", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  recommended: boolean("recommended").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const controls = pgTable(
  "controls",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    frameworkId: uuid("framework_id").notNull().references(() => frameworks.id),
    code: text("code").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    whyItMatters: text("why_it_matters").notNull(),
    whatAuditorExpects: text("what_auditor_expects").notNull(),
    category: text("category").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
  },
  (table) => [uniqueIndex("controls_framework_code_idx").on(table.frameworkId, table.code)]
);
const organizationFrameworks = pgTable(
  "organization_frameworks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id),
    frameworkId: uuid("framework_id").notNull().references(() => frameworks.id),
    activatedAt: timestamp("activated_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
  },
  (table) => [index$1("org_fw_org_id_idx").on(table.organizationId)]
);
const evidence = pgTable(
  "evidence",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id),
    controlId: uuid("control_id").notNull().references(() => controls.id),
    filename: text("filename").notNull(),
    storageKey: text("storage_key").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    status: text("status").notNull().default("active"),
    // 'pending' | 'active'
    notes: text("notes"),
    uploadedBy: text("uploaded_by").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at")
  },
  (table) => [
    index$1("evidence_org_control_idx").on(table.organizationId, table.controlId),
    index$1("evidence_org_status_deleted_idx").on(
      table.organizationId,
      table.status,
      table.deletedAt
    )
  ]
);
const policies = pgTable(
  "policies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id),
    controlId: uuid("control_id").references(() => controls.id),
    frameworkId: uuid("framework_id").references(() => frameworks.id),
    type: text("type").notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    isCustom: boolean("is_custom").default(false).notNull(),
    customPrompt: text("custom_prompt"),
    generatedAt: timestamp("generated_at"),
    editedAt: timestamp("edited_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    archivedAt: timestamp("archived_at")
  },
  (table) => [
    index$1("policies_org_archived_idx").on(table.organizationId, table.archivedAt),
    index$1("policies_control_org_idx").on(table.controlId, table.organizationId)
  ]
);
const readinessScores = pgTable(
  "readiness_scores",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id),
    frameworkId: uuid("framework_id").notNull().references(() => frameworks.id),
    score: integer("score").notNull().default(0),
    blockerCount: integer("blocker_count").notNull().default(0),
    computedAt: timestamp("computed_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
  },
  (table) => [
    uniqueIndex("readiness_scores_org_framework_idx").on(table.organizationId, table.frameworkId)
  ]
);
const userOrganizations = pgTable(
  "user_organizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    // Better Auth user.id is text
    organizationId: uuid("organization_id").notNull().references(() => organizations.id),
    role: text("role").notNull().default("member"),
    // 'owner' | 'admin' | 'member' | 'viewer'
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
  },
  (table) => [index$1("uo_user_id_idx").on(table.userId)]
);
const organizationInvitations = pgTable("organization_invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  email: text("email").notNull(),
  role: text("role").notNull().default("member"),
  // 'admin' | 'member' | 'viewer'
  token: text("token").notNull().unique(),
  invitedBy: text("invited_by").notNull(),
  // userId
  status: text("status").notNull().default("pending"),
  // 'pending' | 'accepted' | 'declined'
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const activityLogs = pgTable(
  "activity_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id),
    userId: text("user_id").notNull(),
    userName: text("user_name"),
    action: text("action").notNull(),
    // 'evidence.upload' | 'evidence.delete' | 'policy.generate' | 'policy.edit'
    entityType: text("entity_type").notNull(),
    // 'evidence' | 'policy'
    entityId: text("entity_id").notNull(),
    entityName: text("entity_name"),
    controlCode: text("control_code"),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table) => [index$1("activity_org_created_idx").on(table.organizationId, table.createdAt)]
);
const readinessSnapshots = pgTable("readiness_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  frameworkId: uuid("framework_id").notNull().references(() => frameworks.id),
  score: integer("score").notNull(),
  snapshotAt: timestamp("snapshot_at").defaultNow().notNull()
});
const questionnaires = pgTable(
  "questionnaires",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id),
    filename: text("filename").notNull(),
    storageKey: text("storage_key").notNull(),
    sourceFormat: text("source_format").notNull(),
    // 'xlsx' | 'csv' | 'pdf' | 'docx'
    status: text("status").notNull().default("processing"),
    // 'processing' | 'ready' | 'error'
    totalQuestions: integer("total_questions").notNull().default(0),
    answeredCount: integer("answered_count").notNull().default(0),
    gapCount: integer("gap_count").notNull().default(0),
    dealReadinessScore: integer("deal_readiness_score").notNull().default(0),
    highCount: integer("high_count").notNull().default(0),
    mediumCount: integer("medium_count").notNull().default(0),
    lowCount: integer("low_count").notNull().default(0),
    errorMessage: text("error_message"),
    shareToken: text("share_token").unique(),
    sharedAt: timestamp("shared_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
  },
  (table) => [index$1("questionnaires_org_id_idx").on(table.organizationId)]
);
const questionnaireQuestions = pgTable(
  "questionnaire_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionnaireId: uuid("questionnaire_id").notNull().references(() => questionnaires.id),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id),
    sectionName: text("section_name"),
    questionNumber: text("question_number"),
    questionText: text("question_text").notNull(),
    domain: text("domain"),
    mappedControlIds: jsonb("mapped_control_ids").$type().default([]),
    mappedPolicyIds: jsonb("mapped_policy_ids").$type().default([]),
    generatedAnswer: text("generated_answer"),
    confidence: text("confidence"),
    // 'high' | 'medium' | 'low' | 'gap' | null = unprocessed
    gapReason: text("gap_reason"),
    gapRemediation: text("gap_remediation"),
    userEditedAnswer: text("user_edited_answer"),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
  },
  (table) => [
    index$1("qq_questionnaire_id_idx").on(table.questionnaireId),
    index$1("qq_org_id_idx").on(table.organizationId)
  ]
);
const policyVersions = pgTable("policy_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  policyId: uuid("policy_id").notNull().references(() => policies.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  savedAt: timestamp("saved_at").notNull().defaultNow(),
  savedBy: text("saved_by").notNull()
});
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  account,
  activityLogs,
  controls,
  evidence,
  frameworks,
  organizationFrameworks,
  organizationInvitations,
  organizations,
  policies,
  policyVersions,
  questionnaireQuestions,
  questionnaires,
  readinessScores,
  readinessSnapshots,
  session,
  subscriptions,
  user,
  userOrganizations,
  verification
}, Symbol.toStringTag, { value: "Module" }));
if (!private_env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
const client = postgres(private_env.DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10
});
const db = drizzle(client, { schema });
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  db
}, Symbol.toStringTag, { value: "Module" }));
export {
  organizationInvitations as a,
  organizations as b,
  controls as c,
  db as d,
  evidence as e,
  frameworks as f,
  policyVersions as g,
  activityLogs as h,
  questionnaireQuestions as i,
  schema as j,
  readinessSnapshots as k,
  user as l,
  index as m,
  organizationFrameworks as o,
  policies as p,
  questionnaires as q,
  readinessScores as r,
  subscriptions as s,
  userOrganizations as u
};
