import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required to prepare migrations.');

const sql = postgres(databaseUrl, {
	max: 1,
	ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false }
});

try {
	const [state] = await sql`
		SELECT
			to_regclass('public.controls') AS controls_table,
			to_regclass('public.consulting_requests') AS consulting_requests_table,
			to_regclass('drizzle.__drizzle_migrations') AS migrations_table
	`;

	const [{ count: migrationCount }] = state.migrations_table
		? await sql`SELECT count(*)::integer AS count FROM drizzle.__drizzle_migrations`
		: [{ count: 0 }];

	if (!state.controls_table || migrationCount > 0) {
		// The database is new, or already has an applied migration history.
	} else if (!state.consulting_requests_table) {
		throw new Error(
			'Existing database has application tables but is not at the known pre-migration schema. Refusing to infer its migration baseline.'
		);
	} else {
		const journal = JSON.parse(await readFile('/app/drizzle/meta/_journal.json', 'utf8'));
		const legacyEntry = journal.entries.find((entry) => entry.tag === '0010_amazing_calypso');
		if (!legacyEntry) {
			throw new Error('Legacy migration 0010_amazing_calypso is missing from the journal.');
		}

		const migrationSql = await readFile(`/app/drizzle/${legacyEntry.tag}.sql`, 'utf8');
		const hash = createHash('sha256').update(migrationSql).digest('hex');

		await sql.unsafe('CREATE SCHEMA IF NOT EXISTS drizzle');
		await sql.unsafe(`
			CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at bigint
			)
		`);
		await sql`
			INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
			VALUES (${hash}, ${legacyEntry.when})
		`;

		console.log('Baselined the existing Lightsail database through migration 0010.');
	}
} finally {
	await sql.end();
}
