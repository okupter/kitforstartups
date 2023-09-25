import { auth } from '$lib/lucia/mysql';
import { getFeedbackObject } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia';

export const actions = {
	loginUser: async ({ locals, request }) => {
		const formData = Object.fromEntries(await request.formData());

		// TODO: validation
		const { email, password } = formData as {
			email: string;
			password: string;
		};

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
				return fail(
					400,
					getFeedbackObject({
						type: 'error',
						title: 'Login failed',
						message: 'Incorrect email or password.'
					})
				);
			}

			return fail(
				500,
				getFeedbackObject({
					type: 'error',
					title: 'Login failed',
					message: 'An unknown error occurred. Please try again later.'
				})
			);
		}

		throw redirect(302, '/app/profile');
	},

	logout: async ({ cookies, locals }) => {
		const session = await locals.auth.validate();

		if (!session) {
			return fail(
				401,
				getFeedbackObject({
					type: 'error',
					title: 'Unauthorized',
					message: 'You are not authorized to perform this action.'
				})
			);
		}

		// Invalidate session
		await auth.invalidateSession(session.sessionId);

		// Remove session cookie
		locals.auth.setSession(null);

		// Remove OAuth cookies
		cookies.delete('github_oauth_state');
		cookies.delete('google_oauth_state');

		throw redirect(302, '/auth/login');
	}
};
