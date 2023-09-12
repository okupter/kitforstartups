import { dev } from '$app/environment';
import { connection } from '$lib/drizzle/postgres/client';
import {
	adapterOptions,
	generateUserAttributes,
	githubAuthOptions,
	googleAuthOptions
} from '$lib/lucia/utils';
import { postgres } from '@lucia-auth/adapter-postgresql';
import { github, google } from '@lucia-auth/oauth/providers';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: postgres(connection, adapterOptions),

	getUserAttributes: (data) => {
		return generateUserAttributes(data);
	}
});

export const githubAuth = github(auth, githubAuthOptions);
export const googleAuth = google(auth, googleAuthOptions);

export type Auth = typeof auth;
