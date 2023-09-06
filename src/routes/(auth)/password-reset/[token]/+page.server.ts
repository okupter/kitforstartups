import { validatePasswordResetToken } from '$lib/drizzle/turso/models/tokens';
import { auth } from '$lib/lucia';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	resetPassword: async ({ locals, params, request }) => {
		const formData = Object.fromEntries(await request.formData());

		// TODO: validation
		const { password } = formData as {
			password: string;
		};

		try {
			const { token } = params;
			const userId = await validatePasswordResetToken(token);
			let user = await auth.getUser(userId);

			if (!user) {
				return fail(400, {
					message: 'Invalid or expired password reset link'
				});
			}

			// Invalidate all sessions and update the password
			await auth.invalidateAllUserSessions(user.userId);
			await auth.updateKeyPassword('email', user.email, password);

			// If the user has not verified their email, verify it now
			if (!user.emailVerified) {
				user = await auth.updateUserAttributes(user.userId, {
					email_verified: true
				});
			}

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			locals.auth.setSession(session);
		} catch (e) {
			return fail(400, {
				message: 'Invalid or expired password reset link'
			});
		}

		throw redirect(302, '/app/profile');
	}
};
