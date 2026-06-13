import { env } from '$env/dynamic/private';

/**
 * Escape HTML entities to prevent HTML/email-header injection.
 * All dynamic values inserted into email templates must pass through this.
 */
function escapeHtml(unsafe: string): string {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

const BRAND = {
	green: '#4e7a4e',
	greenHover: '#3e6a3e',
	greenLight: '#eaf0ea',
	background: '#f7f6f3',
	elevated: '#ffffff',
	foreground: '#1c1e1c',
	muted: '#5a6858',
	subtle: '#8a978a',
	border: '#d8d5ce',
	danger: '#b84040'
};

function emailWrapper(title: string, bodyHtml: string): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(title)}</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 24px 16px !important; }
      .card { padding: 28px 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${BRAND.background};font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" width="560" style="max-width:560px;width:560px;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <a href="https://auditlift.app" style="text-decoration:none;display:inline-block;">
                <span style="display:inline-flex;align-items:center;gap:8px;">
                  <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:${BRAND.green};border-radius:7px;color:#ffffff;font-size:15px;font-weight:700;">A</span>
                  <span style="font-size:17px;font-weight:700;color:${BRAND.foreground};letter-spacing:-0.3px;">AuditLift</span>
                </span>
              </a>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td class="card" style="background:${BRAND.elevated};border:1px solid ${BRAND.border};border-radius:14px;padding:40px;box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.05),0 2px 4px -2px rgb(0 0 0 / 0.05);">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0 0 6px;font-size:12px;line-height:1.6;color:${BRAND.subtle};">
                &copy; ${new Date().getFullYear()} AuditLift &middot; auditlift.app
              </p>
              <p style="margin:0;font-size:12px;line-height:1.6;color:${BRAND.subtle};">
                You&rsquo;re receiving this because you have an account with AuditLift.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(href: string, label: string): string {
	return `<a href="${escapeHtml(href)}" style="display:inline-block;background:${BRAND.green};color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;">${escapeHtml(label)}</a>`;
}

function heading(text: string): string {
	return `<h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:${BRAND.foreground};line-height:1.3;">${escapeHtml(text)}</h1>`;
}

function paragraph(text: string, options: { bold?: boolean; color?: string } = {}): string {
	const weight = options.bold ? 'font-weight:600;' : '';
	const color = options.color ? `color:${options.color};` : `color:${BRAND.muted};`;
	return `<p style="margin:0 0 18px;font-size:15px;line-height:1.65;${weight}${color}">${text}</p>`;
}

function callout(text: string): string {
	return `<div style="background:${BRAND.greenLight};border-left:4px solid ${BRAND.green};border-radius:8px;padding:16px 18px;margin:0 0 24px;">
  <p style="margin:0;font-size:14px;line-height:1.6;color:${BRAND.foreground};">${text}</p>
</div>`;
}

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

	const expiryStr = opts.expiresAt.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	const body = `
${heading(`You&rsquo;ve been invited to ${escapeHtml(opts.organizationName)}`)}
${paragraph(
	`<strong>${escapeHtml(opts.inviterName)}</strong> invited you to join <strong>${escapeHtml(opts.organizationName)}</strong> on AuditLift as a <strong>${escapeHtml(opts.role)}</strong>.`
)}
${callout(`This invitation expires on <strong>${escapeHtml(expiryStr)}</strong>.`)}
<p style="margin:0 0 8px;font-size:14px;color:${BRAND.muted};">Click below to accept your invitation:</p>
<p style="margin:0 0 24px;">${button(opts.inviteLink, 'Accept Invitation')}</p>
${paragraph(
	`If you weren&rsquo;t expecting this invitation, you can safely ignore it. If the button doesn&rsquo;t work, copy and paste this link: <a href="${escapeHtml(opts.inviteLink)}" style="color:${BRAND.green};text-decoration:underline;">${escapeHtml(opts.inviteLink)}</a>`
)}
`;

	const result = await resend.emails.send({
		from: 'AuditLift <invites@auditlift.app>',
		to: opts.to,
		subject: `You're invited to join ${opts.organizationName} on AuditLift`,
		html: emailWrapper('Accept your invitation', body)
	});

	if (result.error) {
		console.error('[email] Invite email failed:', result.error);
		throw new Error(`Failed to send invite email: ${result.error.name} — ${result.error.message}`);
	}
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

	const firstName = escapeHtml(opts.name.split(' ')[0] || 'there');
	const trialStr = opts.trialEndsAt
		? opts.trialEndsAt.toLocaleDateString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})
		: null;

	const body = `
${heading(`Welcome to AuditLift, ${firstName}`)}
${paragraph(`Your workspace for <strong>${escapeHtml(opts.organizationName)}</strong> is ready.`)}
${trialStr ? callout(`Your 14-day free trial runs until <strong>${escapeHtml(trialStr)}</strong>.`) : ''}
<p style="margin:0 0 12px;font-size:14px;font-weight:600;color:${BRAND.foreground};">Here&rsquo;s where to start:</p>
<ul style="margin:0 0 24px;padding-left:20px;font-size:14px;line-height:1.8;color:${BRAND.muted};">
  <li>Open <strong>Controls</strong> to see every framework requirement mapped out</li>
  <li>Check your <strong>Readiness Score</strong> to see gaps before a prospect asks</li>
  <li>Generate policies in the <strong>Policies</strong> section for the controls you&rsquo;re missing</li>
</ul>
<p style="margin:0 0 24px;">${button('https://auditlift.app/dashboard', 'Go to Dashboard')}</p>
${paragraph(`Questions? Reply to this email or reach out to our team at any time.`, {
	bold: false
})}
`;

	const result = await resend.emails.send({
		from: 'AuditLift <hello@auditlift.app>',
		to: opts.to,
		subject: `Welcome to AuditLift — let's get ${opts.organizationName} audit-ready`,
		html: emailWrapper('Welcome to AuditLift', body)
	});

	if (result.error) {
		console.error('[email] Welcome email failed:', result.error);
		throw new Error(`Failed to send welcome email: ${result.error.name} — ${result.error.message}`);
	}
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

	const expiryStr = escapeHtml(
		opts.trialEndsAt.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);
	const s = opts.daysLeft === 1 ? '' : 's';

	const body = `
${heading(`Your trial ends in ${opts.daysLeft} day${s}`)}
${paragraph(
	`Just a heads-up &mdash; your free trial for <strong>${escapeHtml(opts.organizationName)}</strong> expires on <strong>${expiryStr}</strong>. Upgrade now to keep your policies, evidence, and questionnaire answers.`
)}
<p style="margin:0 0 24px;">${button('https://auditlift.app/settings/billing', 'Upgrade Now')}</p>
${callout(`Need help choosing a plan? Reply to this email and we&rsquo;ll walk you through it.`)}
`;

	const result = await resend.emails.send({
		from: 'AuditLift <hello@auditlift.app>',
		to: opts.to,
		subject: `Your AuditLift trial ends in ${opts.daysLeft} day${s}`,
		html: emailWrapper('Your trial is ending soon', body)
	});

	if (result.error) {
		console.error('[email] Trial expiring email failed:', result.error);
		throw new Error(
			`Failed to send trial expiring email: ${result.error.name} — ${result.error.message}`
		);
	}
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

	const firstName = escapeHtml(opts.name.split(' ')[0] || 'there');

	const body = `
${heading('Your AuditLift trial has ended')}
${paragraph(
	`Hi ${firstName}, your trial for <strong>${escapeHtml(opts.organizationName)}</strong> has ended. Your data is safe &mdash; subscribe anytime to regain full access.`
)}
<p style="margin:0 0 24px;">${button('https://auditlift.app/settings/billing', 'Reactivate Access')}</p>
${callout(`Questions? Reply to this email and we&rsquo;ll help you find the right plan.`)}
`;

	const result = await resend.emails.send({
		from: 'AuditLift <hello@auditlift.app>',
		to: opts.to,
		subject: 'Your AuditLift trial has ended',
		html: emailWrapper('Your trial has ended', body)
	});

	if (result.error) {
		console.error('[email] Trial expired email failed:', result.error);
		throw new Error(
			`Failed to send trial expired email: ${result.error.name} — ${result.error.message}`
		);
	}
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

	const firstName = escapeHtml(opts.name.split(' ')[0] || 'there');

	const body = `
${heading('Reset your password')}
${paragraph(`Hi ${firstName}, we received a request to reset your AuditLift password. Click the button below &mdash; this link expires in 1 hour.`)}
<p style="margin:0 0 8px;font-size:14px;color:${BRAND.muted};">If you didn&rsquo;t request this, you can safely ignore this email.</p>
<p style="margin:0 0 24px;">${button(opts.resetLink, 'Reset Password')}</p>
${paragraph(
	`If the button doesn&rsquo;t work, copy and paste this link: <a href="${escapeHtml(opts.resetLink)}" style="color:${BRAND.green};text-decoration:underline;">${escapeHtml(opts.resetLink)}</a>`
)}
`;

	const result = await resend.emails.send({
		from: 'AuditLift <hello@auditlift.app>',
		to: opts.to,
		subject: 'Reset your AuditLift password',
		html: emailWrapper('Reset your password', body)
	});

	if (result.error) {
		console.error('[email] Password reset email failed:', result.error);
		throw new Error(
			`Failed to send password reset email: ${result.error.name} — ${result.error.message}`
		);
	}
}

