import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { migrate } from 'drizzle-orm/planetscale-serverless/migrator';
// import mysql from 'mysql2/promise';
import { connect } from '@planetscale/database';

dotenv.config();

// const connection = mysql.createPool({
// 	host: process.env.MYSQL_DB_HOST as string,
// 	// port: parseInt(process.env.MYSQL_DB_PORT as string),
// 	user: process.env.MYSQL_DB_USER as string,
// 	password: process.env.MYSQL_DB_PASSWORD as string,
// 	// database: process.env.MYSQL_DB_NAME as string
// });

const connection = connect({
	host: process.env.MYSQL_DB_HOST as string,
	username: process.env.MYSQL_DB_USER as string,
	password: process.env.MYSQL_DB_PASSWORD as string,
});

const drizzleClient = drizzle(connection);

await migrate(drizzleClient, {
	migrationsFolder: 'src/lib/drizzle/mysql/migrations/data',
}).then(() => {
	console.log('Migrations completed');
	process.exit(0);
});
