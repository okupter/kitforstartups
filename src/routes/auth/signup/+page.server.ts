import { updateUserProfileData } from '$lib/drizzle/models/users';
import { auth } from '$lib/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (session) {
		throw redirect(302, '/');
	}

	return {};
};

export const actions = {
	signupUser: async ({ locals, request }) => {
		const formData = Object.fromEntries(await request.formData());

		// TODO: validation
		const { firstName, lastName, email, password } = formData as {
			firstName: string;
			lastName: string;
			email: string;
			password: string;
		};

		try {
			const user = await auth.createUser({
				key: {
					providerId: 'email',
					providerUserId: email,
					password // this is hashed by Lucia
				},
				attributes: {
					email
				}
			});

			// Update user profile data
			await updateUserProfileData({
				id: nanoid(),
				userId: user.userId,
				firstName,
				lastName
			});

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			// Set session cookie
			locals.auth.setSession(session);
		} catch (e) {
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}

		throw redirect(302, '/profile');
	}
};
