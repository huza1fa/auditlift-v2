ALTER TABLE "organization_facts" ADD COLUMN "scope" text DEFAULT 'company' NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_facts" ADD COLUMN "questionnaire_id" uuid;--> statement-breakpoint
CREATE INDEX "organization_facts_org_scope_idx" ON "organization_facts" USING btree ("organization_id","scope","questionnaire_id");--> statement-breakpoint
ALTER TABLE "organization_facts" ADD CONSTRAINT "organization_facts_scope_check" CHECK ("organization_facts"."scope" in ('company', 'questionnaire'));