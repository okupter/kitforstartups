import { dev } from '$app/environment';
import { githubAuth } from '$lib/lucia/mysql';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies }) => {
	const [url, state] = await githubAuth.getAuthorizationUrl();

	// Store state
	cookies.set('github_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});

	throw redirect(302, url.toString());
};
