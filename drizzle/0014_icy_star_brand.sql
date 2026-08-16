CREATE UNIQUE INDEX "policies_id_organization_unique_idx" ON "policies" USING btree ("id","organization_id");--> statement-breakpoint
ALTER TABLE "policy_controls" ADD CONSTRAINT "policy_controls_policy_organization_fk" FOREIGN KEY ("policy_id","organization_id") REFERENCES "public"."policies"("id","organization_id") ON DELETE cascade ON UPDATE no action;
