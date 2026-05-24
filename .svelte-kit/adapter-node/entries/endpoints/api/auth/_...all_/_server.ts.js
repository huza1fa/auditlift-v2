import { a as auth } from "../../../../../chunks/auth.js";
import { error } from "@sveltejs/kit";
import { c as checkRateLimit } from "../../../../../chunks/rate-limit.js";
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
export {
  GET,
  POST
};
