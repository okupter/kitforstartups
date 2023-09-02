import { drizzleClient } from '$lib/drizzle/client';
import { user } from '$lib/drizzle/schemas';
import { eq } from 'drizzle-orm';

const getUserByEmail = async (email: string) => {
	return await drizzleClient.select().from(user).where(eq(user.email, email)).get();
};

export { getUserByEmail };
