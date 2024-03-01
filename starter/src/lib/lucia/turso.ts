import { dev } from '$app/environment';
import { dbClient } from '$lib/drizzle/turso/client';
import {
	adapterOptions,
	generateSessionAttributes,
	generateUserAttributes,
	type DatabaseSessionAttributes,
	type DatabaseUserAttributes
} from '$lib/lucia/utils';
import { LibSQLAdapter } from '@lucia-auth/adapter-sqlite';
import { Lucia } from 'lucia';

const adapter = new LibSQLAdapter(dbClient, adapterOptions);

export const auth = new Lucia(adapter, {
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

export type Auth = typeof auth;

declare module 'lucia' {
	interface Register {
		Lucia: typeof auth;
		DatabaseUserAttributes: DatabaseUserAttributes;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
}
