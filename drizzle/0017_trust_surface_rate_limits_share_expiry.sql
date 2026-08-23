CREATE TABLE "rate_limit_counters" (
	"key" text NOT NULL,
	"window_start" timestamp NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "rate_limit_counters_key_window_start_pk" PRIMARY KEY("key","window_start")
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD COLUMN "details" text;--> statement-breakpoint
ALTER TABLE "questionnaires" ADD COLUMN "share_expires_at" timestamp;--> statement-breakpoint
CREATE INDEX "rate_limit_window_idx" ON "rate_limit_counters" USING btree ("window_start");