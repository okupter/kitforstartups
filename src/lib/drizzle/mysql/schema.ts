import { relations } from 'drizzle-orm';
import { bigint, boolean, double, mysqlEnum, mysqlTable, text, tinyint, unique, varchar } from 'drizzle-orm/mysql-core';

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
	employeeNotes: many(employeeNotes),
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

const employeeNotes = mysqlTable('employee_notes', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	note: text('note').notNull(),
	created: bigint('created', { mode: 'bigint' }).notNull(),
})

const employeeNotesRelations = relations(employeeNotes, ({ one }) => ({
	employee: one(employee, {
		fields: [employeeNotes.employeeId],
		references: [employee.id],
	}),
}));

const employeeCodes = mysqlTable('employee_codes', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	campaignId: varchar('campaign_id', { length: 255 })
		.notNull()
		.references(() => campaigns.id)
		.default(''),
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

const campaigns = mysqlTable('campaigns', {
	id: varchar('id', { length: 255 }).primaryKey(),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	name: varchar('name', { length: 255 }).notNull(),
	url: varchar('url', { length: 255 }).default(''),
	description: text('description').default(''),
	active: boolean('active').default(false).notNull(),
	created: bigint('created', { mode: 'bigint' }).notNull(),
	updated: bigint('updated', { mode: 'bigint' }).notNull(),
});

const payrollCycle = mysqlTable('payroll_cycle', {
	id: varchar('id', { length: 255 }).primaryKey(),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	startDate: bigint('start_date', { mode: 'bigint' }).notNull(),
	endDate: bigint('end_date', { mode: 'bigint' }).notNull(),
	paymentDate: bigint('payment_date', { mode: 'bigint' }).notNull(),
	created: bigint('created', { mode: 'bigint' }).notNull(),
	updated: bigint('updated', { mode: 'bigint' }).notNull(),
	deleted: bigint('deleted', { mode: 'bigint' }),
});

const paystub = mysqlTable('paystub', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	payrollCycleId: varchar('payroll_cycle_id', { length: 255 })
		.notNull()
		.references(() => payrollCycle.id),
	campaignId: varchar('campaign_id', { length: 255 })
		.notNull()
		.references(() => campaigns.id),
	totalSales: bigint('total_sales', { mode: 'bigint' }).notNull(),
	totalOverrides: bigint('total_overrides', { mode: 'bigint' }).notNull(),
	pieceRate: double('piece_rate').notNull(),
	grossPay: double('gross_pay').notNull(),
	netPay: double('net_pay').notNull(),
	taxDeductions: double('tax_deductions').notNull().default(0),
	otherDeductions: double('other_deductions').notNull().default(0),
	created: bigint('created', { mode: 'bigint' }).notNull(),
	updated: bigint('updated', { mode: 'bigint' }).notNull(),
	deleted: bigint('deleted', { mode: 'bigint' }),
});

const paystubRelations = relations(paystub, ({ one, many }) => ({
	employee: one(employee, {
		fields: [paystub.employeeId],
		references: [employee.id],
	}),
	sales: many(sale),
}));

const sale = mysqlTable('sale', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	paystubId: varchar('paystub_id', { length: 255 })
		.notNull()
		.references(() => paystub.id),
	campaignId: varchar('campaign_id', { length: 255 })
		.notNull()
		.references(() => campaigns.id),
	saleDate: bigint('sale_date', { mode: 'bigint' }).notNull(),
	saleAmount: double('sale_amount').notNull().default(0),
	isComplete: tinyint('is_complete').notNull().default(0),
	statusDescription: mysqlEnum('status_description', ['pending', 'approved', 'rejected']).notNull(),
	created: bigint('created', { mode: 'bigint' }).notNull(),
	updated: bigint('updated', { mode: 'bigint' }).notNull(),
	deleted: bigint('deleted', { mode: 'bigint' }),
});

const saleRelations = relations(sale, ({ one }) => ({
	paystub: one(paystub, {
		fields: [sale.paystubId],
		references: [paystub.id],
	}),
	campaign: one(campaigns, {
		fields: [sale.campaignId],
		references: [campaigns.id],
	}),
	employee: one(employee, {
		fields: [sale.employeeId],
		references: [employee.id],
	}),
}));

const saleOverride = mysqlTable('sale_override', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	originatingSaleId: varchar('sale_id', { length: 255 })
		.notNull()
		.references(() => sale.id),
	originatingEmployeeId: varchar('originating_employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	beneficiaryEmployeeId: varchar('beneficiary_employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	overrideAmount: double('override_amount').notNull().default(0),
});

const expenseReport = mysqlTable('expense_report', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	paystubId: varchar('paystub_id', { length: 255 })
		.notNull()
		.references(() => paystub.id),
	submissionDate: bigint('submission_date', { mode: 'bigint' }).notNull(),
	approvalStatus: mysqlEnum('approval_status', ['pending', 'approved', 'rejected']).notNull(),
	approvalDate: bigint('approval_date', { mode: 'bigint' }),
	approvalNotes: text('approval_notes'),
	totalAmount: double('total_amount').notNull().default(0),
	created: bigint('created', { mode: 'bigint' }).notNull(),
	updated: bigint('updated', { mode: 'bigint' }).notNull(),
	deleted: bigint('deleted', { mode: 'bigint' }),
});

const expenseItem = mysqlTable('expense_item', {
	id: varchar('id', { length: 255 }).primaryKey(),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	exportReportId: varchar('expense_report_id', { length: 255 })
		.notNull()
		.references(() => expenseReport.id),
	description: text('description').notNull(),
	amount: double('amount').notNull().default(0),
	dateIncurred: bigint('date_incurred', { mode: 'bigint' }).notNull(),
	receiptUrl: varchar('receipt_url', { length: 1024 }),
});

export {
	emailVerification, passwordResetToken, user, userKey, userProfile, client, userSession,
	employee, employeeProfile, employeeCodes, employeeRelations, employeeCodesRelations,
	employeeNotes, employeeNotesRelations, campaigns, payrollCycle, paystub, sale, saleOverride,
	expenseReport, expenseItem, paystubRelations, saleRelations,
};

