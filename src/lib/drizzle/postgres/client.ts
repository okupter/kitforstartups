import { dev } from '$app/environment';
import {
	ENABLE_DRIZZLE_LOGGER,
	POSTGRES_DB_HOST,
	POSTGRES_DB_NAME,
	POSTGRES_DB_PASSWORD,
	POSTGRES_DB_PORT,
	POSTGRES_DB_USER
} from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const connectionPool = new Pool({
	host: POSTGRES_DB_HOST,
	port: Number(POSTGRES_DB_PORT),
	user: POSTGRES_DB_USER,
	password: POSTGRES_DB_PASSWORD,
	database: POSTGRES_DB_NAME
});

const drizzleClient = drizzle(connectionPool, {
	logger: ENABLE_DRIZZLE_LOGGER ? Boolean(ENABLE_DRIZZLE_LOGGER) : dev
});

export { connectionPool, drizzleClient };
