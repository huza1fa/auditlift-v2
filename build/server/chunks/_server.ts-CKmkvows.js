import { e as error } from './index-wpIsICWW.js';
import { d as db, q as questionnaires, i as and, e as eq } from './index2-BGADDK3r.js';
import { a as hasActiveAccess } from './billing-CuJKZCaE.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const GET = async ({ locals, params }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  if (!hasActiveAccess(locals.subscription, locals.organization?.trialEndsAt ?? null)) {
    throw error(402, "Trial expired. Upgrade to access questionnaires.");
  }
  const orgId = locals.organizationId;
  const { id } = params;
  const [questionnaire] = await db.select({ id: questionnaires.id, status: questionnaires.status }).from(questionnaires).where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId))).limit(1);
  if (!questionnaire) throw error(404, "Not found");
  const encode = (data) => new TextEncoder().encode(`data: ${JSON.stringify(data)}

`);
  if (questionnaire.status === "ready" || questionnaire.status === "error") {
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(encode({ status: questionnaire.status }));
        controller.close();
      }
    });
    return new Response(body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      }
    });
  }
  const stream = new ReadableStream({
    start(controller) {
      let intervalId = null;
      let attempts = 0;
      const MAX_ATTEMPTS = 45;
      function cleanup() {
        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
      intervalId = setInterval(async () => {
        attempts++;
        try {
          const [current] = await db.select({ status: questionnaires.status }).from(questionnaires).where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId))).limit(1);
          if (!current) {
            cleanup();
            controller.close();
            return;
          }
          controller.enqueue(encode({ status: current.status }));
          if (current.status === "ready" || current.status === "error" || attempts >= MAX_ATTEMPTS) {
            cleanup();
            controller.close();
          }
        } catch {
          cleanup();
          controller.close();
        }
      }, 2e3);
      return cleanup;
    },
    cancel() {
    }
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    }
  });
};

export { GET };
//# sourceMappingURL=_server.ts-CKmkvows.js.map
