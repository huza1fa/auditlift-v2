import { a as auth } from './auth-D-6VdkcU.js';
import { e as error } from './index-wpIsICWW.js';
import { c as checkRateLimit } from './rate-limit-C2Tknidw.js';
import './defu-Ccxff1Nq.js';
import 'zod';
import './shared-server-DaWdgxVh.js';
import './root-kx8UrV8x.js';
import './index3-A6PWQL_h.js';
import './shared-DH3etkvJ.js';
import './index2-BGADDK3r.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './aggregate-DzCAPQGU.js';

const RATE_LIMITED_PATHS = [
  "/sign-in/email",
  // login
  "/sign-up/email",
  // registration
  "/forget-password",
  // password reset request
  "/reset-password"
  // password reset completion
];
const GET = ({ request }) => auth.handler(request);
const POST = ({ request, getClientAddress }) => {
  const url = new URL(request.url);
  const authPath = url.pathname.replace("/api/auth", "");
  if (RATE_LIMITED_PATHS.some((p) => authPath.startsWith(p))) {
    const ip = getClientAddress();
    if (!checkRateLimit(`auth:${authPath}:${ip}`, 10, 15 * 60 * 1e3)) {
      throw error(429, "Too many attempts. Please try again later.");
    }
  }
  return auth.handler(request);
};

export { GET, POST };
//# sourceMappingURL=_server.ts-CvtL8kef.js.map
