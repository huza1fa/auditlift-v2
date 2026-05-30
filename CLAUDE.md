## Project Configuration

- **Language**: TypeScript
- **Package Manager**: bun
- **Add-ons**: prettier, tailwindcss, sveltekit-adapter, drizzle, better-auth, paraglide, mcp

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:
Find agents in .claud/agents

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

# Project: AuditLift

> Deal enablement and compliance foundation tool for pre-compliance startups.
> Close enterprise deals faster by answering security questionnaires intelligently.
> Build SOC2/ISO27001 readiness as a natural byproduct of winning those deals.

## Stack

- Frontend: SvelteKit + Svelte 5 (runes), TailwindCSS, Prettier
- Backend: SvelteKit server routes (+server.ts / +page.server.ts), MCP
- DB: Drizzle ORM + PostgreSQL
- Auth: Better Auth (email/password + Google OAuth)
- i18n: Paraglide
- File storage: (local in dev, S3-compatible in prod — e.g. Cloudflare R2)
- PDF export: (puppeteer or @react-pdf/renderer — TBD)
- Payments: Stripe (monthly subscription + 10-day trial)

---

## Product Context

AuditLift targets founders and ops leads at early-stage / MVP-phase startups who
are trying to close enterprise deals with larger organisations that require
security questionnaires, compliance frameworks (SOC2, ISO27001), and formal
policies — but who have no compliance budget, no dedicated security team, and
no time to do this from scratch.

**The core insight: the work is shared.**
Answering a security questionnaire, generating a policy, and satisfying a SOC2
control are often the same underlying work, done once, expressed differently.
AuditLift makes that connection visible and automatic.

**User journey:**

1. Founder receives a security questionnaire from an enterprise prospect
2. Uploads it → AI drafts answers from existing policies + controls in minutes
3. Gaps trigger policy generation — each policy also satisfies framework controls
4. After the deal closes: "You're now 45% SOC2 ready as a side effect of winning this deal"
5. When the time is right, they formalise toward full certification

**Core value props:**

- "Close this deal" — answer any security questionnaire in minutes with AI
- "Build as you sell" — every questionnaire + policy = real SOC2/ISO27001 progress
- "Know where you stand" — Deal Readiness Score per questionnaire + framework coverage %
- "Graduate when ready" — full SOC2/ISO27001 path when the business needs it
- vCISO review as premium upsell — human sign-off for high-stakes deals

**Positioning:** Not Vanta/Drata (those start from the audit). AuditLift starts from
the deal in front of the founder today, and compliance accumulates as a byproduct.

Pricing: 10-day free trial → monthly subscription.

---

## Domain Parallel Patterns

- **frontend agent**: Svelte components, pages, layouts, Paraglide strings, Tailwind
- **backend agent**: API routes, auth guards, Stripe webhooks, policy generation logic
- **database agent**: Drizzle schema, migrations, service functions

---

## Data Model Overview

Understand these core entities before writing any feature:

```
Organization         — tenant root (one per company)
  └── User           — members of the org (via Better Auth)
  └── Subscription   — Stripe sub, trial status, plan
  └── Framework      — selected compliance frameworks (SOC2, PCI, ISO27001)
      └── Control    — pre-seeded controls per framework (e.g. CC6.1)
          └── Evidence   — uploaded files/screenshots tagged to a control
          └── Policy     — generated or uploaded policy docs linked to controls
  └── ReadinessScore — computed % per framework, updated on evidence/policy change
```

Controls are **seeded** — they come preloaded per framework. Users do not create
controls, they complete them by uploading evidence and generating/attaching policies.

---

## Multi-Tenancy Rules

**This is a multi-tenant SaaS. Every DB query MUST be scoped to the current org.**

- Every protected route must resolve `organizationId` from the session first
- Every Drizzle query on tenant data must include `.where(eq(table.organizationId, orgId))`
- The database agent must add `organizationId` to every non-auth table
- Never return data across org boundaries — treat this like a security rule

```ts
// Pattern for every protected backend route:
const session = await auth.api.getSession({ headers: request.headers });
if (!session) throw error(401, 'Unauthorized');
const { organizationId } = session.user; // scoped from Better Auth
```

