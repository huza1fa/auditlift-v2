ALTER TABLE "questionnaires" ADD COLUMN "share_token" text;--> statement-breakpoint
ALTER TABLE "questionnaires" ADD COLUMN "shared_at" timestamp;--> statement-breakpoint
ALTER TABLE "questionnaires" ADD CONSTRAINT "questionnaires_share_token_unique" UNIQUE("share_token");