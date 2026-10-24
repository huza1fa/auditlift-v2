import { error, json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { answerLibraryEntries } from '$lib/server/db/schema';
import { requireActiveOrganizationRole } from '$lib/server/auth-utils';
import { checkRateLimit } from '$lib/server/rate-limit';
import { logActivity } from '$lib/server/activity';
import { answerRevision } from '$lib/server/answer-freshness';
import { loadKnowledgeFreshness } from '$lib/server/knowledge-freshness';
import {
	ReviewAnswerSchema,
	selectReviewedCitations,
	quotesMatchSources
} from '$lib/server/answer-review';

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	const { organizationId, userId, userEmail } = await requireActiveOrganizationRole(
		locals,
		'admin',
		'Only admins and owners can review reusable answers'
	);
	if (!z.string().uuid().safeParse(params.id).success) throw error(400, 'Invalid answer ID.');
	if (!(await checkRateLimit(`answer-review:${organizationId}:${userId}`, 30, 60_000))) {
		throw error(429, 'Too many answer reviews. Please try again shortly.');
	}
	const parsed = ReviewAnswerSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success)
		throw error(400, 'Invalid review details. Confirm the answer and selected sources.');
	const input = parsed.data;
	const entry = await db.transaction(async (tx) => {
		const [existing] = await tx
			.select()
			.from(answerLibraryEntries)
			.where(
				and(
					eq(answerLibraryEntries.id, params.id),
					eq(answerLibraryEntries.organizationId, organizationId)
				)
			)
			.for('update');
		if (!existing) throw error(404, 'Answer not found.');
		if (answerRevision(existing) !== input.revision) {
			throw error(409, 'This answer was changed by another reviewer. Reload before reviewing it.');
		}
		const now = new Date();
		let updates: Partial<typeof answerLibraryEntries.$inferInsert> = {
			status: 'retired',
			updatedAt: now
		};
		if (input.action === 'approve') {
			const expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
			if (expiresAt && expiresAt <= now) throw error(400, 'Choose a future review date.');
			const citations = selectReviewedCitations(existing.citations, input);
			if (!citations) throw error(400, 'Invalid source selection or missing supporting quote.');
			const context = await loadKnowledgeFreshness(organizationId, tx);
			if (context.revision !== input.sourceRevision)
				throw error(
					409,
					'Sources changed while you were reviewing. Reload and check the latest sources.'
				);
			if (context.dependsOn(citations, existing.id))
				throw error(400, 'An answer cannot depend on itself. Remove the circular source.');
			if (!quotesMatchSources(citations, context.reviewSources(citations)))
				throw error(
					409,
					'Each selected citation must quote its current, available source. Update the supporting quote or remove the source.'
				);
			const stamped = context.stamp(citations);
			if (context.citationIssues(stamped).length) {
				throw error(
					409,
					'A selected source is unavailable, unverified, or needs review. Review it first or explicitly remove it.'
				);
			}
			updates = {
				status: 'approved',
				answer: input.answer,
				scope: input.scope,
				expiresAt,
				citations: stamped,
				reviewedBy: userId,
				reviewedAt: now,
				updatedAt: now
			};
		}
		const [updated] = await tx
			.update(answerLibraryEntries)
			.set(updates)
			.where(
				and(
					eq(answerLibraryEntries.id, existing.id),
					eq(answerLibraryEntries.organizationId, organizationId)
				)
			)
			.returning();
		return updated;
	});
	await logActivity({
		organizationId,
		userId,
		userName: locals.session!.user.name ?? userEmail,
		action: `answer_library.${input.action}`,
		entityType: 'answer_library_entry',
		entityId: entry.id,
		entityName: entry.questionText.slice(0, 120),
		details:
			input.action === 'approve'
				? 'Reviewed answer and current sources for reuse'
				: 'Retired answer from reuse'
	});
	return json({ entry });
};
