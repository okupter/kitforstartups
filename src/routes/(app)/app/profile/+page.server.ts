import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import { auth } from '$lib/lucia/mysql';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session || !session.user.emailVerified) {
		throw redirect(302, '/app/email-verification');
	}

	return {
		profile: await getUserProfileData(session?.user.userId)
	};
};

export const actions = {
	logout: async ({ cookies, locals }) => {
		const session = await locals.auth.validate();

		if (!session) {
			return fail(401, {
				message: 'Unauthorized'
			});
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
