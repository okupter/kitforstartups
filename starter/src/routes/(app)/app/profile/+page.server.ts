import { getUserProfileData } from '$lib/server/db/turso/models/users';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const { user, session } = locals;

	if (!session) {
		redirect(302, '/auth/login');
	}

	if (!user?.emailVerified) {
		redirect(302, '/app/email-verification');
	}

	const profile = await getUserProfileData(user?.id);

	return {
		profile
	};
};