---

## Billing & Trial Rules

- New orgs get a 10-day trial on signup (set `trialEndsAt = now + 10 days`)
- After trial, access is gated behind an active Stripe subscription
- The backend agent must check subscription status on every protected API route:
  ```ts
  if (!hasActiveAccess(subscription)) throw error(402, 'Trial expired');
  ```
- Stripe webhooks live in `src/routes/api/webhooks/stripe/+server.ts`
- Never trust client-side trial/subscription state — always verify server-side

---

## Feature Modules & File Structure

```
src/
├── routes/
│   ├── (marketing)/          # Public landing, pricing, login — no auth needed
│   │   ├── +page.svelte
│   │   └── pricing/
│   ├── onboarding/           # Two-path onboarding wizard (see Onboarding Rules)
│   ├── (app)/                # Auth-gated app shell
│   │   ├── +layout.server.ts # Session + subscription gate for entire app
│   │   ├── dashboard/        # Deal + compliance overview (see Dashboard Rules)
│   │   ├── questionnaires/   # Security questionnaire upload + AI answering
│   │   │   └── [id]/         # Detail: questions, answers, gap remediation, coverage
│   │   ├── frameworks/       # Framework selector (SOC2, PCI, ISO27001)
│   │   ├── controls/         # Control checklist per framework
│   │   │   └── [controlId]/  # Control detail: explanation + evidence + policy
│   │   ├── policies/         # Policy Generator + list of generated policies
│   │   ├── evidence/         # Evidence Locker
│   │   ├── export/           # Auditor Export (PDF / ZIP)
│   │   └── settings/         # Org settings, billing, team members
│   └── api/
│       ├── policies/generate/ # AI/template policy generation endpoint
│       ├── evidence/upload/   # File upload → R2 storage
│       ├── score/             # Readiness score computation
│       └── webhooks/stripe/   # Stripe webhook handler
├── lib/
│   ├── components/
│   │   ├── controls/         # ControlCard, ControlChecklist, ProgressRing
│   │   ├── evidence/         # EvidenceUploader, EvidenceTag, EvidenceList
│   │   ├── policies/         # PolicyViewer, PolicyEditor
│   │   ├── score/            # ReadinessScore, BlockerList
│   │   └── ui/               # Shared: Button, Badge, Modal, Toast
│   └── server/
│       ├── db/
│       │   ├── schema.ts
│       │   ├── organizations.ts
│       │   ├── controls.ts
│       │   ├── evidence.ts
│       │   ├── policies.ts
│       │   └── subscriptions.ts
│       ├── billing.ts        # Stripe helpers, hasActiveAccess()
│       ├── storage.ts        # R2 upload/download helpers
│       └── score.ts          # Readiness score computation logic
```

---

## Policy Generation Rules

- Policy generator lives in `src/routes/api/policies/generate/+server.ts`
- Inputs: `{ companyName, stack, teamSize, framework, policyType }`
- Start with **template-based generation** (string interpolation into markdown templates)
- Templates live in `src/lib/server/policy-templates/` as `.md` files
- Output is stored as markdown in the `policies` DB table, editable by the user
- Do NOT call an external AI API for policy generation unless explicitly asked

---

## Evidence Locker Rules

- Files upload to R2 (or local `/uploads` in dev) via `src/routes/api/evidence/upload/`
- Store file metadata in DB (filename, size, mimeType, storageKey, controlId, orgId)
- Max file size: 10MB per file
- Allowed types: PDF, PNG, JPG, CSV, DOCX
- Evidence is tagged to a specific `controlId` on upload
- Do NOT build integrations (GitHub, AWS, etc.) — manual upload only for now

---

## Readiness Score Rules

- Score = (controls with at least 1 evidence OR attached policy) / total controls × 100
- Recompute and cache in `readinessScores` table after every evidence/policy change
- Surface blockers: controls with 0 evidence AND 0 policy = blocker
- Score is per framework, not global

---

## Auditor Export Rules

