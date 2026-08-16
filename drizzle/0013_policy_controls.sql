CREATE TABLE "policy_controls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"policy_id" uuid NOT NULL,
	"control_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "policy_controls" ADD CONSTRAINT "policy_controls_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policy_controls" ADD CONSTRAINT "policy_controls_policy_id_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policy_controls" ADD CONSTRAINT "policy_controls_control_id_controls_id_fk" FOREIGN KEY ("control_id") REFERENCES "public"."controls"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "policy_controls_policy_control_unique_idx" ON "policy_controls" USING btree ("policy_id","control_id");--> statement-breakpoint
CREATE INDEX "policy_controls_org_control_idx" ON "policy_controls" USING btree ("organization_id","control_id");--> statement-breakpoint
CREATE INDEX "policy_controls_org_policy_idx" ON "policy_controls" USING btree ("organization_id","policy_id");--> statement-breakpoint
INSERT INTO "policy_controls" ("organization_id", "policy_id", "control_id")
SELECT "organization_id", "id", "control_id"
FROM "policies"
WHERE "control_id" IS NOT NULL
ON CONFLICT ("policy_id", "control_id") DO NOTHING;
