import { lucia } from '$lib/lucia/turso';
import { validatePasswordResetToken } from '$lib/server/db/turso/models/tokens';
import { updateUserData } from '$lib/server/db/turso/models/users';
import { getFeedbackObjects } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { z } from 'zod';

const newPasswordSchema = z.object({
	password: z.string().nonempty()
});

export const actions = {
	resetPassword: async ({ cookies, locals, params, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const newPassword = newPasswordSchema.safeParse(formData);

		if (!newPassword.success) {
			const feedbacks = getFeedbackObjects(
				newPassword.error.issues.map((issue) => {
					return {
						type: 'error',
						path: String(issue.path[0]),
						title: 'Invalid ' + issue.path[0],
						message: issue.message
					};
				})
			);

			return fail(500, {
				feedbacks
			});
		}

		const { password } = newPassword.data;

		try {
			const { token } = params;
			const userId = await validatePasswordResetToken(token);
			const { user } = locals;

			if (!user || user.id !== userId) {
				const feedbacks = getFeedbackObjects([
					{
						type: 'error',
						title: 'Invalid user',
						message: 'The user associated with this session is invalid.'
					}
				]);

				return fail(400, {
					feedbacks
				});
			}

			// Invalidate all sessions and update the password
			await lucia.invalidateUserSessions(user.id);
			await updateUserData(user.id, { hashedPassword: await new Argon2id().hash(password) });

			// If the user has not verified their email, verify it now
			if (!user.emailVerified) {
				await updateUserData(user.id, { emailVerified: true });
			}

			const session = await lucia.createSession(user.id, {
				created_at: new Date(),
				updated_at: new Date()
			});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (e) {
			const feedbacks = getFeedbackObjects([
				{
					type: 'error',
					title: 'Invalid reset link',
					message: 'Your password reset link is invalid or has expired. Please try again.'
				}
			]);

			return fail(400, {
				feedbacks
			});
		}

		redirect(302, '/app/profile');
	}
};
