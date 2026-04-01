import { env } from '$env/dynamic/private';

export async function sendInviteEmail(opts: {
	to: string;
	inviterName: string;
	organizationName: string;
	inviteLink: string;
	role: string;
	expiresAt: Date;
}): Promise<void> {
	if (!env.RESEND_API_KEY) {
		console.log(`[DEV] Invite email → ${opts.to} | link: ${opts.inviteLink}`);
		return;
	}

	const { Resend } = await import('resend');
	const resend = new Resend(env.RESEND_API_KEY);

	await resend.emails.send({
		from: 'AuditLift <invites@auditlift.io>',
		to: opts.to,
		subject: `You're invited to join ${opts.organizationName} on AuditLift`,
		html: buildInviteHtml(opts)
	});
}

export async function sendWelcomeEmail(opts: {
	to: string;
	name: string;
	organizationName: string;
	trialEndsAt: Date | null;
}): Promise<void> {
	if (!env.RESEND_API_KEY) {
		console.log(`[DEV] Welcome email → ${opts.to} | org: ${opts.organizationName}`);
		return;
	}

	const { Resend } = await import('resend');
	const resend = new Resend(env.RESEND_API_KEY);

	await resend.emails.send({
		from: 'AuditLift <hello@auditlift.io>',
		to: opts.to,
		subject: `Welcome to AuditLift — let's get ${opts.organizationName} audit-ready`,
		html: buildWelcomeHtml(opts)
	});
}

export async function sendTrialExpiringEmail(opts: {
	to: string;
	name: string;
	organizationName: string;
	daysLeft: number;
	trialEndsAt: Date;
}): Promise<void> {
	if (!env.RESEND_API_KEY) {
		console.log(`[DEV] Trial expiring email → ${opts.to} | daysLeft: ${opts.daysLeft}`);
		return;
	}

	const { Resend } = await import('resend');
	const resend = new Resend(env.RESEND_API_KEY);

	await resend.emails.send({
		from: 'AuditLift <hello@auditlift.io>',
		to: opts.to,
		subject: `Your AuditLift trial ends in ${opts.daysLeft} day${opts.daysLeft === 1 ? '' : 's'}`,
		html: buildTrialExpiringHtml(opts)
	});
}

export async function sendTrialExpiredEmail(opts: {
	to: string;
	name: string;
	organizationName: string;
}): Promise<void> {
	if (!env.RESEND_API_KEY) {
		console.log(`[DEV] Trial expired email → ${opts.to} | org: ${opts.organizationName}`);
		return;
	}

	const { Resend } = await import('resend');
	const resend = new Resend(env.RESEND_API_KEY);

	await resend.emails.send({
		from: 'AuditLift <hello@auditlift.io>',
		to: opts.to,
		subject: 'Your AuditLift trial has ended',
		html: buildTrialExpiredHtml(opts)
	});
}

export async function sendPasswordResetEmail(opts: {
	to: string;
	name: string;
	resetLink: string;
}): Promise<void> {
	if (!env.RESEND_API_KEY) {
		console.log(`[DEV] Password reset email → ${opts.to} | link: ${opts.resetLink}`);
		return;
	}

	const { Resend } = await import('resend');
	const resend = new Resend(env.RESEND_API_KEY);

	await resend.emails.send({
		from: 'AuditLift <hello@auditlift.io>',
		to: opts.to,
		subject: 'Reset your AuditLift password',
		html: buildPasswordResetHtml(opts)
	});
}

