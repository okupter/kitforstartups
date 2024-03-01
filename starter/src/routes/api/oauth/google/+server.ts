import { dev } from '$app/environment';
import { googleAuth } from '$lib/lucia/turso';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies }) => {
	const [url, state] = await googleAuth.getAuthorizationUrl();

	// Store state
	cookies.set('google_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});

	throw redirect(302, url.toString());
};
