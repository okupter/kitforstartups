import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';

dotenv.config();

const connection = mysql.createPool({
	host: process.env.MYSQL_DB_HOST as string,
	user: process.env.MYSQL_DB_USER as string,
	password: process.env.MYSQL_DB_PASSWORD as string,
	database: process.env.MYSQL_DB_NAME as string
});

const drizzleClient = drizzle(connection);

await migrate(drizzleClient, { migrationsFolder: 'src/lib/drizzle/mysql/migrations/data' })
	.then(() => {
		console.log('Migrations completed');
		process.exit(0);
	})
	.catch((err) => {
		throw err;
	});