- Export generates a ZIP containing:
  ```
  AuditLift-Export-{orgName}-{date}/
  ├── control-mapping.csv       # Control ID, name, status, linked evidence
  ├── Policies/
  │   ├── security-policy.md
  │   ├── access-control-policy.md
  │   └── incident-response-policy.md
  └── Evidence/
      ├── CC6.1/
      │   └── screenshot-mfa.png
      └── CC7.2/
          └── incident-response-test.pdf
  ```
- Export endpoint: `src/routes/api/export/+server.ts`
- Use `archiver` npm package for ZIP generation
- Gate export behind active subscription (no export on trial)

---

## Onboarding Rules

The onboarding wizard is two-path and **questionnaire-first**. Steps 1–3 are shared;
step 4 branches based on the user's intent.

**Shared steps (all users):**

1. Company setup — name, website, industry → `POST /api/onboarding/organization`
2. Team size → `POST /api/onboarding/team`
3. Tech stack (multi-select) → `POST /api/onboarding/stack`

**Step 4 — Path choice:**

- **"I have a security questionnaire to answer"** (Path A — deal-first)
  - Complete onboarding immediately, no framework required
  - `POST /api/onboarding/complete` with `{ intent: 'questionnaire' }`
  - Redirect to `/questionnaires`
- **"I want to build my compliance foundation"** (Path B — compliance-first)
  - Show framework selection step → `POST /api/onboarding/framework`
  - Then completion → `POST /api/onboarding/complete` with `{ intent: 'compliance' }`
  - Redirect to `/dashboard`

Framework is **optional** for questionnaire-first users — they can add one later from the
Frameworks page. The questionnaire processor already handles zero-framework orgs gracefully.

After questionnaire processing, always show: _"This questionnaire covered X SOC2 controls
— want to continue toward SOC2 certification?"_ as a nudge toward framework adoption.

---

## Dashboard Rules

The dashboard leads with **deal enablement**, not compliance configuration.

**Layout (top to bottom):**

1. Header — "Welcome back, {name}"
2. Deal stats row — questionnaires answered, avg deal readiness %, policies generated
3. Active questionnaires — most recent 2–3 with deal readiness scores + links
4. Compliance coverage — framework coverage % computed from ALL work done
   (questionnaire mappedControlIds + policies + evidence combined)
5. Blockers — controls still needed for framework completion
6. Quick actions — Upload questionnaire, Generate policy, Add evidence

**The "coverage from all work" calculation:**

- For each org framework, count controls that have EITHER:
  - At least 1 evidence upload, OR
  - An attached policy, OR
  - Appeared as `mappedControlId` in any processed questionnaire question
- Show as: "X of Y SOC2 controls covered across all your work"

**Empty state (new user, no questionnaires, no policies):**
Show the two-option quick-start card:

- "I have a questionnaire to answer right now" → link to /questionnaires
- "I want to start building policies" → link to /policies

---

## Coverage Bridge Rules

Every questionnaire answer that maps to a framework control is compliance work done.
This connection must be surfaced everywhere:

- **Questionnaire detail page:** After processing, show a "Framework Coverage" section
  listing which frameworks were touched and how many controls were covered.
  Call `GET /api/questionnaires/[id]/coverage` — returns coverage grouped by framework.

- **Gap remediation CTAs:** When generating a policy to fix a gap, show:
  _"This also satisfies CC6.1, CC6.2 for SOC2"_ — so founders understand the dual value.

- **Policy page:** Show which framework controls each policy is linked to.

- **Coverage API shape:**
  ```ts
  // GET /api/questionnaires/[id]/coverage
  {
  	coverageByFramework: [
  		{
  			frameworkId: string,
  			frameworkName: string,
  			frameworkSlug: string,
  			controlsCovered: number,
  			totalControls: number,
  			coveragePct: number,
  			coveredControls: [{ id, code, title, category }]
  		}
  	];
  }
  ```

---

## Code Conventions

- Always use TypeScript
- Svelte 5 runes only (`$state`, `$derived`, `$effect`, `$props`)
- Never legacy `$:` syntax
- Server-only code in `src/lib/server/` only
- All user-facing strings via Paraglide `m.key()` functions
- Format with Prettier before finishing (`npx prettier --write .`)
- Multi-tenancy: every query scoped to `organizationId` — no exceptions
