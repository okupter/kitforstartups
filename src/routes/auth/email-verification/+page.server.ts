import { redirect } from '@sveltejs/kit';

export const actions = {
	resendEmailVerificationLink: async ({ locals, request }) => {
		const session = await locals.auth.validate();

		if (!session) {
			throw redirect(302, '/auth/login');
		}
	}
};
