import { dev } from '$app/environment';
import {
    adapterOptions,
    generateSessionAttributes,
    generateUserAttributes,
    type DatabaseSessionAttributes,
    type DatabaseUserAttributes
} from '$lib/server/auth/lucia/utils';
import { connection } from '$lib/server/db/postgres/client';
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
