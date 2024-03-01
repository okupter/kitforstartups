import { dev } from '$app/environment';
import { connection } from '$lib/drizzle/postgres/client';
import {
	adapterOptions,
	generateSessionAttributes,
	generateUserAttributes,
	type DatabaseSessionAttributes,
	type DatabaseUserAttributes
} from '$lib/lucia/utils';
import { PostgresJsAdapter } from '@lucia-auth/adapter-postgresql';
import { Lucia } from 'lucia';

const adapter = new PostgresJsAdapter(connection, adapterOptions);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return generateUserAttributes(attributes);
	},
	getSessionAttributes: (attributes) => {
		return generateSessionAttributes(attributes);
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
}
