import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { generateId } from 'lucia';

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
	id: text('id', { length: 255 })
		.primaryKey()
		.$defaultFn(() => generateId(15)),
	email: text('email').unique().notNull(),
	emailVerified: text('email_verified').$type<boolean>().default(false).notNull(),
	hashedPassword: text('hashed_password', { length: 512 }),

	// From GitHub
	githubUsername: text('github_username', { length: 255 }).unique()
});

const userProfile = sqliteTable('user_profile', {
	...timestamp,
	id: text('id', { length: 255 })
		.primaryKey()
		.$defaultFn(() => generateId(15)),
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
	id: text('id', { length: 255 })
		.primaryKey()
		.$defaultFn(() => generateId(15)),
	userId: text('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expires: integer('expires').notNull()
});

const passwordResetToken = sqliteTable('password_reset_token', {
	...timestamp,
	id: text('id', { length: 255 })
		.primaryKey()
		.$defaultFn(() => generateId(15)),
	userId: text('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expires: integer('expires').notNull()
});

const userSession = sqliteTable('user_session', {
	...timestamp,
	id: text('id', { length: 255 })
		.primaryKey()
		.$defaultFn(() => generateId(15)),
	userId: text('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expires_at: integer('expires_at').notNull()
});

export { emailVerification, passwordResetToken, user, userProfile, userSession };
