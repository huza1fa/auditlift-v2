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
