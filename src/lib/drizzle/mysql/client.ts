import { dev } from '$app/environment';
import {
    ENABLE_DRIZZLE_LOGGER} from '$env/static/private';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import * as schema from './schema';
import 'dotenv/config'
import { connect } from '@planetscale/database';

const connection = connect({
    host: process.env.MYSQL_DB_HOST,
    username: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
});

const drizzleClient = drizzle(connection, {
    schema,
    logger: ENABLE_DRIZZLE_LOGGER ? Boolean(ENABLE_DRIZZLE_LOGGER) : dev,
});

export { connection, drizzleClient };
