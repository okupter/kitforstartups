import {
	getUserByEmail,
	getUserProfileData,
	updateUserProfileData
} from '$lib/drizzle/models/users';
import { auth, googleAuth } from '$lib/lucia';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { error } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const GET = async ({ url, cookies, locals }) => {
	const storedState = cookies.get('google_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	// Validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const { getExistingUser, googleUser, createUser, createKey } =
			await googleAuth.validateCallback(code);

		const getUser = async () => {
			const existingUser = await getExistingUser();

			if (existingUser) {
				return existingUser;
			}

			if (!googleUser.email) {
				throw error(400, 'Google email not found');
			}

			const existingDatabaseUserWithEmail = await getUserByEmail(googleUser.email);

			if (existingDatabaseUserWithEmail) {
				const user = auth.transformDatabaseUser(existingDatabaseUserWithEmail);
				await createKey(user.userId);

				return user;
			}

			return await createUser({
				attributes: {
					email: googleUser.email
				}
			});
		};

		const user = await getUser();

		const profileData = await getUserProfileData(user.userId);

		// Update profile table with Google profile data
		await updateUserProfileData({
			id: nanoid(),
			userId: user.userId,
			firstName:
				!profileData?.firstName || profileData?.firstName?.trim().length === 0
					? googleUser.given_name
					: profileData?.firstName,
			lastName:
				!profileData?.lastName || profileData?.lastName?.trim().length === 0
					? googleUser.family_name
					: profileData?.lastName,
			picture:
				!profileData?.picture || profileData?.picture?.trim().length === 0
					? googleUser.picture
					: profileData?.picture
		});

		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});

		locals.auth.setSession(session);

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/profile'
			}
		});
	} catch (e) {
		if (e instanceof OAuthRequestError) {
			// Invalid code
			return new Response(null, {
				status: 400
			});
		}

		return new Response(null, {
			status: 500
		});
	}
};
