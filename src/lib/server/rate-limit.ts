import { sql, lt } from 'drizzle-orm';
import { db } from './db';
import { rateLimitCounters } from './db/schema';

/**
 * Returns true if the request should be allowed, false if rate limited.
 * Counters are persisted in PostgreSQL so limits survive restarts and are
 * shared across app instances. Fails open if the database is unavailable so
 * rate limiting can never take the product down.
 *
 * @param key - unique identifier (e.g. orgId + endpoint)
 * @param limit - max requests per window
 * @param windowMs - window duration in milliseconds
 */
export async function checkRateLimit(
	key: string,
	limit: number,
	windowMs: number
): Promise<boolean> {
	const now = Date.now();
	const windowStart = new Date(Math.floor(now / windowMs) * windowMs);

	try {
		const [row] = await db
			.insert(rateLimitCounters)
			.values({ key, windowStart, count: 1 })
			.onConflictDoUpdate({
				target: [rateLimitCounters.key, rateLimitCounters.windowStart],
				set: { count: sql`${rateLimitCounters.count} + 1` }
			})
			.returning({ count: rateLimitCounters.count });

		if (Math.random() < 0.02) {
			db.delete(rateLimitCounters)
				.where(lt(rateLimitCounters.windowStart, new Date(now - 2 * windowMs)))
				.catch(() => {});
		}

		return row.count <= limit;
	} catch (err) {
		console.error('[rate-limit] counter unavailable, failing open:', err);
		return true;
	}
}
