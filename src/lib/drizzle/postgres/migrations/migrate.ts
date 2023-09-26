import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

dotenv.config();

const connection = postgres({
	host: process.env.POSTGRES_DB_HOST,
	port: Number(process.env.POSTGRES_DB_PORT),
	user: process.env.POSTGRES_DB_USER,
	password: process.env.POSTGRES_DB_PASSWORD,
	database: process.env.POSTGRES_DB_NAME,
	max: 1
});

const drizzleClient = drizzle(connection);

await migrate(drizzleClient, { migrationsFolder: 'src/lib/drizzle/postgres/migrations/data' })
	.then(() => {
		console.log('Migrations completed');
		process.exit(0);
	})
	.catch((err) => {
		throw err;
	});
