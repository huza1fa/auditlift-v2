import { a as auth } from './auth-DMd6gfJ3.js';
import { e as error } from './index-wpIsICWW.js';
import { c as checkRateLimit } from './rate-limit-C2Tknidw.js';
import './defu-Ccxff1Nq.js';
import 'zod';
import './shared-server-DaWdgxVh.js';
import './root-DgYLCq9M.js';
import './index3-DkaUimNV.js';
import './events-D4oFFCJs.js';
import './shared-6t1rPxI4.js';
import './index2-CrtZLkpF.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './aggregate-CbMItvtT.js';

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
//# sourceMappingURL=_server.ts-DuYtX9dj.js.map
