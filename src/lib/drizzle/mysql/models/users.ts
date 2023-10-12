import { drizzleClient } from '$lib/drizzle/mysql/client';
import { user, userKey, userProfile } from '$lib/drizzle/mysql/schema';
import type { InsertUser, InsertUserKey, InsertUserProfile } from '$lib/types/db.model';
import { eq, ne, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

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

const getUsers = async (clientId: string) => {
	const data = await drizzleClient.select()
		.from(userProfile)
		.innerJoin(user, eq(userProfile.userId, user.id))
		.where(and(eq(userProfile.clientId, clientId), ne(userProfile.role, 'super_admin')))
		.orderBy(userProfile.firstName);

	return data;
}

const createUser = async (userData: InsertUser, userKeyData: InsertUserKey, profileData: InsertUserProfile) => {
	
	if (!userData.id) return { success: false, error: 'User ID is required.' };
	if (!userProfile.id) return { success: false, error: 'User Profile ID is required.' };
	if (!userProfile.userId) profileData.userId = userData.id;
	
	try {
		await drizzleClient.transaction(async (tx) => {
			await tx.insert(user).values(userData);
			await tx.insert(userKey).values(userKeyData);
			await tx.insert(userProfile).values(profileData);
		});
	} catch (err) {
		console.error(err);
		
		return {
			success: false,
			error: err,
		};
	}
	
	return { success: true, };
}

export { getUserByEmail, getUserProfileData, updateUserProfileData, getUsers, createUser };
