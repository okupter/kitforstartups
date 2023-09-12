import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

dotenv.config();

const connection = new Pool({
	host: process.env.POSTGRES_DB_HOST,
	port: Number(process.env.POSTGRES_DB_PORT),
	user: process.env.POSTGRES_DB_USER,
	password: process.env.POSTGRES_DB_PASSWORD,
	database: process.env.POSTGRES_DB_NAME
});

const drizzleClient = drizzle(connection);


await migrate(drizzleClient, { migrationsFolder: 'src/lib/drizzle/postgres/migrations' })
	.then(() => {
		console.log('Migrations completed');
		process.exit(0);
	})
	.catch((err) => {
		throw err;
	});
