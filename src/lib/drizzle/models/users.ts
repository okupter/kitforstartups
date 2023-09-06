import { drizzleClient } from '$lib/drizzle/client';
import { user } from '$lib/drizzle/schemas';
import { emailVerification, passwordResetToken, userProfile } from '$lib/drizzle/schemas/users';
import { eq } from 'drizzle-orm';
import { generateRandomString, isWithinExpiration } from 'lucia/utils';

const getUserByEmail = async (email: string | undefined) => {
	if (!email) {
		return undefined;
	}

	return await drizzleClient.select().from(user).where(eq(user.email, email)).get();
};

const getUserById = async (userId: string | undefined) => {
	if (!userId) {
		return undefined;
	}

	return await drizzleClient.select().from(user).where(eq(user.id, userId)).get();
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

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

const generateEmailVerificationToken = async (userId: string | undefined) => {
	if (!userId) {
		throw new Error('Invalid user ID');
	}

	const storedUserTokens = await drizzleClient
		.select()
		.from(emailVerification)
		.where(eq(emailVerification.userId, userId));

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});

		if (reusableStoredToken) {
			return reusableStoredToken.id;
		}
	}

	const token = generateRandomString(63);

	await drizzleClient.insert(emailVerification).values({
		id: token,
		userId: userId,
		expires: BigInt(new Date().getTime() + EXPIRES_IN)
	});

	return token;
};

const generatePasswordResetToken = async (userId: string) => {
	const storedUserTokens = await drizzleClient
		.select()
		.from(passwordResetToken)
		.where(eq(passwordResetToken.userId, userId));

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});

		if (reusableStoredToken) {
			return reusableStoredToken.id;
		}
	}

	const token = generateRandomString(63);

	await drizzleClient.insert(passwordResetToken).values({
		id: token,
		userId,
		expires: BigInt(new Date().getTime() + EXPIRES_IN)
	});

	return token;
};

const validateEmailVerificationToken = async (token: string) => {
	const storedToken = await drizzleClient
		.select()
		.from(emailVerification)
		.where(eq(emailVerification.id, token))
		.get();

	if (!storedToken) {
		throw new Error('Invalid token');
	}

	// Delete all tokens for the user
	await drizzleClient
		.delete(emailVerification)
		.where(eq(emailVerification.userId, storedToken.userId));

	const tokenExpires = Number(storedToken.expires);

	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}

	return storedToken.userId;
};

const validatePasswordResetToken = async (token: string) => {
	const storedToken = await drizzleClient
		.select()
		.from(passwordResetToken)
		.where(eq(passwordResetToken.id, token))
		.get();

	if (!storedToken) {
		throw new Error('Invalid token');
	}

	// Delete all tokens for the user
	await drizzleClient
		.delete(passwordResetToken)
		.where(eq(passwordResetToken.userId, storedToken.userId));

	const tokenExpires = Number(storedToken.expires);

	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}

	return storedToken.userId;
};

export {
	generateEmailVerificationToken,
	generatePasswordResetToken,
	getUserByEmail,
	getUserById,
	getUserProfileData,
	updateUserProfileData,
	validateEmailVerificationToken,
	validatePasswordResetToken
};
