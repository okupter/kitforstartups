import { generateEmailVerificationToken, updateUserProfileData } from '$lib/drizzle/models/users';
import { sendEmail } from '$lib/emails/resend';
import { auth } from '$lib/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (session) {
		throw redirect(302, '/app/profile');
	}
};

export const actions = {
	signupUser: async ({ locals, request, url }) => {
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
					email,
					email_verified: false
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

			// Send verification email
			const verificationToken = await generateEmailVerificationToken(user.userId);

			const sender = 'KitForStartups <justin@updates.okupter.com>';
			const recipient = firstName ? `${firstName}` : email;
			const emailHtml = `Hello ${recipient},<br><br>Thank you for signing up to KitForStartups! Please click the link below to verify your email address:<br><br><a href="${url.origin}/app/email-verification/${verificationToken}">Verify Email Address</a><br><br>Thanks,<br>Justin from KitForStartups`;

			await sendEmail({
				from: sender,
				to: email,
				subject: 'Verify Your Email Address',
				html: emailHtml
			});
		} catch (e) {
			console.log(e);
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}

		throw redirect(302, '/app/email-verification');
	}
};
