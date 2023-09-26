import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

dotenv.config();

const dbClient = createClient({
	url: process.env.TURSO_DB_URL as string,
	authToken: process.env.TURSO_AUTH_TOKEN as string
});
const drizzleClient = drizzle(dbClient);

await migrate(drizzleClient, { migrationsFolder: 'src/lib/drizzle/turso/migrations/data' })
	.then(() => {
		console.log('Migrations completed');
		process.exit(0);
	})
	.catch((err) => {
		throw err;
	});
