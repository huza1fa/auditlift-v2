CREATE INDEX "activity_org_created_idx" ON "activity_logs" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "evidence_org_control_idx" ON "evidence" USING btree ("organization_id","control_id");--> statement-breakpoint
CREATE INDEX "evidence_org_status_deleted_idx" ON "evidence" USING btree ("organization_id","status","deleted_at");--> statement-breakpoint
CREATE INDEX "org_fw_org_id_idx" ON "organization_frameworks" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "policies_org_archived_idx" ON "policies" USING btree ("organization_id","archived_at");--> statement-breakpoint
CREATE INDEX "policies_control_org_idx" ON "policies" USING btree ("control_id","organization_id");--> statement-breakpoint
CREATE INDEX "qq_questionnaire_id_idx" ON "questionnaire_questions" USING btree ("questionnaire_id");--> statement-breakpoint
CREATE INDEX "qq_org_id_idx" ON "questionnaire_questions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "questionnaires_org_id_idx" ON "questionnaires" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "subscriptions_org_id_idx" ON "subscriptions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "subscriptions_stripe_sub_id_idx" ON "subscriptions" USING btree ("stripe_subscription_id");--> statement-breakpoint
CREATE INDEX "uo_user_id_idx" ON "user_organizations" USING btree ("user_id");