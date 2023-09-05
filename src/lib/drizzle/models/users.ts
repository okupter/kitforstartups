import { drizzleClient } from '$lib/drizzle/client';
import { user } from '$lib/drizzle/schemas';
import { userProfile } from '$lib/drizzle/schemas/users';
import { eq } from 'drizzle-orm';

const getUserByEmail = async (email: string) => {
	return await drizzleClient.select().from(user).where(eq(user.email, email)).get();
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

export { getUserByEmail, getUserProfileData, updateUserProfileData };
