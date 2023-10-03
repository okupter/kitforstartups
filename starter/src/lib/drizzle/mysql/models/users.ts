import { drizzleClient } from '$lib/drizzle/mysql/client';
import { user, userProfile } from '$lib/drizzle/mysql/schema';
import { eq } from 'drizzle-orm';

const getUserByEmail = async (email: string | undefined) => {
	if (!email) {
		return undefined;
	}

	const data = await drizzleClient.select().from(user).where(eq(user.email, email));

	return data[0];
};

const updateUserProfileData = async (profileData: typeof userProfile.$inferInsert) => {
	await drizzleClient
		.insert(userProfile)
		.values(profileData)
		.onDuplicateKeyUpdate({
			set: Object.fromEntries(
				Object.entries(profileData).filter(([key]) => !['id', 'userId'].includes(key))
			)
		});
};

const getUserProfileData = async (userId: string | undefined) => {
	if (!userId) {
		return undefined;
	}

	const data = await drizzleClient.select().from(userProfile).where(eq(userProfile.userId, userId));

	return data[0];
};

export { getUserByEmail, getUserProfileData, updateUserProfileData };
