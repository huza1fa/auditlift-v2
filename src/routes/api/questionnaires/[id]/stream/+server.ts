import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { questionnaires } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireOrganizationRole } from '$lib/server/auth-utils';

export const GET: RequestHandler = async ({ locals, params }) => {
	const { organizationId: orgId } = await requireOrganizationRole(locals);
	const { id } = params;

	// Verify ownership before opening stream
	const [questionnaire] = await db
		.select({ id: questionnaires.id, status: questionnaires.status })
		.from(questionnaires)
		.where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId)))
		.limit(1);

	if (!questionnaire) throw error(404, 'Not found');

	const encode = (data: object) => new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);

	// If already in a terminal state, send one event and close immediately
	if (questionnaire.status === 'ready' || questionnaire.status === 'error') {
		const body = new ReadableStream({
			start(controller) {
				controller.enqueue(encode({ status: questionnaire.status }));
				controller.close();
			}
		});
		return new Response(body, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive'
			}
		});
	}

	// Stream status updates via polling the DB until terminal state or timeout
	let intervalId: ReturnType<typeof setInterval> | null = null;
	let closed = false;

	function cleanup() {
		if (intervalId !== null) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	const stream = new ReadableStream({
		start(controller) {
			let attempts = 0;
			const MAX_ATTEMPTS = 45; // 90 seconds max at 2s interval

			function safeClose() {
				cleanup();
				if (!closed) {
					closed = true;
					try {
						controller.close();
					} catch {
						// Already closed — ignore
					}
				}
			}

			intervalId = setInterval(async () => {
				if (closed) {
					cleanup();
					return;
				}
				attempts++;
				try {
					const [current] = await db
						.select({ status: questionnaires.status })
						.from(questionnaires)
						.where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId)))
						.limit(1);

					if (!current) {
						safeClose();
						return;
					}

					if (!closed) {
						controller.enqueue(encode({ status: current.status }));
					}

					if (
						current.status === 'ready' ||
						current.status === 'error' ||
						attempts >= MAX_ATTEMPTS
					) {
						safeClose();
					}
				} catch {
					safeClose();
				}
			}, 2000);
		},
		cancel() {
			closed = true;
			cleanup();
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
