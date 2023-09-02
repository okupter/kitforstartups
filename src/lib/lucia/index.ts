import { dev } from '$app/environment';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { dbClient } from '$lib/drizzle/client';
import { libsql } from '@lucia-auth/adapter-sqlite';
import { github } from '@lucia-auth/oauth/providers';
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
			githubUsername: data.github_username
		};
	}
});

export const githubAuth = github(auth, {
	clientId: GITHUB_CLIENT_ID,
	clientSecret: GITHUB_CLIENT_SECRET
});

export type Auth = typeof auth;
