import { dev } from '$app/environment';
import {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET,
    GOOGLE_OAUTH_REDIRECT_URI
} from '$env/static/private';
import { dbClient } from '$lib/drizzle/turso/client';
import { libsql } from '@lucia-auth/adapter-sqlite';
import { github, google } from '@lucia-auth/oauth/providers';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: libsql(dbClient, {
		user: 'auth_user',
		key: 'user_key',
		session: 'user_session'
	}),

	getUserAttributes: (data) => {
		return {
			email: data.email,
			emailVerified: data.email_verified,
			githubUsername: data.github_username
		};
	}
});

export const githubAuth = github(auth, {
	clientId: GITHUB_CLIENT_ID,
	clientSecret: GITHUB_CLIENT_SECRET
});

export const googleAuth = google(auth, {
	clientId: GOOGLE_OAUTH_CLIENT_ID,
	clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
	redirectUri: GOOGLE_OAUTH_REDIRECT_URI,
	scope: [
		'openid',
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email'
	],
	accessType: 'offline'
});

export type Auth = typeof auth;
