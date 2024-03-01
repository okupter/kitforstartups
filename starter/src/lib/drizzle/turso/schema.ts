import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const timestamp = {
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
};

const user = sqliteTable('auth_user', {
	...timestamp,
	id: text('id', { length: 255 }).primaryKey(),
	email: text('email').unique().notNull(),
	emailVerified: blob('email_verified', { mode: 'json' }).$type<boolean>().default(false).notNull(),

	// From GitHub
	githubUsername: text('github_username', { length: 255 }).unique()
});

const userProfile = sqliteTable('user_profile', {
	...timestamp,
	id: text('id', { length: 255 }).primaryKey(),
	userId: text('user_id', { length: 255 })
		.unique()
		.notNull()
		.references(() => user.id),

	// From Google
	firstName: text('first_name', { length: 255 }),
	lastName: text('last_name', { length: 255 }),
	picture: text('picture', { length: 1024 })
});

const emailVerification = sqliteTable('email_verification', {
	...timestamp,
	id: text('id', { length: 255 }).primaryKey(),
	userId: text('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expires: blob('expires', { mode: 'bigint' }).notNull()
});

const passwordResetToken = sqliteTable('password_reset_token', {
	...timestamp,
	id: text('id', { length: 255 }).primaryKey(),
	userId: text('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expires: blob('expires', { mode: 'bigint' }).notNull()
});

const userKey = sqliteTable('user_key', {
	...timestamp,
	id: text('id', { length: 255 }).primaryKey(),
	userId: text('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	hashedPassword: text('hashed_password', { length: 255 })
});

const userSession = sqliteTable('user_session', {
	...timestamp,
	id: text('id', { length: 255 }).primaryKey(),
	userId: text('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	activeExpires: blob('active_expires', { mode: 'bigint' }).notNull(),
	idleExpires: blob('idle_expires', { mode: 'bigint' }).notNull()
});

export { emailVerification, passwordResetToken, user, userKey, userProfile, userSession };
