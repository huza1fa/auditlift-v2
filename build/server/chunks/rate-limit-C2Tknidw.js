const store = /* @__PURE__ */ new Map();
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now - entry.windowStart > 60 * 60 * 1e3) {
        store.delete(key);
      }
    }
  },
  10 * 60 * 1e3
);
function checkRateLimit(key, limit, windowMs) {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now - entry.windowStart > windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= limit) {
    return false;
  }
  entry.count++;
  return true;
}

export { checkRateLimit as c };
//# sourceMappingURL=rate-limit-C2Tknidw.js.map
