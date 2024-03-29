import { dev } from '$app/environment';
import { connectionPool } from '$lib/drizzle/mysql/client';
import {
	adapterOptions,
	generateSessionAttributes,
	generateUserAttributes,
	type DatabaseSessionAttributes,
	type DatabaseUserAttributes
} from '$lib/lucia/utils';
import { Mysql2Adapter } from '@lucia-auth/adapter-mysql';
import { Lucia } from 'lucia';

const adapter = new Mysql2Adapter(connectionPool, adapterOptions);

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
