DROP INDEX "subscriptions_org_id_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "subscriptions_org_id_unique_idx" ON "subscriptions" USING btree ("organization_id");