function buildWelcomeHtml(opts: {
	name: string;
	organizationName: string;
	trialEndsAt: Date | null;
}): string {
	const trialStr = opts.trialEndsAt
		? opts.trialEndsAt.toLocaleDateString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})
		: null;

	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:40px 0;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#18181b;padding:28px 36px;">
      <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">AuditLift</span>
    </div>
    <div style="padding:36px;">
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;">Welcome, ${opts.name.split(' ')[0] || 'there'}!</h1>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;">
        <strong style="color:#18181b;">${opts.organizationName}</strong> is set up and ready.
        ${trialStr ? `Your 14-day free trial runs until <strong style="color:#18181b;">${trialStr}</strong>.` : ''}
      </p>
      <p style="margin:0 0 12px;color:#18181b;font-size:14px;font-weight:600;">Here's where to start:</p>
      <ul style="margin:0 0 24px;padding-left:20px;color:#71717a;font-size:14px;line-height:1.8;">
        <li>Complete your compliance controls in the <strong style="color:#18181b;">Controls</strong> section</li>
        <li>Upload evidence files to each control in the <strong style="color:#18181b;">Evidence Locker</strong></li>
        <li>Generate AI-written policies in the <strong style="color:#18181b;">Policies</strong> section</li>
      </ul>
      <a href="https://app.auditlift.io/dashboard"
         style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;">
        Go to Dashboard
      </a>
    </div>
  </div>
</body>
</html>`;
}

function buildTrialExpiringHtml(opts: {
	name: string;
	organizationName: string;
	daysLeft: number;
	trialEndsAt: Date;
}): string {
	const firstName = opts.name.split(' ')[0] || 'there';
	const expiryStr = opts.trialEndsAt.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:40px 0;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#18181b;padding:28px 36px;">
      <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">AuditLift</span>
    </div>
    <div style="padding:36px;">
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;">Your trial is ending soon</h1>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;">
        Hi ${firstName}, just a heads-up — your 14-day free trial for
        <strong style="color:#18181b;">${opts.organizationName}</strong> expires on
        <strong style="color:#18181b;">${expiryStr}</strong>.
        Upgrade now to keep full access to policy generation, evidence uploads, and auditor exports.
      </p>
      <a href="https://app.auditlift.io/settings/billing"
         style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;">
        Upgrade Now
      </a>
    </div>
  </div>
</body>
</html>`;
}

function buildTrialExpiredHtml(opts: { name: string; organizationName: string }): string {
	const firstName = opts.name.split(' ')[0] || 'there';

	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:40px 0;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#18181b;padding:28px 36px;">
      <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">AuditLift</span>
    </div>
    <div style="padding:36px;">
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;">Your trial has ended</h1>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;">
        Your trial for <strong style="color:#18181b;">${opts.organizationName}</strong> has ended.
        Your data is safe — upgrade anytime to regain full access.
      </p>
      <a href="https://app.auditlift.io/settings/billing"
         style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;">
        Reactivate Access
      </a>
    </div>
  </div>
</body>
</html>`;
}

function buildPasswordResetHtml(opts: { name: string; resetLink: string }): string {
	const firstName = opts.name.split(' ')[0] || 'there';

	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:40px 0;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#18181b;padding:28px 36px;">
      <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">AuditLift</span>
    </div>
    <div style="padding:36px;">
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;">Reset your password</h1>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;">
        Hi ${firstName}, click the button below to reset your password. This link expires in 1 hour.
        If you didn't request this, you can safely ignore this email.
      </p>
      <a href="${opts.resetLink}"
         style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;">
        Reset Password
      </a>
    </div>
  </div>
</body>
</html>`;
}

function buildInviteHtml(opts: {
	to: string;
	inviterName: string;
	organizationName: string;
	inviteLink: string;
	role: string;
	expiresAt: Date;
}): string {
	const expiryStr = opts.expiresAt.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:40px 0;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#18181b;padding:28px 36px;">
      <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">AuditLift</span>
    </div>
    <div style="padding:36px;">
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;">You're invited</h1>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;">
        <strong style="color:#18181b;">${opts.inviterName}</strong> invited you to join
        <strong style="color:#18181b;">${opts.organizationName}</strong> as a <strong style="color:#18181b;">${opts.role}</strong>.
      </p>
      <a href="${opts.inviteLink}"
         style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;">
        Accept Invitation
      </a>
      <p style="margin:24px 0 0;color:#a1a1aa;font-size:13px;">
        This invitation expires on ${expiryStr}. If you didn't expect this, you can ignore it.
      </p>
    </div>
  </div>
</body>
</html>`;
}
