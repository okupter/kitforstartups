import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		throw redirect(302, '/auth/login');
	}

	if (!session.user.emailVerified) {
		throw redirect(302, '/app/email-verification');
	}

	const profile = await getUserProfileData(session?.user.userId);

	return {
		profile
	};
};
