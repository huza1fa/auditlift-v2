CREATE TABLE "questionnaire_processing_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"questionnaire_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"kind" text DEFAULT 'initial' NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 5 NOT NULL,
	"next_attempt_at" timestamp DEFAULT now() NOT NULL,
	"locked_at" timestamp,
	"lock_token" uuid,
	"last_error" text,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "questionnaire_processing_jobs" ADD CONSTRAINT "questionnaire_processing_jobs_questionnaire_id_questionnaires_id_fk" FOREIGN KEY ("questionnaire_id") REFERENCES "public"."questionnaires"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionnaire_processing_jobs" ADD CONSTRAINT "questionnaire_processing_jobs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "questionnaire_processing_jobs_questionnaire_unique_idx" ON "questionnaire_processing_jobs" USING btree ("questionnaire_id");--> statement-breakpoint
CREATE INDEX "questionnaire_processing_jobs_ready_idx" ON "questionnaire_processing_jobs" USING btree ("status","next_attempt_at");--> statement-breakpoint
INSERT INTO "questionnaire_processing_jobs" ("questionnaire_id", "organization_id", "kind", "status")
SELECT "id", "organization_id", 'initial', 'queued'
FROM "questionnaires"
WHERE "status" = 'processing'
ON CONFLICT ("questionnaire_id") DO NOTHING;--> statement-breakpoint
DELETE FROM "user_organizations"
WHERE "id" IN (
	SELECT "id"
	FROM (
		SELECT
			"id",
			row_number() OVER (
				PARTITION BY "user_id", "organization_id"
				ORDER BY "created_at", "id"
			) AS "row_number"
		FROM "user_organizations"
	) AS "duplicate_memberships"
	WHERE "row_number" > 1
);--> statement-breakpoint
CREATE UNIQUE INDEX "uo_user_organization_unique_idx" ON "user_organizations" USING btree ("user_id","organization_id");
