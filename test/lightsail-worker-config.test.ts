import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

async function projectFile(path: string) {
	return readFile(resolve(root, path), 'utf8');
}

describe('Lightsail deployment and questionnaire worker configuration', () => {
	it('keeps the application private behind the VM host proxy', async () => {
		const compose = await projectFile('deploy/lightsail/docker-compose.yml');

		expect(compose).toMatch(/app:\n(?:.|\n)*?ports:\n\s+- '127\.0\.0\.1:3000:3000'/);
		expect(compose).not.toMatch(/\n\s+proxy:/);
	});

	it('runs immutable-image migrations before starting a healthy application', async () => {
		const [compose, dockerfile, baseline] = await Promise.all([
			projectFile('deploy/lightsail/docker-compose.yml'),
			projectFile('Dockerfile'),
			projectFile('deploy/lightsail/baseline-migrations.mjs')
		]);

		expect(compose).toMatch(/migrate:\n\s+image: \$\{APP_IMAGE:-lightsail-app:latest\}/);
		expect(compose).toContain('node /app/baseline-migrations.mjs');
		expect(compose).toContain('./node_modules/.bin/drizzle-kit migrate --config=drizzle.config.ts');
		expect(compose).toMatch(/migrate:\n(?:.|\n)*?db:\n\s+condition: service_healthy/);
		expect(compose).toMatch(
			/app:\n(?:.|\n)*?migrate:\n\s+condition: service_completed_successfully/
		);
		expect(dockerfile).toContain('COPY --from=builder /app/drizzle ./drizzle');
		expect(dockerfile).toContain('COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts');
		expect(dockerfile).toContain(
			'COPY --from=builder /app/deploy/lightsail/baseline-migrations.mjs ./baseline-migrations.mjs'
		);
		expect(dockerfile).toContain('USER sveltekit');
		expect(baseline).toContain("to_regclass('drizzle.__drizzle_migrations')");
		expect(baseline).toContain(
			'SELECT count(*)::integer AS count FROM drizzle.__drizzle_migrations'
		);
		expect(baseline).toContain("'0010_amazing_calypso'");
	});

	it('uses a durable, leased worker queue and validates deployment configuration', async () => {
		const [migration, processor, scheduler, workflow, uploadRoute] = await Promise.all([
			projectFile('drizzle/0011_durable_questionnaire_jobs.sql'),
			projectFile('src/lib/server/questionnaire-processor.ts'),
			projectFile('deploy/lightsail/questionnaire-scheduler.mjs'),
			projectFile('.github/workflows/deploy-lightsail.yml'),
			projectFile('src/routes/api/questionnaires/upload/+server.ts')
		]);

		expect(migration).toContain('CREATE TABLE "questionnaire_processing_jobs"');
		expect(migration).toContain('questionnaire_processing_jobs_ready_idx');
		expect(migration).toContain('questionnaire_processing_jobs_questionnaire_unique_idx');
		expect(processor).toContain(".for('update', { skipLocked: true })");
		expect(processor).toContain("eq(questionnaireProcessingJobs.status, 'retry_wait')");
		expect(processor).toContain('runQuestionnaireProcessingJobs(limit = 1)');
		expect(scheduler).toContain(
			"const endpoint = 'http://app:3000/api/internal/questionnaire-jobs/run?limit=1'"
		);
		expect(scheduler).toContain('authorization: `Bearer ${secret}`');
		expect(scheduler).toContain('const retryDelaysMs = [1_000, 5_000]');
		expect(scheduler).toContain('while (true)');
		expect(uploadRoute).toContain("kind: 'initial',");
		expect(uploadRoute).toContain("status: 'queued'");
		expect(workflow).toContain('docker compose -f deploy/lightsail/docker-compose.yml config -q');
		expect(workflow).toContain('caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile');
		expect(workflow).toContain('up -d --no-build --force-recreate --wait');
	});
});
