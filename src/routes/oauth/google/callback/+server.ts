import { getUserByEmail } from '$lib/drizzle/models/users';
import { auth, googleAuth } from '$lib/lucia';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { error } from '@sveltejs/kit';

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
		console.log('googleUser', googleUser);

		const getUser = async () => {
			const existingUser = await getExistingUser();
			console.log('existingUser', existingUser);

			if (existingUser) {
				return existingUser;
			}

			if (!googleUser.email) {
				throw error(400, 'Google email not found');
			}

			const existingDatabaseUserWithEmail = await getUserByEmail(googleUser.email);
			console.log('existingDatabaseUserWithEmail', existingDatabaseUserWithEmail);

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
