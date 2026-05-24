import { redirect } from "@sveltejs/kit";
import { i as isReadOnly } from "../../../chunks/billing.js";
import { d as db, g as organizations } from "../../../chunks/index2.js";
import { eq } from "drizzle-orm";
import { sendTrialExpiringEmail, sendTrialExpiredEmail } from "../../../chunks/email.js";
const load = async ({ locals, url }) => {
  if (!locals.session) {
    redirect(302, "/login");
  }
  if (!locals.organization || !locals.organization.onboardingComplete) {
    redirect(302, "/onboarding");
  }
  const readOnly = isReadOnly(locals.subscription, locals.organization?.trialEndsAt ?? null);
  const org = locals.organization;
  if (org.trialEndsAt && locals.session?.user) {
    const daysLeft = Math.ceil((org.trialEndsAt.getTime() - Date.now()) / 864e5);
    const user = locals.session.user;
    if (daysLeft <= 3 && daysLeft > 0 && !org.trialReminderSentAt) {
      sendTrialExpiringEmail({
        to: user.email,
        name: user.name ?? "",
        organizationName: org.name,
        daysLeft,
        trialEndsAt: org.trialEndsAt
      }).then(
        () => db.update(organizations).set({ trialReminderSentAt: /* @__PURE__ */ new Date() }).where(eq(organizations.id, org.id))
      ).catch(console.error);
    }
    if (daysLeft <= 0 && !org.trialExpiredEmailSentAt) {
      sendTrialExpiredEmail({
        to: user.email,
        name: user.name ?? "",
        organizationName: org.name
      }).then(
        () => db.update(organizations).set({ trialExpiredEmailSentAt: /* @__PURE__ */ new Date() }).where(eq(organizations.id, org.id))
      ).catch(console.error);
    }
  }
  return {
    user: locals.session.user,
    organization: locals.organization,
    subscription: locals.subscription,
    isReadOnly: readOnly
  };
};
export {
  load
};
