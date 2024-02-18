import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config();

export default {
	schema: './src/lib/server/drizzle/turso/schema.ts',
	driver: 'turso',
	dbCredentials: {
		url: process.env.TURSO_DB_URL as string,
		authToken: process.env.TURSO_AUTH_TOKEN as string
	},
	out: './src/lib/server/drizzle/migrations/data'
} satisfies Config;
