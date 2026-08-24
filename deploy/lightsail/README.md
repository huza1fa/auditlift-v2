# Lightsail Deployment

The GitHub Actions workflow builds the application image, publishes it to ECR, and streams the exact image to the Lightsail VM. The VM runs the prebuilt image and never builds application code. Each deployment runs Drizzle migrations to completion before recreating the application container.

## VM Setup

Create these files on the VM with mode `0600`; do not commit them.

`/etc/auditlift/db.env`:

```dotenv
POSTGRES_DB=auditlift
POSTGRES_USER=auditlift
POSTGRES_PASSWORD=<url-safe-random-password>
```

`/etc/auditlift/app.env` contains production application configuration, including:

```dotenv
DATABASE_URL=postgres://auditlift:<url-safe-random-password>@db:5432/auditlift
DATABASE_SSL=false
PUBLIC_POSTHOG_KEY=<PostHog project token>
# Browser events are proxied through Caddy to avoid client-side tracker blocking.
PUBLIC_POSTHOG_HOST=https://auditlift.app/ingest
# Server events can go directly to PostHog rather than through the public proxy.
POSTHOG_HOST=https://us.i.posthog.com
QUESTIONNAIRE_JOB_SECRET=<long-random-secret>
```

### Temporary billing access overrides

An `active` subscription without a Stripe subscription ID is valid only through its recorded
`current_period_end`. For deliberate internal testing or support access, set
`subscriptions.access_override_until` to a specific future timestamp for that organization. The
override is time-bounded and should be cleared when it is no longer needed; do not add email-based
exceptions to application code.

Install Docker and Docker Compose on the VM. The workflow installs `docker-compose.yml` and the scheduler script at `/opt/auditlift/deploy/lightsail/` on every deployment.

The VM host must run a reverse proxy on port `80` that forwards to `127.0.0.1:3000`. The Compose stack binds the app only to that loopback address, so it is not exposed directly to the internet. Allow inbound TCP port `80` in the Lightsail networking rules and terminate TLS at an upstream CDN/load balancer.

## Questionnaire Job Scheduler

`questionnaire-scheduler` is an always-on Compose service. It starts after the app health check, calls `POST /api/internal/questionnaire-jobs/run?limit=1` over the private Docker network, and resumes queued work after a deployment, container restart, or VM restart. It runs another job immediately after successful work, polls an empty queue every 15 seconds, and retries transient network, timeout, `408`, `429`, and `5xx` failures twice before waiting 60 seconds.

Set `QUESTIONNAIRE_JOB_SECRET` in `/etc/auditlift/app.env`; it must match the endpoint's bearer-token secret. The scheduler uses this value only in an internal request header. It is not placed in the Compose file, command line, URL, or logs. The endpoint rejects every request without the bearer token.

The workflow installs `questionnaire-scheduler.mjs` with the Compose file on every deployment. Do not run a separate host cron job or external scheduler.

## GitHub Actions Setup

Add these repository secrets:

- `LIGHTSAIL_HOST`: the VM static public IP or hostname.
- `LIGHTSAIL_SSH_PRIVATE_KEY`: the private key authorized for the `ubuntu` user on the VM.
- `LIGHTSAIL_SSH_KNOWN_HOSTS`: the pinned OpenSSH `known_hosts` entry for `LIGHTSAIL_HOST`. Verify the VM host key fingerprint out of band before adding this secret. For example, retrieve `/etc/ssh/ssh_host_ed25519_key.pub` through trusted Lightsail console access and save it as `<LIGHTSAIL_HOST> <public-key>`; do not rely on workflow-time `ssh-keyscan`.

The workflow assumes `arn:aws:iam::676799697185:role/auditlift-github-actions`. Its GitHub OIDC trust and least-privilege ECR policy are in `iam/`; apply those files to the role before the first deployment. In GitHub, configure the `production` environment to allow deployments from the `main` branch only. The OIDC role trusts this protected environment.

Each push to `main` creates immutable `sha-<commit>` and moving `main` image tags. Deployment is serialized so two commits cannot deploy concurrently. Manual rollback tags must be valid ECR tags: 1-128 characters, beginning with a letter, number, or underscore, and otherwise containing only letters, numbers, underscores, periods, or hyphens. SSH uses the pinned host-key secret with `StrictHostKeyChecking=yes`.

## Rollback

Run the workflow manually and provide a prior `sha-<commit>` value for `image_tag`, or load a retained image and run:

```bash
sudo env APP_IMAGE=676799697185.dkr.ecr.us-east-1.amazonaws.com/auditlift:sha-<commit> \
	docker compose -f /opt/auditlift/deploy/lightsail/docker-compose.yml up -d --no-build --force-recreate --wait
```

The migration image contains `drizzle/`, `drizzle.config.ts`, and Drizzle Kit. Do not start `app` independently: Compose must first run the `migrate` service successfully.
