import { validatePasswordResetToken } from '$lib/drizzle/mysql/models/tokens';
import { auth } from '$lib/lucia/mysql';
import { getFeedbackObject, getFeedbackObjects } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

const newPasswordSchema = z.object({
	password: z.string().nonempty()
});

export const actions = {
	resetPassword: async ({ locals, params, request }) => {
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
			let user = await auth.getUser(userId);

			if (!user) {
				return fail(
					400,
					getFeedbackObject({
						type: 'error',
						title: 'Invalid or expired password reset link',
						message: 'Please try again'
					})
				);
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
			return fail(
				400,
				getFeedbackObject({
					type: 'error',
					title: 'Invalid reset link',
					message: 'Your password reset link is invalid or has expired. Please try again.'
				})
			);
		}

		throw redirect(302, '/app/profile');
	}
};
