import { lucia } from '$lib/server/auth/lucia/turso';
import { validateEmailVerificationToken } from '$lib/server/db/turso/models/tokens';
import { updateUserData } from '$lib/server/db/turso/models/users.js';

export const GET = async ({ cookies, params, locals }) => {
	const { token } = params;

	try {
		const userId = await validateEmailVerificationToken(token);
		const { user } = locals;

		if (!user || user.id !== userId) {
			return new Response('Invalid user', {
				status: 400
			});
		}

		await lucia.invalidateUserSessions(user.id);
		await updateUserData(user.id, { emailVerified: true });

		const session = await lucia.createSession(user.id, {
			created_at: new Date(),
			updated_at: new Date()
		});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/app/profile'
			}
		});
	} catch (error) {
		return new Response('Invalid email verification link', {
			status: 400
		});
	}
};
