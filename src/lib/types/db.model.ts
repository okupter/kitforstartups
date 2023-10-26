import type { employee, employeeCodes, employeeProfile, user, userKey, userProfile } from '$lib/drizzle/mysql/schema';


export type InsertUserKey = typeof userKey.$inferInsert;
export type UpdateUserKey = InsertUserKey;
export type SelectUserKey = typeof userKey.$inferSelect;

export type InsertUser = typeof user.$inferInsert;
export type UpdateUser = InsertUser;
export type SelectUser = typeof user.$inferSelect;

export type InsertUserProfile = typeof userProfile.$inferInsert;
export type UpdateUserProfile = InsertUserProfile;
export type SelectUserProfile = typeof userProfile.$inferSelect;

export type RoleTypes = "user" | "supervisor" | "admin" | "org_admin" | "super_admin" | undefined;

export type UserProfile = SelectUserProfile;
export type User = { auth_user: SelectUser, user_profile: SelectUserProfile };

export type SelectEmployee = typeof employee.$inferSelect;
export type SelectEmployeeProfile = typeof employeeProfile.$inferSelect;
export type EmployeeProfile = SelectEmployeeProfile;
export type SelectEmployeeCodes = typeof employeeCodes.$inferSelect;
export type Employee = SelectEmployee & { employeeProfile: SelectEmployeeProfile, employeeCodes: SelectEmployeeCodes[] };
export type InsertEmployee = typeof employee.$inferInsert;
export type InsertEmployeeProfile = typeof employeeProfile.$inferInsert;