import { getUserByEmail } from '$lib/drizzle/mysql/models/users';
import { auth, githubAuth } from '$lib/lucia/mysql';
import { getGitHubPrimaryEmailAddress } from '$lib/utils';
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
		const { getExistingUser, githubUser, githubTokens, createUser, createKey } =
			await githubAuth.validateCallback(code);

		const getUser = async () => {
			const existingUser = await getExistingUser();

			if (existingUser) {
				return existingUser;
			}

			let githubUserEmail = githubUser.email;

			if (!githubUser.email) {
				const email = await getGitHubPrimaryEmailAddress(githubTokens.accessToken);

				if (!email) {
					throw error(400, 'No email provided by GitHub');
				} else {
					githubUserEmail = email;
				}
			}

			const existingDatabaseUserWithEmail = await getUserByEmail(String(githubUserEmail));

			if (existingDatabaseUserWithEmail) {
				const user = auth.transformDatabaseUser({
					...existingDatabaseUserWithEmail,
					email_verified: existingDatabaseUserWithEmail.emailVerified,
					github_username: githubUser.login
				});

				await createKey(user.userId);

				return user;
			}

			return await createUser({
				attributes: {
					email: String(githubUserEmail),
					email_verified: true,
					github_username: githubUser.login
				}
			});
		};

		const user = await getUser();

		// Update user attributes with GitHub username and email verified
		await auth.updateUserAttributes(user.userId, {
			github_username: githubUser.login,
			email_verified: true
		});

		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});

		locals.auth.setSession(session);

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/app/profile'
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
