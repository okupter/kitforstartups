import { dev } from '$app/environment';
import { githubAuth } from '$lib/server/auth/lucia/oauth';
import { redirect } from '@sveltejs/kit';
import { generateState } from 'arctic';

export const GET = async ({ cookies }) => {
	const state = generateState();
	const url = await githubAuth.createAuthorizationURL(state);

	cookies.set('github_oauth_state', state, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	redirect(302, url.toString());
};
