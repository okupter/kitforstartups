import { dev } from '$app/environment';
import { dbClient } from '$lib/drizzle/client';
import { libsql } from '@lucia-auth/adapter-sqlite';
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
		};
	}
});

export type Auth = typeof auth;
