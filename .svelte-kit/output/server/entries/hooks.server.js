import { a as auth } from "../chunks/auth.js";
import { sequence } from "@sveltejs/kit/hooks";
import { d as db, u as userOrganizations, g as organizations, s as subscriptions } from "../chunks/index2.js";
import { eq, asc } from "drizzle-orm";
import { b as private_env } from "../chunks/shared-server.js";
import { o as overwriteServerAsyncLocalStorage, i as isExcludedByRouteStrategy, s as serverAsyncLocalStorage, b as baseLocale, c as getStrategyForUrl, d as shouldRedirect, e as deLocalizeUrl } from "../chunks/runtime.js";
async function paraglideMiddleware(request, resolve, callbacks) {
  if (!serverAsyncLocalStorage) {
    const { AsyncLocalStorage } = await import("async_hooks");
    overwriteServerAsyncLocalStorage(new AsyncLocalStorage());
  } else if (!serverAsyncLocalStorage) {
    overwriteServerAsyncLocalStorage(createMockAsyncLocalStorage());
  }
  if (isExcludedByRouteStrategy(request.url)) {
    const locale2 = baseLocale;
    const origin2 = new URL(request.url).origin;
    const newRequest2 = cloneRequestWithFallback(request);
    const messageCalls2 = /* @__PURE__ */ new Set();
    return (
      /** @type {Response} */
      await serverAsyncLocalStorage?.run({ locale: locale2, origin: origin2, messageCalls: messageCalls2 }, () => resolve({ locale: locale2, request: newRequest2 }))
    );
  }
  const strategy = getStrategyForUrl(request.url);
  const decision = await shouldRedirect({ request });
  const locale = decision.locale;
  const origin = new URL(request.url).origin;
  if (request.headers.get("Sec-Fetch-Dest") === "document" && decision.shouldRedirect && decision.redirectUrl) {
    const headers = {};
    if (strategy.includes("preferredLanguage")) {
      headers["Vary"] = "Accept-Language";
    }
    const response2 = new Response(null, {
      status: 307,
      headers: {
        Location: decision.redirectUrl.href,
        ...headers
      }
    });
    return response2;
  }
  let newRequest;
  if (strategy.includes("url")) {
    newRequest = new Request(deLocalizeUrl(request.url), request);
  } else {
    newRequest = cloneRequestWithFallback(request);
  }
  const messageCalls = /* @__PURE__ */ new Set();
  const response = await serverAsyncLocalStorage?.run({ locale, origin, messageCalls }, () => resolve({ locale, request: newRequest }));
  return response;
}
function cloneRequestWithFallback(request) {
  try {
    return new Request(request.clone());
  } catch {
    try {
      return new Request(request);
    } catch {
      return request;
    }
  }
}
function createMockAsyncLocalStorage() {
  let currentStore = void 0;
  return {
    getStore() {
      return currentStore;
    },
    async run(store, callback) {
      currentStore = store;
      try {
        return await callback();
      } finally {
        currentStore = void 0;
      }
    }
  };
}
const authHandle = async ({ event, resolve }) => {
  const method = event.request.method;
  if (["POST", "PATCH", "DELETE", "PUT"].includes(method)) {
    const pathname = event.url.pathname;
    if (!pathname.startsWith("/api/webhooks/")) {
      const origin = event.request.headers.get("origin");
      const expectedOrigin = private_env.ORIGIN;
      if (origin && expectedOrigin && origin !== expectedOrigin) {
        return new Response("Forbidden", { status: 403 });
      }
    }
  }
  const session = await auth.api.getSession({ headers: event.request.headers });
  event.locals.session = session;
  if (session?.user) {
    const [userOrg] = await db.select().from(userOrganizations).where(eq(userOrganizations.userId, session.user.id)).orderBy(asc(userOrganizations.createdAt)).limit(1);
    if (userOrg) {
      event.locals.organizationId = userOrg.organizationId;
      const [[org], [sub]] = await Promise.all([
        db.select().from(organizations).where(eq(organizations.id, userOrg.organizationId)).limit(1),
        db.select().from(subscriptions).where(eq(subscriptions.organizationId, userOrg.organizationId)).limit(1)
      ]);
      event.locals.organization = org;
      event.locals.subscription = sub ?? null;
    } else {
      event.locals.organizationId = null;
      event.locals.organization = null;
      event.locals.subscription = null;
    }
  }
  const response = await resolve(event);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  {
    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' https://api.openrouter.ai https://api.stripe.com",
        "frame-ancestors 'none'"
      ].join("; ")
    );
  }
  return response;
};
const paraglideHandle = ({ event, resolve }) => paraglideMiddleware(
  event.request,
  ({ request, locale }) => {
    event.request = request;
    return resolve(event, {
      transformPageChunk: ({ html }) => html.replace("%paraglide.lang%", locale)
    });
  }
);
const handle = sequence(paraglideHandle, authHandle);
export {
  handle
};
