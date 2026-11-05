# AuditLift

> Buyer security-response workspace for early-stage B2B SaaS teams.
> Return enterprise security questionnaires with cited, defensible answers.
> Build an approved answer base and compliance foundation as a byproduct of winning deals.

> [!NOTE]
> **AuditLift has been shut down.** The hosted service at auditlift.app is no longer running, and this repository is
> published as an open-source reference. Read about why in
> [Closing AuditLift](https://huza1fa.github.io/writing/closing-auditlift/).

**Search discovery:** See [SEO and AI search discovery](docs/search-discovery.md) for marketing content sources, crawler rules, and the post-deployment indexing checklist.

**Answer freshness:** See [Answer freshness and review](docs/answer-freshness.md) for source-change detection, human review safeguards, rollout behavior, and verification.

---

## What is AuditLift?

AuditLift targets founders and ops leads at early-stage / MVP-phase startups who
are trying to close enterprise deals with larger organisations that require
security questionnaires, compliance frameworks (SOC2, ISO27001), and formal
policies — but who have no compliance budget, no dedicated security team, and
no time to do this from scratch.

**The core insight: the work is shared.**
Answering a security questionnaire, generating a policy, and satisfying a SOC2
control are often the same underlying work, done once, expressed differently.
AuditLift makes that connection visible and automatic.

## User Journey

1. Founder receives a security questionnaire from an enterprise prospect
2. Uploads it → AI drafts answers from existing policies + controls in minutes
3. Gaps trigger policy generation — each policy also satisfies framework controls
4. After the deal closes: "You're now 45% SOC2 ready as a side effect of winning this deal"
5. When the time is right, they formalise toward full certification

## Tech Stack

| Layer         | Technology                                                  |
| ------------- | ----------------------------------------------------------- |
| **Frontend**  | SvelteKit + Svelte 5 (runes), TailwindCSS, Prettier         |
| **Backend**   | SvelteKit server routes (+server.ts / +page.server.ts)      |
| **Database**  | PostgreSQL 16 (AWS RDS) + Drizzle ORM                       |
| **Auth**      | Better Auth (email/password + Google OAuth + GitHub OAuth)  |
| **i18n**      | Paraglide                                                   |
| **Storage**   | AWS S3                                                      |
| **Payments**  | Stripe (monthly subscription + 10-day trial)                |
| **AI**        | OpenRouter API for policy generation                        |
| **Email**     | Resend                                                      |
| **Analytics** | PostHog (client + server-side tracking, session recordings) |

## Infrastructure

> **Primary platform: AWS (us-east-1, account <AWS_ACCOUNT_ID>)**

| Component              | Service                        | Details                                                         |
| ---------------------- | ------------------------------ | --------------------------------------------------------------- |
| **App Hosting**        | AWS Lightsail VM               | Docker Compose app stack with a host reverse proxy              |
| **Container Registry** | Amazon ECR                     | Immutable `sha-<commit>` images plus the moving `main` tag      |
| **Database**           | PostgreSQL 16                  | Compose `db` service with a persistent Docker volume            |
| **Object Storage**     | Amazon S3                      | `auditlift-storage-<AWS_ACCOUNT_ID>-us-east-1`                  |
| **Secrets**            | VM environment files           | `/etc/auditlift/app.env` and `/etc/auditlift/db.env`, mode 0600 |
| **DNS/CDN/SSL**        | Cloudflare (Porkbun registrar) | Points to the Lightsail VM; TLS terminates upstream             |
| **Logging**            | Docker Compose                 | `docker compose logs` on the Lightsail VM                       |

### Deployment Flow

1. GitHub Actions validates the Compose configuration, builds a Linux AMD64 image, and publishes immutable ECR tags.
2. The workflow streams the selected image to the Lightsail VM over pinned-host-key SSH and installs the Compose, Caddy, and scheduler files under `/opt/auditlift/deploy/lightsail/`.
3. Compose runs the Drizzle migrations before recreating the app. The app is bound to `127.0.0.1:3000`; the VM's reverse proxy accepts public HTTP traffic.
4. The `questionnaire-scheduler` Compose service starts after app health checks and invokes the authenticated internal job endpoint. It polls the durable queue every 15 seconds when empty and resumes work after deployments or restarts. Do not add a host cron job or external scheduler.

See [`deploy/lightsail/README.md`](deploy/lightsail/README.md) for VM setup, deployment secrets, and rollback instructions.

### Known Infrastructure Quirks

- **Migrations**: Deployments fail before the app is recreated if Drizzle migrations fail.
- **Async processing**: Questionnaire work is durable in PostgreSQL and handled only by the always-on Compose scheduler, not request handlers or cron.
- **S3 credentials**: Production uses the AWS credential chain. In development, set `BUCKET_ENDPOINT` for S3-compatible storage.

## Development

### Prerequisites

- [bun](https://bun.sh/) (package manager + runtime)
- Docker (for local builds)
- PostgreSQL (or use the RDS dev instance)

### Setup

```bash
# Install dependencies
bun install

# Copy env file and fill in values
cp .env.example .env

# Run database migrations
bun run db:migrate

# Start dev server
bun run dev
```

### Building for Production

```bash
# Build the SvelteKit app
bun run build

# Build Docker image
docker build --platform linux/amd64 -t auditlift:latest .
```

## Project Structure

```
src/
├── routes/
│   ├── (marketing)/          # Public pages (landing, pricing, login)
│   ├── onboarding/           # Onboarding wizard
│   ├── (app)/                # Auth-gated app shell
│   │   ├── dashboard/        # Deal + compliance overview
│   │   ├── questionnaires/   # Security questionnaire upload + AI answering
│   │   ├── frameworks/       # Framework selector (SOC2, PCI, ISO27001)
│   │   ├── controls/         # Control checklist per framework
│   │   ├── policies/         # Policy Generator
│   │   ├── evidence/         # Evidence Locker
│   │   ├── export/           # Auditor Export (PDF / ZIP)
│   │   └── settings/         # Org settings, billing, team
│   └── api/
│       ├── policies/generate/ # AI policy generation
│       ├── evidence/upload/   # File upload → S3
│       ├── score/             # Readiness score computation
│       └── webhooks/stripe/   # Stripe webhook handler
├── lib/
│   ├── components/           # Svelte components
│   └── server/
│       ├── db/               # Drizzle schema + queries
│       ├── billing.ts        # Stripe helpers
│       ├── storage.ts        # S3 upload/download helpers
│       └── score.ts          # Readiness score logic
```

## Analytics

AuditLift uses **PostHog** for product analytics. Both client-side and server-side tracking are enabled, with session recordings active.

### What's Tracked

**User Identification:**

- User ID, email, name, organization, plan status, trial days remaining

**Client-Side Events:**

- Onboarding step completion, intent selection, completion
- Questionnaire upload, delete, view, answer edits, AI improvements
- Policy generation, edit, download, archive, regenerate
- Dashboard quick actions (upload evidence, generate policy, export)
- Billing actions (checkout started, billing portal opened)
- Consulting modal opens and form submissions

**Server-Side Events:**

- `user_signed_up` — when onboarding completes for the first time
- `questionnaire_uploaded` — file format, question count, trial status
- `policy_generated` — policy type, framework, AI vs template
- `evidence_uploaded` — control code, file type, size
- `export_created` — number of policies, evidence, controls included
- `consulting_requested` — topic, logged-in status
- `subscription_created` — amount, currency, interval, MRR
- `subscription_updated` / `subscription_canceled` — status changes
- `payment_failed` / `payment_recovered` — Stripe billing events

### Organization Groups

PostHog groups are set by `organization_id`, so you can view feature adoption and revenue at the **company level** rather than just individual users.

### Session Recordings

Enabled in PostHog Cloud (free tier: 1M events/month, 5k recordings). Password fields are masked automatically.

## Key Features

- **Questionnaire Upload**: Drag-and-drop xlsx, csv, pdf, or docx. AI extracts questions and drafts answers.
- **Policy Generator**: Template-based markdown policy generation, editable inline.
- **Evidence Locker**: Upload evidence (screenshots, PDFs) and tag to controls.
- **Deal Readiness Score**: Per-questionnaire scoring showing how close you are to answering everything.
- **Framework Coverage**: Track SOC2/ISO27001 progress as a byproduct of questionnaire work.
- **Auditor Export**: One-click ZIP export of all controls, policies, and evidence.
- **Stripe Billing**: Subscription management with trial → paid upgrade flow.

## Security

- Multi-tenant by design — every query scoped to `organizationId`
- Auth sessions via secure HTTP-only cookies (`__Secure-better-auth.session_token`)
- CSRF protection enabled
- Stripe webhooks verified with signature
- File uploads validated (magic numbers, mime types, size limits)
- Rate limiting on upload endpoints

## License

Private — all rights reserved.
