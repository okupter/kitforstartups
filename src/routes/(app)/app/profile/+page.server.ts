import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import { auth } from '$lib/lucia/mysql';
import { getFeedbackObject } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	const profile = await getUserProfileData(session?.user.userId);

	return {
		profile
	};
};

export const actions = {
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
