import { auth } from '$lib/lucia/mysql';
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
				return fail(400, {
					error: {
						title: 'Login failed',
						message: 'Incorrect email or password'
					}
				});
			}
			return fail(500, {
				error: {
					title: 'Login failed',
					message: 'An unknown error occurred'
				}
			});
		}

		throw redirect(302, '/app/profile');
	},

	logout: async ({ locals }) => {
		const session = await locals.auth.validate();

		if (!session) {
			return fail(401, {
				error: {
					title: 'Unauthorized',
					message: 'Unauthorized'
				}
			});
		}

		// Invalidate session
		await auth.invalidateSession(session.sessionId);

		// Remove cookie
		locals.auth.setSession(null);

		throw redirect(302, '/auth/login');
	}
};
