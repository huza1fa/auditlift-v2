ALTER TABLE "organizations" ADD COLUMN "trial_questionnaire_exported_at" timestamp;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "trial_questionnaire_export_claim_id" uuid;