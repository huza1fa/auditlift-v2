import { a as auth } from './auth-DMd6gfJ3.js';
import { m as merge_tracing } from './index-CZIpIchk.js';
import { h as get_request_store, w as with_request_store } from './root-DgYLCq9M.js';
import { d as db, u as userOrganizations, e as eq, a as asc, o as organizations, s as subscriptions } from './index2-CrtZLkpF.js';
import { b as private_env } from './shared-server-DaWdgxVh.js';
import { o as overwriteServerAsyncLocalStorage, i as isExcludedByRouteStrategy, s as serverAsyncLocalStorage, b as baseLocale, g as getStrategyForUrl, a as shouldRedirect, d as deLocalizeUrl } from './runtime-tB9eeHiM.js';
import './defu-Ccxff1Nq.js';
import 'zod';
import './index-wpIsICWW.js';
import './shared-6t1rPxI4.js';
import './index3-DkaUimNV.js';
import './aggregate-CbMItvtT.js';
import './index-DBVoBMpw.js';
import './exports-B5ORJhfK.js';
import './events-D4oFFCJs.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';

/** @import { Handle, RequestEvent, ResolveOptions } from '@sveltejs/kit' */
/** @import { MaybePromise } from 'types' */

/**
 * A helper function for sequencing multiple `handle` calls in a middleware-like manner.
 * The behavior for the `handle` options is as follows:
 * - `transformPageChunk` is applied in reverse order and merged
 * - `preload` is applied in forward order, the first option "wins" and no `preload` options after it are called
 * - `filterSerializedResponseHeaders` behaves the same as `preload`
 *
 * ```js
 * /// file: src/hooks.server.js
 * import { sequence } from '@sveltejs/kit/hooks';
 *
 * /// type: import('@sveltejs/kit').Handle
 * async function first({ event, resolve }) {
 * 	console.log('first pre-processing');
 * 	const result = await resolve(event, {
 * 		transformPageChunk: ({ html }) => {
 * 			// transforms are applied in reverse order
 * 			console.log('first transform');
 * 			return html;
 * 		},
 * 		preload: () => {
 * 			// this one wins as it's the first defined in the chain
 * 			console.log('first preload');
 * 			return true;
 * 		}
 * 	});
 * 	console.log('first post-processing');
 * 	return result;
 * }
 *
 * /// type: import('@sveltejs/kit').Handle
 * async function second({ event, resolve }) {
 * 	console.log('second pre-processing');
 * 	const result = await resolve(event, {
 * 		transformPageChunk: ({ html }) => {
 * 			console.log('second transform');
 * 			return html;
 * 		},
 * 		preload: () => {
 * 			console.log('second preload');
 * 			return true;
 * 		},
 * 		filterSerializedResponseHeaders: () => {
 * 			// this one wins as it's the first defined in the chain
 * 			console.log('second filterSerializedResponseHeaders');
 * 			return true;
 * 		}
 * 	});
 * 	console.log('second post-processing');
 * 	return result;
 * }
 *
 * export const handle = sequence(first, second);
 * ```
 *
 * The example above would print:
 *
 * ```
 * first pre-processing
 * first preload
 * second pre-processing
 * second filterSerializedResponseHeaders
 * second transform
 * first transform
 * second post-processing
 * first post-processing
 * ```
 *
 * @param {...Handle} handlers The chain of `handle` functions
 * @returns {Handle}
 */
function sequence(...handlers) {
	const length = handlers.length;
	if (!length) return ({ event, resolve }) => resolve(event);

	return ({ event, resolve }) => {
		const { state } = get_request_store();
		return apply_handle(0, event, {});

		/**
		 * @param {number} i
		 * @param {RequestEvent} event
		 * @param {ResolveOptions | undefined} parent_options
		 * @returns {MaybePromise<Response>}
		 */
		function apply_handle(i, event, parent_options) {
			const handle = handlers[i];

			return state.tracing.record_span({
				name: `sveltekit.handle.sequenced.${handle.name ? handle.name : i}`,
				attributes: {},
				fn: async (current) => {
					const traced_event = merge_tracing(event, current);
					return await with_request_store({ event: traced_event, state }, () =>
						handle({
							event: traced_event,
							resolve: (event, options) => {
								/** @type {ResolveOptions['transformPageChunk']} */
								const transformPageChunk = async ({ html, done }) => {
									if (options?.transformPageChunk) {
										html = (await options.transformPageChunk({ html, done })) ?? '';
									}

									if (parent_options?.transformPageChunk) {
										html = (await parent_options.transformPageChunk({ html, done })) ?? '';
									}

									return html;
								};

								/** @type {ResolveOptions['filterSerializedResponseHeaders']} */
								const filterSerializedResponseHeaders =
									parent_options?.filterSerializedResponseHeaders ??
									options?.filterSerializedResponseHeaders;

								/** @type {ResolveOptions['preload']} */
								const preload = parent_options?.preload ?? options?.preload;

								return i < length - 1
									? apply_handle(i + 1, event, {
											transformPageChunk,
											filterSerializedResponseHeaders,
											preload
										})
									: resolve(event, {
											transformPageChunk,
											filterSerializedResponseHeaders,
											preload
										});
							}
						})
					);
				}
			});
		}
	};
}

async function paraglideMiddleware(request, resolve, callbacks) {
  if (!serverAsyncLocalStorage) {
    const { AsyncLocalStorage } = await import('async_hooks');
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

export { handle };
//# sourceMappingURL=hooks.server-B7UG0f1W.js.map
