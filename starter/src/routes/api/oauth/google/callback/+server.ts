import { createUser, getUserByEmail, updateUserData } from '$lib/drizzle/turso/models/users';
import { googleAuth } from '$lib/lucia/oauth';
import { lucia } from '$lib/lucia/turso';
import { OAuth2RequestError, type GoogleRefreshedTokens } from 'arctic';
import { generateId } from 'lucia';

export const GET = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	const savedState = cookies.get('google_oauth_state');
	const savedCodeVerifier = cookies.get('google_oauth_code_verifier');

	if (!code || !state || !savedState || !savedCodeVerifier || state !== savedState) {
		console.error('Invalid state or code');

		return new Response(null, {
			status: 400,
			statusText: 'Bad Request'
		});
	}

	try {
		const tokens = await googleAuth.validateAuthorizationCode(code, savedCodeVerifier);
		let googleRefreshToken: GoogleRefreshedTokens | undefined;

		if (tokens.refreshToken) {
			googleRefreshToken = await googleAuth.refreshAccessToken(tokens.refreshToken);
		}

		const googleUserResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});

		const googleUser = await googleUserResponse.json();

		const existingUser = await getUserByEmail(googleUser.email);

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {
				created_at: new Date(),
				updated_at: new Date()
			});
			const sessionCookie = lucia.createSessionCookie(session.id);

			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			// Update the user's refresh token
			await updateUserData(existingUser.id, {
				googleRefreshToken: googleRefreshToken?.accessToken
			});
		} else {
			const userId = generateId(15);
			await createUser({
				id: userId,
				email: googleUser.email,
				googleRefreshToken: googleRefreshToken?.accessToken
			});

			const session = await lucia.createSession(userId, {
				created_at: new Date(),
				updated_at: new Date()
			});
			const sessionCookie = lucia.createSessionCookie(session.id);

			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/app/profile',
			}
		});
	} catch (error) {
		console.error('Error exchanging code for token', error);

		if (error instanceof OAuth2RequestError) {
			return new Response(null, {
				status: 400,
				statusText: 'Bad Request'
			});
		}

		return new Response(null, {
			status: 500,
			statusText: 'Internal Server Error'
		});
	}
};
