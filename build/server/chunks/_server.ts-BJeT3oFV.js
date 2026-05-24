import { e as error, j as json } from './index-wpIsICWW.js';
import { d as db, H as consultingRequests } from './index2-CrtZLkpF.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const POST = async ({ request, locals }) => {
  const body = await request.json();
  const { name, email, company, topic, message } = body;
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw error(400, "Name is required");
  }
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw error(400, "A valid email is required");
  }
  if (!topic || typeof topic !== "string") {
    throw error(400, "Topic is required");
  }
  const allowedTopics = [
    "questionnaire-help",
    "soc2-readiness",
    "iso27001-readiness",
    "vciso-advisory",
    "general-compliance",
    "other"
  ];
  if (!allowedTopics.includes(topic)) {
    throw error(400, "Invalid topic");
  }
  const organizationId = locals.organizationId ?? null;
  await db.insert(consultingRequests).values({
    organizationId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    company: company?.trim() || null,
    topic,
    message: message?.trim() || null
  });
  return json({ success: true });
};

export { POST };
//# sourceMappingURL=_server.ts-BJeT3oFV.js.map
