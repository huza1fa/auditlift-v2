# Answer freshness and review

## Behavior and rollout

- The server records a SHA-256 fingerprint in each citation's `sourceVersion` when drafting or explicitly reviewing an answer. Source content and availability are checked on reads, not through invalidation hooks or background AI calls.
- Approved library entries are excluded from both questionnaire and policy drafting when a source changes, is archived/deleted/unverified, or expires. Dependencies through other approved answers are checked transitively. Circular or excessively deep dependency chains fail closed.
- Fingerprints and the dependency graph are request-local. Sources are fetched with a fixed number of tenant-scoped queries, hashed once, and dependency results are memoized. Source/answer revisions protect concurrent human reviews. Source updates after drafting remain detectable because answers retain the versions actually supplied to drafting.
- Questionnaire-scoped facts cannot support company-wide library reuse or a different buyer's answers. Only the explicit `Company-wide` library scope is eligible for automatic reuse; arbitrary buyer-specific scope labels are not treated as reusable company knowledge. Controls are shared framework seed data; all other source queries are tenant-scoped.
- Older citations without fingerprints deliberately appear as **Needs review**. Do not backfill them from current sources: that would claim a review that never happened. Existing entries without citations remain explicit manual attestations, subject to status and expiry.
- New library approvals default to a 90-day re-review date. Admins/owners can set a future date or deliberately remove it on review.
- Reviews require explicit human confirmation. Selected citations must quote a current available source (whitespace is normalized); unavailable sources must be resolved or deliberately unchecked. Reapproval snapshots the new source versions. An answer cannot be approved using itself as a direct or indirect source.
- Source reviews do not rewrite questionnaire answers or silently change confidence scores. Admins/owners can explicitly review a questionnaire answer's sources. Members can still edit wording; viewers cannot sign off reviews. Trial-expired organizations remain read-only.
- Export warnings are checked server-side before reserving a trial export. Exporting anyway requires a token bound to the current sources and answers, and does not mark them reviewed. Tokens become invalid after a source/answer changes.
- No database migration is needed: citation fingerprints use the existing JSONB columns; library status already uses a text column. `stale` is an effective read-time state; it is not necessary to persist invalidation events.

This detects provenance changes, not semantic truth. A human must still verify that an answer is supported by its selected quotes and is appropriate for the buyer. Files already downloaded cannot be recalled.

## Pricing

`src/lib/pricing.ts` is the USD price source for marketing, structured data, in-app billing, and Stripe checkout:

- Starter: **$49/month** or **$490/year**.
- Growth: **$99/month** or **$990/year**.
- Annual billing is exactly ten monthly payments (two months free).

Stripe prices are immutable. The four configured price IDs remain product anchors. If their amount is still the old price, checkout resolves a new price on the same product using a deterministic lookup key and an idempotent create request. It verifies currency, amount, interval, interval count, billing scheme, and usage type before creating a checkout session. It never falls back to charging the old amount, and does not modify existing subscriptions or deactivate their prices. The Stripe API key needs price read/write permissions; otherwise checkout returns a temporary-unavailability error rather than an incorrect charge. Stripe behavior is covered by mocked API tests; live Stripe is not contacted by the verification suite.

## Verification

```sh
bun run test
bun run check
# Build requires the same configuration variables as the existing application.
bun run build
```

`scripts/verify-answer-freshness.ts` additionally exercises the real local HTTP handlers and PostgreSQL: approval, source changes, review quotes, concurrency, permissions, cross-tenant isolation, CSRF, expired access, retirement, and export acknowledgement/trial accounting.

Run it only against a disposable database named `auditlift_verify` on `localhost`/`127.0.0.1`, initialized from the current schema, and a local running app using that database. Set the app's `ORIGIN`, `BETTER_AUTH_SECRET`, and database configuration explicitly; disable external AI, analytics and email credentials. The script deliberately refuses remote URLs and never uses the application's `DATABASE_URL` implicitly.

```sh
TEST_DATABASE_URL='postgres://…@127.0.0.1:55432/auditlift_verify' \
VERIFY_BASE_URL='http://localhost:5178' \
VERIFY_AUTH_SECRET='<same local-only secret as the app>' \
bun run scripts/verify-answer-freshness.ts
```

Fixtures are left in the disposable database for browser verification. A generated local-only login is written to `/tmp/opencode/auditlift-freshness-local-fixture.json`. Remove the disposable database/container and stop the test app when finished.

### Existing fresh-database bootstrap limitation

The pre-existing migration history fails against an empty PostgreSQL database: an early migration declares a text `controls.framework_id` foreign key against a UUID `frameworks.id`. The existing `drizzle-kit push` also creates the composite policy foreign key before its supporting unique index on a first push. These are unrelated to this feature and do not affect already-migrated deployments. For local verification, initialize the disposable database from the current schema, create `policies_id_organization_unique_idx` on `(id, organization_id)` before retrying a first push if needed, and never use this workaround against production. Historical migrations are unchanged by this feature.
