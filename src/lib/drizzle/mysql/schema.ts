import { relations } from 'drizzle-orm';
import { bigint, boolean, mysqlEnum, mysqlTable, unique, varchar } from 'drizzle-orm/mysql-core';

const user = mysqlTable('auth_user', {
	id: varchar('id', { length: 255 }).primaryKey(),
	email: varchar('email', { length: 255 }).unique().notNull(),
	emailVerified: boolean('email_verified').default(false).notNull(),

	// From GitHub
	githubUsername: varchar('github_username', { length: 255 }).unique()
});

const userProfile = mysqlTable('user_profile', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.unique()
		.notNull()
		.references(() => user.id),

	clientId: varchar('client_id', { length: 255 })
		.references(() => client.id),
	role: mysqlEnum('role', ['user', 'supervisor', 'admin', 'org_admin', 'super_admin'])
		.default('user')
		.notNull(),

	// From Google
	firstName: varchar('first_name', { length: 255 }),
	lastName: varchar('last_name', { length: 255 }),
	picture: varchar('picture', { length: 1024 })
});

const employee = mysqlTable('employee', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.unique()
		.references(() => user.id),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	firstName: varchar('first_name', { length: 255 }).notNull(),
	lastName: varchar('last_name', { length: 255 }).notNull(),
	created: bigint('created', { mode: 'bigint' }).notNull(),
	updated: bigint('updated', { mode: 'bigint' }).notNull(),
	deleted: bigint('deleted', { mode: 'bigint' }),
});

const employeeRelations = relations(employee, ({ many, one }) => ({
	employeeProfile: one(employeeProfile, {
		fields: [employee.id],
		references: [employeeProfile.employeeId],
	}),
	employeeCodes: many(employeeCodes),
}));

const employeeProfile = mysqlTable('employee_profile', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.unique()
		.notNull()
		.references(() => employee.id),
	address: varchar('address', { length: 255 }).notNull(),
	address2: varchar('address_2', { length: 255 }),
	city: varchar('city', { length: 255 }).notNull(),
	state: varchar('state', { length: 255 }).notNull(),
	zip: varchar('zip', { length: 255 }).notNull(),
	phone: varchar('phone', { length: 255 }).notNull(),
	phone2: varchar('phone_2', { length: 255 }),
	email: varchar('email', { length: 255 }).notNull(),
});

const employeeCodes = mysqlTable('employee_codes', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	employeeCode: varchar('employee_code', { length: 255 }).notNull(),
	isActive: boolean('is_active').default(false).notNull(),
}, (t) => ({
	unq: unique().on(t.employeeId, t.employeeCode),
}));

const employeeCodesRelations = relations(employeeCodes, ({ one }) => ({
	employee: one(employee, {
		fields: [employeeCodes.employeeId],
		references: [employee.id],
	}),
}));

const emailVerification = mysqlTable('email_verification', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expires: bigint('expires', { mode: 'bigint' }).notNull()
});

const passwordResetToken = mysqlTable('password_reset_token', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expires: bigint('expires', { mode: 'bigint' }).notNull()
});

const userKey = mysqlTable('user_key', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	hashedPassword: varchar('hashed_password', { length: 255 })
});

const client = mysqlTable('client', {
	id: varchar('id', { length: 255 }).primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	contactUserId: varchar('contact_user_id', { length: 255 })
		.references(() => user.id),
	created: bigint('created', { mode: 'bigint' }).notNull(),
	updated: bigint('updated', { mode: 'bigint' }).notNull(),
	deleted: bigint('deleted', { mode: 'bigint' }),
});

const userSession = mysqlTable('user_session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	activeExpires: bigint('active_expires', { mode: 'bigint' }).notNull(),
	idleExpires: bigint('idle_expires', { mode: 'bigint' }).notNull()
});

export {
	emailVerification, passwordResetToken, user, userKey, userProfile, client, userSession,
	employee, employeeProfile, employeeCodes, employeeRelations, employeeCodesRelations,
};

