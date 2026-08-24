ALTER TABLE "subscriptions" ADD COLUMN "access_override_until" timestamp;

-- Preserve the owner's intentional internal test access during this billing-rule migration.
-- This is a one-time, time-bounded data migration—not an application-level email exception.
UPDATE "subscriptions" AS subscription
SET "access_override_until" = CURRENT_TIMESTAMP + INTERVAL '90 days'
FROM "user_organizations" AS membership
INNER JOIN "user" AS account ON account."id" = membership."user_id"
WHERE membership."organization_id" = subscription."organization_id"
  AND lower(account."email") = 'huzaifaa.khalid97@gmail.com'
  AND subscription."status" = 'active'
  AND subscription."stripe_subscription_id" IS NULL
  AND (
    subscription."current_period_end" IS NULL
    OR subscription."current_period_end" <= CURRENT_TIMESTAMP
  );
