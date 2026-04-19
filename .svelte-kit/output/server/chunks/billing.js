const TRIAL_MEMBER_LIMIT = 2;
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
export {
  TRIAL_MEMBER_LIMIT as T,
  hasActivePaidAccess as a,
  hasActiveAccess as h,
  isReadOnly as i
};
