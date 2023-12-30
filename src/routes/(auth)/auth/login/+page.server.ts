import { auth } from '$lib/lucia/mysql';
import { getFeedbackObjects } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia';
import { z } from 'zod';

const loginUserSchema = z.object({
	email: z.string().email(),
	password: z.string().nonempty()
});

export const actions = {
	loginUser: async ({ locals, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const loginUser = loginUserSchema.safeParse(formData);

		if (!loginUser.success) {
			const feedbacks = getFeedbackObjects(
				loginUser.error.issues.map((issue) => {
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

		const { email, password } = loginUser.data;

		try {
			const user = await auth.useKey('email', email, password);
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			// Set session cookie
			locals.auth.setSession(session);
		} catch (e) {
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
			) {
				const feedbacks = getFeedbackObjects([
					{
						type: 'error',
						title: 'Login failed',
						message: 'Incorrect email or password.'
					}
				]);

				return fail(400, { feedbacks });
			}

			const feedbacks = getFeedbackObjects([
				{
					type: 'error',
					title: 'Login failed',
					message: 'An unknown error occurred. Please try again later.'
				}
			]);

			return fail(500, {
				feedbacks
			});
		}

		redirect(302, '/app/profile');
	},

	logout: async ({ cookies, locals }) => {
		const session = await locals.auth.validate();

		if (!session) {
			const feedbacks = getFeedbackObjects([
				{
					type: 'error',
					title: 'Unauthorized',
					message: 'You are not authorized to perform this action.'
				}
			]);

			return fail(401, {
				feedbacks
			});
		}

		// Invalidate session
		await auth.invalidateSession(session.sessionId);

		// Remove session cookie
		locals.auth.setSession(null);

		// Remove OAuth cookies
		/* @migration task: add path argument */ cookies.delete('github_oauth_state');
		/* @migration task: add path argument */ cookies.delete('google_oauth_state');

		redirect(302, '/auth/login');
	}
};
