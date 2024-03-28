import { drizzleClient } from '$lib/drizzle/turso/client';
import { user, userProfile } from '$lib/drizzle/turso/schema';
import { eq } from 'drizzle-orm';

const getUserByEmail = async (email: string | undefined) => {
	if (!email) {
		return undefined;
	}

	return await drizzleClient.select().from(user).where(eq(user.email, email)).get();
};

const createUser = async (data: typeof user.$inferInsert) => {
	return await drizzleClient.insert(user).values(data).returning().get();
};

const updateUserData = async (userId: string, data: Partial<typeof user.$inferInsert>) => {
	await drizzleClient.update(user).set(data).where(eq(user.id, userId));
};

const updateUserProfileData = async (profileData: typeof userProfile.$inferInsert) => {
	return await drizzleClient
		.insert(userProfile)
		.values(profileData)
		.onConflictDoUpdate({
			target: userProfile.userId,
			set: Object.fromEntries(
				Object.entries(profileData).filter(([key]) => !['id', 'userId'].includes(key))
			)
		})
		.returning()
		.get();
};

const getUserProfileData = async (userId: string | undefined) => {
	if (!userId) {
		return undefined;
	}

	return await drizzleClient.select().from(userProfile).where(eq(userProfile.userId, userId)).get();
};

export { createUser, getUserByEmail, getUserProfileData, updateUserData, updateUserProfileData };
