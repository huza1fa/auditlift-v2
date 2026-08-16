CREATE TABLE "organization_facts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"category" text NOT NULL,
	"label" text NOT NULL,
	"value" text NOT NULL,
	"source" text DEFAULT 'manual' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"source_detail" text,
	"created_by" text,
	"updated_by" text,
	"reviewed_by" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "organization_facts_source_check" CHECK ("organization_facts"."source" in ('manual', 'system')),
	CONSTRAINT "organization_facts_status_check" CHECK ("organization_facts"."status" in ('pending', 'verified'))
);
--> statement-breakpoint
ALTER TABLE "organization_facts" ADD CONSTRAINT "organization_facts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_facts" ADD CONSTRAINT "organization_facts_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_facts" ADD CONSTRAINT "organization_facts_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_facts" ADD CONSTRAINT "organization_facts_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "organization_facts_org_category_label_unique_idx" ON "organization_facts" USING btree ("organization_id","category","label");--> statement-breakpoint
CREATE INDEX "organization_facts_org_status_idx" ON "organization_facts" USING btree ("organization_id","status");