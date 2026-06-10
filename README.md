# AuditLift

> Deal enablement and compliance foundation tool for pre-compliance startups.
> Close enterprise deals faster by answering security questionnaires intelligently.
> Build SOC2/ISO27001 readiness as a natural byproduct of winning those deals.

**Live URL:** [https://auditlift.app](https://auditlift.app)

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

> **Primary platform: AWS (us-east-1, account 676799697185)**

| Component              | Service                                  | Details                                                         |
| ---------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| **App Hosting**        | AWS Elastic Beanstalk (Docker on AL2023) | Single-instance t3.micro, no ALB                                |
| **Container Registry** | Amazon ECR                               | `676799697185.dkr.ecr.us-east-1.amazonaws.com/auditlift:latest` |
| **Database**           | Amazon RDS (PostgreSQL 16)               | db.t3.micro, Single-AZ, SSL required                            |
| **Object Storage**     | Amazon S3                                | `auditlift-storage-676799697185-us-east-1`                      |
| **Secrets**            | AWS SSM Parameter Store                  | `/prod/app/*` as `SecureString`                                 |
| **DNS**                | Cloudflare (Porkbun registrar)           | CNAME → Beanstalk, SSL Flexible                                 |
| **CDN/SSL**            | Cloudflare                               | Flexible SSL termination (HTTP origin)                          |
| **Logging**            | CloudWatch Logs                          | App stdout, nginx, eb-engine                                    |

### Deployment Flow

1. **Build** Docker image locally:

   ```bash
   docker build --platform linux/amd64 -t auditlift:latest .
   ```

2. **Push** to ECR:

   ```bash
   docker tag auditlift:latest 676799697185.dkr.ecr.us-east-1.amazonaws.com/auditlift:latest
   docker push 676799697185.dkr.ecr.us-east-1.amazonaws.com/auditlift:latest
   ```

3. **Create** application version from `Dockerrun.aws.json` (references `:latest` image)

4. **Deploy** to Beanstalk environment `auditlift-prod`

5. Beanstalk pulls image, starts container on port 3000, nginx proxies requests

### Known Infrastructure Quirks

- **Nginx proxy buffers**: Better Auth sends large `Set-Cookie` headers. We fix this via `.ebextensions/proxy.config` in every source bundle (sets `proxy_buffer_size 128k; proxy_buffers 4 256k;`). Without this, social sign-in returns `502`.
- **Single-instance Beanstalk**: No ALB = cost savings (~$16/mo), but no detailed health checks. Health shows "Grey/No Data" during deployments.
- **RDS SSL**: Required. Connection uses `ssl: { rejectUnauthorized: false }` and `?ssl=require` in `DATABASE_URL`.
- **S3 IAM mode**: In production, the S3 client uses the EC2 instance profile (no explicit access keys). In dev, set `BUCKET_ENDPOINT` for S3-compatible storage.

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
