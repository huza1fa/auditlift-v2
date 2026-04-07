interface RateLimitEntry {
	count: number;
	windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 10 minutes to prevent memory leak
setInterval(
	() => {
		const now = Date.now();
		for (const [key, entry] of store.entries()) {
			if (now - entry.windowStart > 60 * 60 * 1000) {
				store.delete(key);
			}
		}
	},
	10 * 60 * 1000
);

/**
 * Returns true if the request should be allowed, false if rate limited.
 * @param key - unique identifier (e.g. orgId + endpoint)
 * @param limit - max requests per window
 * @param windowMs - window duration in milliseconds
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
	const now = Date.now();
	const entry = store.get(key);

	if (!entry || now - entry.windowStart > windowMs) {
		store.set(key, { count: 1, windowStart: now });
		return true;
	}

	if (entry.count >= limit) {
		return false;
	}

	entry.count++;
	return true;
}
