DELETE FROM "organization_frameworks"
WHERE "id" IN (
	SELECT "id"
	FROM (
		SELECT
			"id",
			row_number() OVER (
				PARTITION BY "organization_id", "framework_id"
				ORDER BY "activated_at", "created_at", "id"
			) AS "row_number"
		FROM "organization_frameworks"
	) AS "duplicate_frameworks"
	WHERE "row_number" > 1
);
--> statement-breakpoint
CREATE UNIQUE INDEX "organization_frameworks_org_framework_unique_idx" ON "organization_frameworks" USING btree ("organization_id","framework_id");
