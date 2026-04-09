import { b as private_env } from "./shared-server.js";
async function sendInviteEmail(opts) {
  if (!private_env.RESEND_API_KEY) {
    console.log(`[DEV] Invite email → ${opts.to} | link: ${opts.inviteLink}`);
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(private_env.RESEND_API_KEY);
  await resend.emails.send({
    from: "AuditLift <invites@auditlift.app>",
    to: opts.to,
    subject: `You're invited to join ${opts.organizationName} on AuditLift`,
    html: buildInviteHtml(opts)
  });
}
async function sendWelcomeEmail(opts) {
  if (!private_env.RESEND_API_KEY) {
    console.log(`[DEV] Welcome email → ${opts.to} | org: ${opts.organizationName}`);
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(private_env.RESEND_API_KEY);
  await resend.emails.send({
    from: "AuditLift <hello@auditlift.app>",
    to: opts.to,
    subject: `Welcome to AuditLift — let's get ${opts.organizationName} audit-ready`,
    html: buildWelcomeHtml(opts)
  });
}
async function sendTrialExpiringEmail(opts) {
  if (!private_env.RESEND_API_KEY) {
    console.log(`[DEV] Trial expiring email → ${opts.to} | daysLeft: ${opts.daysLeft}`);
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(private_env.RESEND_API_KEY);
  await resend.emails.send({
    from: "AuditLift <hello@auditlift.app>",
    to: opts.to,
    subject: `Your AuditLift trial ends in ${opts.daysLeft} day${opts.daysLeft === 1 ? "" : "s"}`,
    html: buildTrialExpiringHtml(opts)
  });
}
async function sendTrialExpiredEmail(opts) {
  if (!private_env.RESEND_API_KEY) {
    console.log(`[DEV] Trial expired email → ${opts.to} | org: ${opts.organizationName}`);
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(private_env.RESEND_API_KEY);
  await resend.emails.send({
    from: "AuditLift <hello@auditlift.app>",
    to: opts.to,
    subject: "Your AuditLift trial has ended",
    html: buildTrialExpiredHtml(opts)
  });
}
async function sendPasswordResetEmail(opts) {
  if (!private_env.RESEND_API_KEY) {
    console.log(`[DEV] Password reset email → ${opts.to} | link: ${opts.resetLink}`);
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(private_env.RESEND_API_KEY);
  await resend.emails.send({
    from: "AuditLift <hello@auditlift.app>",
    to: opts.to,
    subject: "Reset your AuditLift password",
    html: buildPasswordResetHtml(opts)
  });
}
function buildWelcomeHtml(opts) {
  const firstName = opts.name.split(" ")[0] || "there";
  const trialStr = opts.trialEndsAt ? opts.trialEndsAt.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : null;
  const trialText = trialStr ? ` Your 14-day free trial runs until <strong style="color:#18181b;font-weight:600;">${trialStr}</strong>.` : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f4f5;margin:0;padding:40px 16px;" bgcolor="#f4f4f5">
  <div style="max-width:560px;margin:0 auto;">

    <!-- Header -->
    <div style="background:#18181b;padding:20px 32px;border-radius:10px 10px 0 0;">
      <span style="color:#ffffff;font-size:17px;font-weight:700;letter-spacing:-0.3px;">&#x1F6E1;&#xFE0F; AuditLift</span>
    </div>

    <!-- Content card -->
    <div style="background:#ffffff;padding:32px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 10px 10px;">
      <h1 style="margin:0 0 12px;font-size:20px;font-weight:700;color:#18181b;">Welcome to AuditLift, ${firstName}!</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#52525b;">
        Your workspace for <strong style="color:#18181b;font-weight:600;">${opts.organizationName}</strong> is ready.${trialText}
      </p>
      <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#18181b;">Here's where to start:</p>
      <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;line-height:1.8;color:#52525b;">
        <li>Open <strong style="color:#18181b;font-weight:600;">Controls</strong> to see every framework requirement mapped out</li>
        <li>Check your <strong style="color:#18181b;font-weight:600;">Readiness Score</strong> to see gaps before a prospect asks</li>
        <li>Generate policies in the <strong style="color:#18181b;font-weight:600;">Policies</strong> section for the controls you're missing</li>
      </ul>
      <a href="https://auditlift.app/dashboard"
         style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;margin-bottom:20px;">
        Go to Dashboard
      </a>
    </div>

    <!-- Footer -->
    <div style="margin-top:24px;text-align:center;">
      <p style="font-size:12px;color:#a1a1aa;line-height:1.6;margin:0;">
        &copy; 2026 AuditLift &middot; auditlift.app<br>
        You&rsquo;re receiving this because you have an account with AuditLift.
      </p>
    </div>

  </div>
</body>
</html>`;
}
function buildTrialExpiringHtml(opts) {
  const expiryStr = opts.trialEndsAt.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const s = opts.daysLeft === 1 ? "" : "s";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f4f5;margin:0;padding:40px 16px;" bgcolor="#f4f4f5">
  <div style="max-width:560px;margin:0 auto;">

    <!-- Header -->
    <div style="background:#18181b;padding:20px 32px;border-radius:10px 10px 0 0;">
      <span style="color:#ffffff;font-size:17px;font-weight:700;letter-spacing:-0.3px;">&#x1F6E1;&#xFE0F; AuditLift</span>
    </div>

    <!-- Content card -->
    <div style="background:#ffffff;padding:32px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 10px 10px;">
      <h1 style="margin:0 0 12px;font-size:20px;font-weight:700;color:#18181b;">Your trial ends in ${opts.daysLeft} day${s}</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#52525b;">
        Just a heads-up &mdash; your free trial for <strong style="color:#18181b;font-weight:600;">${opts.organizationName}</strong> expires on
        <strong style="color:#18181b;font-weight:600;">${expiryStr}</strong>.
        Upgrade now to keep your policies, evidence, and questionnaire answers.
      </p>
      <a href="https://auditlift.app/settings/billing"
         style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;margin-bottom:20px;">
        Upgrade Now
      </a>
    </div>

    <!-- Footer -->
    <div style="margin-top:24px;text-align:center;">
      <p style="font-size:12px;color:#a1a1aa;line-height:1.6;margin:0;">
        &copy; 2026 AuditLift &middot; auditlift.app<br>
        You&rsquo;re receiving this because you have an account with AuditLift.
      </p>
    </div>

  </div>
</body>
</html>`;
}
function buildTrialExpiredHtml(opts) {
  const firstName = opts.name.split(" ")[0] || "there";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f4f5;margin:0;padding:40px 16px;" bgcolor="#f4f4f5">
  <div style="max-width:560px;margin:0 auto;">

    <!-- Header -->
    <div style="background:#18181b;padding:20px 32px;border-radius:10px 10px 0 0;">
      <span style="color:#ffffff;font-size:17px;font-weight:700;letter-spacing:-0.3px;">&#x1F6E1;&#xFE0F; AuditLift</span>
    </div>

    <!-- Content card -->
    <div style="background:#ffffff;padding:32px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 10px 10px;">
      <h1 style="margin:0 0 12px;font-size:20px;font-weight:700;color:#18181b;">Your AuditLift trial has ended</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#52525b;">
        Your trial for <strong style="color:#18181b;font-weight:600;">${opts.organizationName}</strong> has ended, ${firstName}.
        Your data is safe &mdash; subscribe anytime to regain full access.
      </p>
      <a href="https://auditlift.app/settings/billing"
         style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;margin-bottom:20px;">
        Reactivate Access
      </a>
    </div>

    <!-- Footer -->
    <div style="margin-top:24px;text-align:center;">
      <p style="font-size:12px;color:#a1a1aa;line-height:1.6;margin:0;">
        &copy; 2026 AuditLift &middot; auditlift.app<br>
        You&rsquo;re receiving this because you have an account with AuditLift.
      </p>
    </div>

  </div>
</body>
</html>`;
}
function buildPasswordResetHtml(opts) {
  const firstName = opts.name.split(" ")[0] || "there";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f4f5;margin:0;padding:40px 16px;" bgcolor="#f4f4f5">
  <div style="max-width:560px;margin:0 auto;">

    <!-- Header -->
    <div style="background:#18181b;padding:20px 32px;border-radius:10px 10px 0 0;">
      <span style="color:#ffffff;font-size:17px;font-weight:700;letter-spacing:-0.3px;">&#x1F6E1;&#xFE0F; AuditLift</span>
    </div>

    <!-- Content card -->
    <div style="background:#ffffff;padding:32px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 10px 10px;">
      <h1 style="margin:0 0 12px;font-size:20px;font-weight:700;color:#18181b;">Reset your password</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#52525b;">
        Hi ${firstName}, we received a request to reset your AuditLift password.
        Click the button below &mdash; this link expires in 1 hour.
        If you didn&rsquo;t request this, you can safely ignore this email.
      </p>
      <a href="${opts.resetLink}"
         style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;margin-bottom:20px;">
        Reset Password
      </a>
    </div>

    <!-- Footer -->
    <div style="margin-top:24px;text-align:center;">
      <p style="font-size:12px;color:#a1a1aa;line-height:1.6;margin:0;">
        &copy; 2026 AuditLift &middot; auditlift.app<br>
        You&rsquo;re receiving this because you have an account with AuditLift.
      </p>
    </div>

  </div>
</body>
</html>`;
}
function buildInviteHtml(opts) {
  const expiryStr = opts.expiresAt.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f4f5;margin:0;padding:40px 16px;" bgcolor="#f4f4f5">
  <div style="max-width:560px;margin:0 auto;">

    <!-- Header -->
    <div style="background:#18181b;padding:20px 32px;border-radius:10px 10px 0 0;">
      <span style="color:#ffffff;font-size:17px;font-weight:700;letter-spacing:-0.3px;">&#x1F6E1;&#xFE0F; AuditLift</span>
    </div>

    <!-- Content card -->
    <div style="background:#ffffff;padding:32px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 10px 10px;">
      <h1 style="margin:0 0 12px;font-size:20px;font-weight:700;color:#18181b;">You&rsquo;ve been invited to join ${opts.organizationName}</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#52525b;">
        <strong style="color:#18181b;font-weight:600;">${opts.inviterName}</strong> has invited you to join
        <strong style="color:#18181b;font-weight:600;">${opts.organizationName}</strong> on AuditLift as a
        <strong style="color:#18181b;font-weight:600;">${opts.role}</strong>.
        Click below to accept your invitation and get started.
      </p>
      <a href="${opts.inviteLink}"
         style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;margin-bottom:20px;">
        Accept Invitation
      </a>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#71717a;">
        This invitation expires on <strong style="color:#18181b;font-weight:600;">${expiryStr}</strong>.
        If you weren&rsquo;t expecting this, you can safely ignore it.
      </p>
    </div>

    <!-- Footer -->
    <div style="margin-top:24px;text-align:center;">
      <p style="font-size:12px;color:#a1a1aa;line-height:1.6;margin:0;">
        &copy; 2026 AuditLift &middot; auditlift.app<br>
        You&rsquo;re receiving this because you have an account with AuditLift.
      </p>
    </div>

  </div>
</body>
</html>`;
}
export {
  sendInviteEmail,
  sendPasswordResetEmail,
  sendTrialExpiredEmail,
  sendTrialExpiringEmail,
  sendWelcomeEmail
};
