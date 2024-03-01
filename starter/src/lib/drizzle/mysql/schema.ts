import { bigint, boolean, int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { generateId } from 'lucia';

const timestampValues = {
	createdAt: timestamp('created_at', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date())
};

const user = mysqlTable('auth_user', {
	...timestampValues,
	id: varchar('id', { length: 255 })
		.primaryKey()
		.$defaultFn(() => generateId(15)),
	email: varchar('email', { length: 255 }).unique().notNull(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	hashedPassword: varchar('hashed_password', { length: 512 }),

	// From GitHub
	githubUsername: varchar('github_username', { length: 255 }).unique()
});

const userProfile = mysqlTable('user_profile', {
	...timestampValues,
	id: varchar('id', { length: 255 })
		.primaryKey()
		.$defaultFn(() => generateId(15)),
	userId: varchar('user_id', { length: 255 })
		.unique()
		.notNull()
		.references(() => user.id),

	// From Google
	firstName: varchar('first_name', { length: 255 }),
	lastName: varchar('last_name', { length: 255 }),
	picture: varchar('picture', { length: 1024 })
});

const emailVerification = mysqlTable('email_verification', {
	...timestampValues,
	id: varchar('id', { length: 255 })
		.primaryKey()
		.$defaultFn(() => generateId(15)),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expires: bigint('expires', { mode: 'bigint' }).notNull()
});

const passwordResetToken = mysqlTable('password_reset_token', {
	...timestampValues,
	id: varchar('id', { length: 255 })
		.primaryKey()
		.$defaultFn(() => generateId(15)),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expires: bigint('expires', { mode: 'bigint' }).notNull()
});

const userSession = mysqlTable('user_session', {
	...timestamp,
	id: varchar('id', { length: 255 })
		.primaryKey()
		.$defaultFn(() => generateId(15)),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expiresAt: int('expires_at').notNull()
});

export { emailVerification, passwordResetToken, user, userProfile, userSession };
