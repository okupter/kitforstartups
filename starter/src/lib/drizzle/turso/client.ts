import { dev } from '$app/environment';
import { TURSO_AUTH_TOKEN, TURSO_DB_URL } from '$env/static/private';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const dbClient = createClient({ url: TURSO_DB_URL, authToken: TURSO_AUTH_TOKEN });
const drizzleClient = drizzle(dbClient, {
	logger: dev
});

export { dbClient, drizzleClient };