function formatConsultingTopic(topic: string): string {
	const labels: Record<string, string> = {
		'questionnaire-help': 'Questionnaire help',
		'soc2-readiness': 'SOC 2 readiness',
		'iso27001-readiness': 'ISO 27001 readiness',
		'vciso-advisory': 'vCISO advisory',
		'general-compliance': 'General compliance',
		other: 'Other'
	};
	return labels[topic] ?? topic;
}

export async function sendConsultingRequestNotification(opts: {
	name: string;
	email: string;
	company: string | null;
	topic: string;
	message: string | null;
	organizationId: string | null;
	isLoggedIn: boolean;
}): Promise<void> {
	const advisoryEmail = env.ADVISORY_TEAM_EMAIL;
	if (!advisoryEmail) {
		console.log(
			`[DEV] Advisory notification → ${opts.name} <${opts.email}> | topic: ${opts.topic}`
		);
		return;
	}

	if (!env.RESEND_API_KEY) {
		console.log(
			`[DEV] Advisory notification → ${opts.name} <${opts.email}> | topic: ${opts.topic}`
		);
		return;
	}

	const { Resend } = await import('resend');
	const resend = new Resend(env.RESEND_API_KEY);

	const body = `
${heading('New advisory request')}
${paragraph('A new consulting request was submitted through the AuditLift homepage.')}
<div style="background:${BRAND.greenLight};border-radius:8px;padding:18px;margin:0 0 24px;">
  <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:${BRAND.foreground};"><strong>Name:</strong> ${escapeHtml(opts.name)}</p>
  <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:${BRAND.foreground};"><strong>Email:</strong> <a href="mailto:${escapeHtml(opts.email)}" style="color:${BRAND.green};text-decoration:underline;">${escapeHtml(opts.email)}</a></p>
  ${opts.company ? `<p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:${BRAND.foreground};"><strong>Company:</strong> ${escapeHtml(opts.company)}</p>` : ''}
  <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:${BRAND.foreground};"><strong>Topic:</strong> ${escapeHtml(formatConsultingTopic(opts.topic))}</p>
  <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:${BRAND.foreground};"><strong>Logged in:</strong> ${opts.isLoggedIn ? 'Yes' : 'No'}</p>
  ${opts.organizationId ? `<p style="margin:0;font-size:14px;line-height:1.6;color:${BRAND.foreground};"><strong>Organization ID:</strong> ${escapeHtml(opts.organizationId)}</p>` : ''}
</div>
${opts.message ? `${paragraph(`<strong>Message:</strong><br>${escapeHtml(opts.message).replace(/\n/g, '<br>')}`)}` : ''}
${paragraph(`Reply directly to this email to reach ${escapeHtml(opts.name)} at ${escapeHtml(opts.email)}.`)}`;

	const result = await resend.emails.send({
		from: 'AuditLift <hello@auditlift.app>',
		to: advisoryEmail,
		subject: `New advisory request — ${formatConsultingTopic(opts.topic)}`,
		replyTo: opts.email,
		html: emailWrapper('New advisory request', body)
	});

	if (result.error) {
		console.error('[email] Advisory notification failed:', result.error);
		throw new Error(
			`Failed to send advisory notification: ${result.error.name} — ${result.error.message}`
		);
	}
}

export async function sendConsultingConfirmation(opts: {
	to: string;
	name: string;
	topic: string;
}): Promise<void> {
	if (!env.RESEND_API_KEY) {
		console.log(`[DEV] Consulting confirmation → ${opts.to} | topic: ${opts.topic}`);
		return;
	}

	const { Resend } = await import('resend');
	const resend = new Resend(env.RESEND_API_KEY);

	const firstName = escapeHtml(opts.name.split(' ')[0] || 'there');

	const body = `
${heading(`Thanks, ${firstName}`)}
${paragraph(`We received your <strong>${escapeHtml(formatConsultingTopic(opts.topic))}</strong> request. Our advisory team will review it and get back to you within one business day.`)}
${callout('If your request is urgent, reply to this email and we&rsquo;ll prioritize it.')}
<p style="margin:0 0 24px;">${button('https://auditlift.app/dashboard', 'Go to AuditLift')}</p>
`;

	const result = await resend.emails.send({
		from: 'AuditLift <hello@auditlift.app>',
		to: opts.to,
		subject: 'We received your advisory request',
		html: emailWrapper('Advisory request received', body)
	});

	if (result.error) {
		console.error('[email] Consulting confirmation failed:', result.error);
		throw new Error(
			`Failed to send consulting confirmation: ${result.error.name} — ${result.error.message}`
		);
	}
}
