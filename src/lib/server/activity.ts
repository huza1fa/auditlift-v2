import { db } from './db';
import { activityLogs } from './db/schema';

export type ActivityAction =
	| 'evidence.upload'
	| 'evidence.delete'
	| 'policy.generate'
	| 'policy.edit'
	| 'policy.archive';

export async function logActivity(opts: {
	organizationId: string;
	userId: string;
	userName?: string | null;
	action: ActivityAction;
	entityType: 'evidence' | 'policy';
	entityId: string;
	entityName?: string | null;
	controlCode?: string | null;
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
			controlCode: opts.controlCode ?? null
		});
	} catch (err) {
		console.error('[activity] Failed to log activity:', err);
	}
}
