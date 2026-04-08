import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	trustedOrigins: [env.ORIGIN, 'https://auditlift-v2-production.up.railway.app','https://auditlift.app'],
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: { ...schema }
	}),
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET
		},
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			scope: ['user:email', 'read:user'],
			getUserInfo: async (token) => {
				const headers = {
					Authorization: `Bearer ${token.accessToken}`,
					Accept: 'application/vnd.github+json'
				};

				const [userRes, emailsRes] = await Promise.all([
					fetch('https://api.github.com/user', { headers }),
					fetch('https://api.github.com/user/emails', { headers })
				]);

				const user = await userRes.json();
				const emailsData = await emailsRes.json();
				const emails: Array<{ email: string; primary: boolean; verified: boolean }> = Array.isArray(
					emailsData
				)
					? emailsData
					: [];

				// GitHub noreply address — unique per user, used when email is private
				const noreplyEmail = `${user.id}+${user.login}@users.noreply.github.com`;

				const primaryEmail =
					user.email ??
					emails.find((e) => e.primary && e.verified)?.email ??
					emails.find((e) => e.verified)?.email ??
					emails[0]?.email ??
					noreplyEmail;

				return {
					user: {
						id: String(user.id),
						name: user.name ?? user.login,
						email: primaryEmail,
						image: user.avatar_url,
						emailVerified: true
					},
					data: user
				};
			}
		}
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		sendResetPassword: async ({ user, url }) => {
			const { sendPasswordResetEmail } = await import('$lib/server/email');
			await sendPasswordResetEmail({
				to: user.email,
				name: user.name ?? '',
				resetLink: url
			});
		}
	},
	plugins: [sveltekitCookies(getRequestEvent)]
});
