import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { runQuestionnaireProcessingJobs } from '$lib/server/questionnaire-processor';

export const POST: RequestHandler = async ({ request, url }) => {
	const secret = env.QUESTIONNAIRE_JOB_SECRET;
	if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
		throw error(401, 'Unauthorized');
	}

	const requestedLimit = Number(url.searchParams.get('limit') ?? '1');
	const limit = Number.isInteger(requestedLimit) ? requestedLimit : 1;
	const processed = await runQuestionnaireProcessingJobs(limit);

	return json({ processed });
};
