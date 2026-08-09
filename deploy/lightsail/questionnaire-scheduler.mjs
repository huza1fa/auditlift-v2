const endpoint = 'http://app:3000/api/internal/questionnaire-jobs/run?limit=1';
const secret = process.env.QUESTIONNAIRE_JOB_SECRET;
const idleDelayMs = 15_000;
const failureDelayMs = 60_000;
const requestTimeoutMs = 15 * 60_000;
const retryDelaysMs = [1_000, 5_000];

if (!secret) {
	console.error('[questionnaire-scheduler] QUESTIONNAIRE_JOB_SECRET is not configured.');
	process.exit(1);
}

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const isRetryableStatus = (status) => status === 408 || status === 429 || status >= 500;

async function runJob() {
	let failure = 'network error';

	for (let attempt = 0; attempt <= retryDelaysMs.length; attempt++) {
		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: { authorization: `Bearer ${secret}` },
				signal: AbortSignal.timeout(requestTimeoutMs)
			});
			const body = await response.json().catch(() => null);

			if (response.ok) return body?.processed > 0;

			failure = `HTTP ${response.status}`;
			if (!isRetryableStatus(response.status)) break;
		} catch {
			failure = 'network error';
		}

		if (attempt < retryDelaysMs.length) await sleep(retryDelaysMs[attempt]);
	}

	console.error(
		`[questionnaire-scheduler] Request failed (${failure}); retrying in ${failureDelayMs / 1000} seconds.`
	);
	return null;
}

while (true) {
	const processed = await runJob();
	if (processed === true) continue;
	await sleep(processed === false ? idleDelayMs : failureDelayMs);
}
