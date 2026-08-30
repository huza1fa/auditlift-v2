CREATE TABLE "answer_library_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"question_text" text NOT NULL,
	"answer" text NOT NULL,
	"scope" text DEFAULT 'Company-wide' NOT NULL,
	"status" text DEFAULT 'approved' NOT NULL,
	"citations" jsonb,
	"source_questionnaire_id" uuid,
	"source_question_id" uuid,
	"reviewed_by" text,
	"reviewed_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"customer_name" text NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"deadline_at" timestamp,
	"owner_id" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "deals_status_check" CHECK ("deals"."status" in ('active', 'submitted', 'won', 'lost', 'archived'))
);
--> statement-breakpoint
ALTER TABLE "questionnaires" ADD COLUMN "deal_id" uuid;--> statement-breakpoint
ALTER TABLE "answer_library_entries" ADD CONSTRAINT "answer_library_entries_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answer_library_entries" ADD CONSTRAINT "answer_library_entries_source_questionnaire_id_questionnaires_id_fk" FOREIGN KEY ("source_questionnaire_id") REFERENCES "public"."questionnaires"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answer_library_entries" ADD CONSTRAINT "answer_library_entries_source_question_id_questionnaire_questions_id_fk" FOREIGN KEY ("source_question_id") REFERENCES "public"."questionnaire_questions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answer_library_entries" ADD CONSTRAINT "answer_library_entries_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "answer_library_source_question_unique_idx" ON "answer_library_entries" USING btree ("organization_id","source_question_id");--> statement-breakpoint
CREATE INDEX "answer_library_org_status_idx" ON "answer_library_entries" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "answer_library_org_updated_idx" ON "answer_library_entries" USING btree ("organization_id","updated_at");--> statement-breakpoint
CREATE INDEX "deals_org_status_idx" ON "deals" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "deals_org_deadline_idx" ON "deals" USING btree ("organization_id","deadline_at");--> statement-breakpoint
ALTER TABLE "questionnaires" ADD CONSTRAINT "questionnaires_deal_id_deals_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."deals"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "questionnaires_deal_id_idx" ON "questionnaires" USING btree ("deal_id");