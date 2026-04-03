CREATE TABLE IF NOT EXISTS "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"user_name" text,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"entity_name" text,
	"control_code" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "readiness_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"framework_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"snapshot_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "evidence" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "organizations" ADD COLUMN "trial_reminder_sent_at" timestamp;
EXCEPTION WHEN duplicate_column THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "organizations" ADD COLUMN "trial_expired_email_sent_at" timestamp;
EXCEPTION WHEN duplicate_column THEN null;
END $$;--> statement-breakpoint
ALTER TABLE "policies" ADD COLUMN "archived_at" timestamp;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "readiness_snapshots" ADD CONSTRAINT "readiness_snapshots_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "readiness_snapshots" ADD CONSTRAINT "readiness_snapshots_framework_id_frameworks_id_fk" FOREIGN KEY ("framework_id") REFERENCES "public"."frameworks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;