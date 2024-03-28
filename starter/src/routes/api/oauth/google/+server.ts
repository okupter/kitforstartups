import { dev } from '$app/environment';
import { googleAuth, googleScopes } from '$lib/lucia/oauth';
import { redirect } from '@sveltejs/kit';
import { generateState } from 'arctic';
import { alphabet, generateRandomString } from 'oslo/crypto';

export const GET = async ({ cookies }) => {
	const state = generateState();
	const codeVerifier = generateRandomString(128, alphabet('a-z', 'A-Z', '0-9', '-', '_'));
	const url = await googleAuth.createAuthorizationURL(state, codeVerifier, {
		scopes: googleScopes
	});

	cookies.set('google_oauth_state', state, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	cookies.set('google_oauth_code_verifier', codeVerifier, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	redirect(302, url.toString());
};
