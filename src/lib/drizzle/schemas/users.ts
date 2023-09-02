import { blob, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const user = sqliteTable('auth_user', {
	id: text('id', { length: 255 }).primaryKey(),
	email: text('email').unique().notNull(),
});

const userKey = sqliteTable('user_key', {
	id: text('id', { length: 255 }).primaryKey(),
	userId: text('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	hashedPassword: text('hashed_password', { length: 255 })
});

const userSession = sqliteTable('user_session', {
	id: text('id', { length: 255 }).primaryKey(),
	userId: text('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	activeExpires: blob('active_expires', { mode: 'bigint' }).notNull(),
	idleExpires: blob('idle_expires', { mode: 'bigint' }).notNull()
});

export { user, userKey, userSession };
