import { dev } from '$app/environment';
import { dbClient } from '$lib/drizzle/turso/client';
import {
	adapterOptions,
	generateUserAttributes,
	githubAuthOptions,
	googleAuthOptions
} from '$lib/lucia/utils';
import { libsql } from '@lucia-auth/adapter-sqlite';
import { github, google } from '@lucia-auth/oauth/providers';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: libsql(dbClient, adapterOptions),

	getUserAttributes: (data) => {
		return generateUserAttributes(data);
	}
});

export const githubAuth = github(auth, githubAuthOptions);
export const googleAuth = google(auth, googleAuthOptions);

export type Auth = typeof auth;
