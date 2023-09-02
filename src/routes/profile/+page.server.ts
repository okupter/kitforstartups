import { auth } from '$lib/lucia';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		throw redirect(302, '/auth/login');
	}

	return {};
};

export const actions = {
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
