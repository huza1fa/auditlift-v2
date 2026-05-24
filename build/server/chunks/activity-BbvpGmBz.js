import { d as db, t as activityLogs } from './index2-CrtZLkpF.js';

async function logActivity(opts) {
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
    console.error("[activity] Failed to log activity:", err);
  }
}

export { logActivity as l };
//# sourceMappingURL=activity-BbvpGmBz.js.map
