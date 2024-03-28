import { TRANSACTIONAL_EMAILS_ADDRESS, TRANSACTIONAL_EMAILS_SENDER } from '$env/static/private';
import { generateEmailVerificationToken } from '$lib/drizzle/turso/models/tokens';
import { createUser, getUserByEmail, updateUserProfileData } from '$lib/drizzle/turso/models/users';
import { sendEmail } from '$lib/emails/send';
import { lucia } from '$lib/lucia/turso.js';
import { getFeedbackObjects } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { z } from 'zod';

export const load = async ({ locals }) => {
	const { session } = locals;

	if (session) {
		redirect(302, '/app/profile');
	}

	return {};
};

const signupUserSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().email(),
	password: z.string().nonempty()
});

export const actions = {
	signupUser: async ({ cookies, request, url }) => {
		const formData = Object.fromEntries(await request.formData());
		const signupUser = signupUserSchema.safeParse(formData);

		if (!signupUser.success) {
			const feedbacks = getFeedbackObjects(
				signupUser.error.issues.map((issue) => {
					return {
						type: 'error',
						path: String(issue.path[0]),
						title: 'Invalid ' + issue.path[0],
						message: issue.message
					};
				})
			);

			return fail(500, {
				feedbacks
			});
		}

		const { firstName, lastName, email, password } = signupUser.data;

		try {
			const existingUser = await getUserByEmail(email);

			if (existingUser) {
				const feedbacks = getFeedbackObjects([
					{
						type: 'error',
						title: 'User already exists',
						message: 'The user already exists. Please login instead.'
					}
				]);

				return fail(400, {
					feedbacks
				});
			} else {
				const userId = generateId(15);

				const user = await createUser({
					id: userId,
					email,
					emailVerified: false,
					hashedPassword: await new Argon2id().hash(password)
				});

				// Update user profile data
				await updateUserProfileData({
					id: generateId(15),
					userId: user.id,
					firstName,
					lastName
				});

				const session = await lucia.createSession(user.id, {
					created_at: new Date(),
					updated_at: new Date()
				});
				const sessionCookie = lucia.createSessionCookie(session.id);
				cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});

				// Send verification email
				const verificationToken = await generateEmailVerificationToken(user.id);

				const sender = `${TRANSACTIONAL_EMAILS_SENDER} <${TRANSACTIONAL_EMAILS_ADDRESS}>`;
				const recipient = firstName ? `${firstName}` : email;
				const emailHtml = `Hello ${recipient},
				<br><br>
				Thank you for signing up to KitForStartups! Please click the link below to verify your email address:
				<br><br>
				<a href="${url.origin}/app/email-verification/${verificationToken}">Verify Email Address</a>
				<br>
				You can also copy directly into your browser:
				<br><br>
				<code>${url.origin}/app/email-verification/${verificationToken}</code>
				<br><br>
				Thanks,
				<br>
				${TRANSACTIONAL_EMAILS_SENDER}`;

				const signupEmail = await sendEmail({
					from: sender,
					to: email,
					subject: 'Verify Your Email Address',
					html: emailHtml
				});

				if (signupEmail[0].type === 'error') {
					return fail(500, {
						feedbacks: signupEmail
					});
				}
			}
		} catch (e) {
			console.error('Something went wrong during the signup process', e);

			const feedbacks = getFeedbackObjects([
				{
					type: 'error',
					title: 'Unknown error',
					message: 'An unknown error occurred. Please try again.'
				}
			]);

			return fail(500, {
				feedbacks
			});
		}

		redirect(302, '/app/email-verification');
	}
};
