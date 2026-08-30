import { db } from './db';
import { activityLogs } from './db/schema';

export type ActivityAction =
	| 'evidence.upload'
	| 'evidence.delete'
	| 'evidence.download'
	| 'policy.generate'
	| 'policy.edit'
	| 'policy.archive'
	| 'policy.download'
	| 'policy.restore'
	| 'questionnaire.upload'
	| 'questionnaire.delete'
	| 'questionnaire.share'
	| 'questionnaire.unshare'
	| 'questionnaire.export'
	| 'questionnaire.deal_assign'
	| 'deal.create'
	| 'deal.update'
	| 'answer_library.approve'
	| 'export.created'
	| 'team.invited'
	| 'team.role_changed'
	| 'team.removed'
	| 'team.joined'
	| 'framework.activated'
	| 'framework.deactivated';

export type ActivityEntityType =
	| 'evidence'
	| 'policy'
	| 'questionnaire'
	| 'export'
	| 'user'
	| 'framework'
	| 'deal'
	| 'answer_library_entry';

export async function logActivity(opts: {
	organizationId: string;
	userId: string;
	userName?: string | null;
	action: ActivityAction;
	entityType: ActivityEntityType;
	entityId: string;
	entityName?: string | null;
	controlCode?: string | null;
	details?: string | null;
}): Promise<void> {
	try {
		await db.insert(activityLogs).values({
			organizationId: opts.organizationId,
			userId: opts.userId,
			userName: opts.userName ?? null,
			action: opts.action,
			entityType: opts.entityType,
			entityId: opts.entityId,
			entityName: opts.entityName ?? null,
			controlCode: opts.controlCode ?? null,
			details: opts.details ?? null
		});
	} catch (err) {
		console.error('[activity] Failed to log activity:', err);
	}
}
