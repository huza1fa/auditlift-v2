import adapter from '@sveltejs/adapter-node';
import { relative, sep } from 'node:path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// defaults to rune mode for the project, execept for `node_modules`. Can be removed in svelte 6.
		runes: ({ filename }) => {
			const relativePath = relative(import.meta.dirname, filename);
			const pathSegments = relativePath.toLowerCase().split(sep);
			const isExternalLibrary = pathSegments.includes('node_modules');

			return isExternalLibrary ? undefined : true;
		}
	},
	kit: {
		adapter: adapter(),
		paths: {
			relative: false
		},
		csp: {
			mode: 'nonce',
			directives: {
				'default-src': ['self'],
				'script-src': [
					'self',
					'https://us-assets.i.posthog.com',
					'https://static.cloudflareinsights.com',
					'https://www.googletagmanager.com'
				],
				'worker-src': ['self', 'blob:', 'data:'],
				'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
				'font-src': ['self', 'https://fonts.gstatic.com'],
				'img-src': ['self', 'data:', 'https:'],
				'connect-src': [
					'self',
					'https://api.openrouter.ai',
					'https://api.stripe.com',
					'https://us.i.posthog.com',
					'https://us-assets.i.posthog.com',
					'https://www.google-analytics.com',
					'https://region1.google-analytics.com',
					'https://cloudflareinsights.com',
					'https://*.cloudflareinsights.com',
					...(process.env.BUCKET_NAME
						? [
								`https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION || 'us-east-1'}.amazonaws.com`
							]
						: [])
				],
				'frame-ancestors': ['none']
			}
		}
	}
};

export default config;
