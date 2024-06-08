import { lucia } from '$lib/lucia/turso.js';
import { getUserByEmail } from '$lib/server/db/turso/models/users.js';
import { getFeedbackObjects } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { z } from 'zod';

export const load = async ({ locals }) => {
	const { session } = locals;

	if (session) {
		redirect(302, '/app/profile');
	}

	return {};
};

const loginUserSchema = z.object({
	email: z.string().email(),
	password: z.string().nonempty()
});

export const actions = {
	loginUser: async ({ cookies, request }) => {
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
			const user = await getUserByEmail(email);

			if (!user) {
				const feedbacks = getFeedbackObjects([
					{
						type: 'error',
						title: 'Login failed',
						message: 'Incorrect email or password.'
					}
				]);

				return fail(400, { feedbacks });
			}

			if (!user.hashedPassword) {
				const feedbacks = getFeedbackObjects([
					{
						type: 'error',
						title: 'Login failed',
						message: 'Incorrect email or password.'
					}
				]);

				return fail(400, { feedbacks });
			}

			const isPasswordValid = await new Argon2id().verify(user.hashedPassword, password);

			if (!isPasswordValid) {
				const feedbacks = getFeedbackObjects([
					{
						type: 'error',
						title: 'Login failed',
						message: 'Incorrect email or password.'
					}
				]);

				return fail(400, { feedbacks });
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
		const { session } = locals;

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
		await lucia.invalidateSession(session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		// Remove OAuth cookies
		cookies.delete('github_oauth_state', { path: '/' });
		cookies.delete('google_oauth_state', { path: '/' });
		cookies.delete('google_oauth_code_verifier', { path: '/' });

		redirect(302, '/auth/login');
	}
};
