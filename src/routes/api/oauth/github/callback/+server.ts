import { getUserByEmail } from '$lib/drizzle/models/users';
import { auth, githubAuth } from '$lib/lucia';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { error } from '@sveltejs/kit';

export const GET = async ({ url, cookies, locals }) => {
	const storedState = cookies.get('github_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	// Validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const { getExistingUser, githubUser, createUser, createKey } =
			await githubAuth.validateCallback(code);

		const getUser = async () => {
			const existingUser = await getExistingUser();

			if (existingUser) {
				return existingUser;
			}

			if (!githubUser.email) {
				throw error(400, 'No email provided by GitHub');
			}

			const existingDatabaseUserWithEmail = await getUserByEmail(githubUser.email);

			if (existingDatabaseUserWithEmail) {
				const user = auth.transformDatabaseUser(existingDatabaseUserWithEmail);
				await createKey(user.userId);

				return user;
			}

			return await createUser({
				attributes: {
					email: githubUser.email,
					github_username: githubUser.login
				}
			});
		};

		const user = await getUser();

		// Update user attributes with GitHub username
		if (!user.githubUsername) {
			await auth.updateUserAttributes(user.userId, { github_username: githubUser.login });
		}

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
