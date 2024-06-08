import { dev } from '$app/environment';
import {
    adapterOptions,
    generateSessionAttributes,
    generateUserAttributes,
    type DatabaseSessionAttributes,
    type DatabaseUserAttributes
} from '$lib/server/auth/lucia/utils';
import { dbClient } from '$lib/server/db/turso/client';
import { LibSQLAdapter } from '@lucia-auth/adapter-sqlite';
import { Lucia } from 'lucia';

const adapter = new LibSQLAdapter(dbClient, adapterOptions);

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
