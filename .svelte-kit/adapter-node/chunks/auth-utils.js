import { error } from "@sveltejs/kit";
const ROLE_HIERARCHY = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1
};
function hasMinimumRole(userRole, minimumRole) {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
}
function canInvite(role) {
  return role === "owner" || role === "admin";
}
function canDeleteOrganization(role) {
  return role === "owner";
}
function canChangeRole(actorRole, targetRole, targetUserId, actorUserId) {
  if (targetUserId === actorUserId) {
    return false;
  }
  if (targetRole === "owner") {
    return actorRole === "owner";
  }
  return actorRole === "owner" || actorRole === "admin";
}
function requireMinimumRole(role, minimumRole, message = "Insufficient permissions") {
  if (!hasMinimumRole(role, minimumRole)) {
    throw error(403, message);
  }
}
function requireInvitePermission(role, message = "You do not have permission to invite members") {
  if (!canInvite(role)) {
    throw error(403, message);
  }
}
function requireOrgDeletionPermission(role, message = "Only the organization owner can delete the organization") {
  if (!canDeleteOrganization(role)) {
    throw error(403, message);
  }
}
function extractDomainFromEmail(email) {
  const parts = email.split("@");
  if (parts.length !== 2) return null;
  const domain = parts[1].toLowerCase();
  const personalDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "protonmail.com",
    "proton.me",
    "users.noreply.github.com"
    // GitHub private email proxy
  ];
  if (personalDomains.includes(domain)) return null;
  return domain;
}
export {
  requireInvitePermission as a,
  requireMinimumRole as b,
  canChangeRole as c,
  extractDomainFromEmail as e,
  requireOrgDeletionPermission as r
};
