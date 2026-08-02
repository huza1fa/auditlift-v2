# Lightsail Deployment

The GitHub Actions workflow builds the application image, publishes it to ECR, and streams the exact image to the Lightsail VM. The VM runs the prebuilt image and never builds application code.

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
PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Install Docker and Docker Compose on the VM, then ensure this repository's `deploy/lightsail/docker-compose.yml` is present at `/opt/auditlift/deploy/lightsail/docker-compose.yml`.

## GitHub Actions Setup

Add these repository secrets:

- `LIGHTSAIL_HOST`: the VM static public IP or hostname.
- `LIGHTSAIL_SSH_PRIVATE_KEY`: the private key authorized for the `ubuntu` user on the VM.

The workflow assumes `arn:aws:iam::676799697185:role/auditlift-github-actions`. Its GitHub OIDC trust and least-privilege ECR policy are in `iam/`; apply those files to the role before the first deployment.

Each push to `main` creates immutable `sha-<commit>` and moving `main` image tags. Deployment is serialized so two commits cannot deploy concurrently.

## Rollback

Run the workflow manually and provide a prior `sha-<commit>` value for `image_tag`, or load a retained image and run:

```bash
sudo env APP_IMAGE=676799697185.dkr.ecr.us-east-1.amazonaws.com/auditlift:sha-<commit> \
	docker compose -f /opt/auditlift/deploy/lightsail/docker-compose.yml up -d --no-build --wait app
```
