import { auth } from '$lib/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (session) {
		throw redirect(302, '/');
	}

	return {};
};

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
			console.log(e);

			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
			) {
				return fail(400, {
					message: 'Incorrect email or password'
				});
			}
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}

		throw redirect(302, '/profile');
	},

	logout: async ({ locals }) => {
		const session = await locals.auth.validate();

		if (!session) {
			return fail(401, {
				message: 'Unauthorized'
			});
		}

		// Invalidate session
		await auth.invalidateSession(session.sessionId);

		// Remove cookie
		locals.auth.setSession(null);

		throw redirect(302, '/auth/login');
	}
};
