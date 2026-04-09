function hasActiveAccess(subscription, trialEndsAt) {
  if (!subscription) {
    if (trialEndsAt) return trialEndsAt > /* @__PURE__ */ new Date();
    return false;
  }
  if (subscription.status === "active") return true;
  if (subscription.status === "trialing") {
    if (trialEndsAt) return trialEndsAt > /* @__PURE__ */ new Date();
    return true;
  }
  return false;
}
function hasActivePaidAccess(subscription) {
  if (!subscription) return false;
  return subscription.status === "active";
}
function isReadOnly(subscription, trialEndsAt) {
  return !hasActiveAccess(subscription, trialEndsAt);
}

export { hasActiveAccess as a, hasActivePaidAccess as h, isReadOnly as i };
//# sourceMappingURL=billing-DpV-ct2L.js.map
