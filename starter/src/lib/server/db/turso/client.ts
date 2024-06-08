import { ENABLE_DRIZZLE_LOGGER, TURSO_AUTH_TOKEN, TURSO_DB_URL } from '$env/static/private';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { enableLogger } from '../utils';

const dbClient = createClient({ url: TURSO_DB_URL, authToken: TURSO_AUTH_TOKEN });
const drizzleClient = drizzle(dbClient, {
	logger: enableLogger(ENABLE_DRIZZLE_LOGGER)
});

export { dbClient, drizzleClient };
