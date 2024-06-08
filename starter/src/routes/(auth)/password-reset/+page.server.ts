import { TRANSACTIONAL_EMAILS_ADDRESS, TRANSACTIONAL_EMAILS_SENDER } from '$env/static/private';
import { sendEmail } from '$lib/emails/send';
import { generatePasswordResetToken } from '$lib/server/db/turso/models/tokens';
import { getUserByEmail, getUserProfileData } from '$lib/server/db/turso/models/users';
import { getFeedbackObjects } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

const passwordResetSchema = z.object({
	email: z.string().email()
});

export const actions = {
	sendPasswordResetLink: async ({ request, url }) => {
		const formData = Object.fromEntries(await request.formData());
		const passwordReset = passwordResetSchema.safeParse(formData);

		if (!passwordReset.success) {
			const feedbacks = getFeedbackObjects(
				passwordReset.error.issues.map((issue) => {
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

		const { email } = passwordReset.data;
		const storedUser = await getUserByEmail(email);

		if (!storedUser) {
			const feedbacks = getFeedbackObjects([
				{
					type: 'error',
					title: 'Invalid email',
					message: 'The email you entered does not match any account.'
				}
			]);

			return fail(400, {
				feedbacks
			});
		}

		const profile = await getUserProfileData(storedUser.id);

		try {
			const resetToken = await generatePasswordResetToken(storedUser.id);

			const sender = `${TRANSACTIONAL_EMAILS_SENDER} <${TRANSACTIONAL_EMAILS_ADDRESS}>`;
			const recipient = profile?.firstName ? `${profile.firstName}` : storedUser.email;
			const emailHtml = `Hello ${recipient},<br><br>Here is your password reset link:<br><br><a href="${url.origin}/password-reset/${resetToken}">Reset Password</a><br><br>Thanks,<br>${TRANSACTIONAL_EMAILS_SENDER}`;

			const passwordResetEmail = await sendEmail({
				from: sender,
				to: storedUser.email as string,
				subject: 'Password Reset',
				html: emailHtml
			});

			if (passwordResetEmail[0].type === 'error') {
				return fail(500, {
					feedbacks: passwordResetEmail
				});
			}
		} catch (error) {
			const feedbacks = getFeedbackObjects([
				{
					type: 'error',
					title: 'Error sending email',
					message: 'An unknown error occurred while sending the email. Please try again later.'
				}
			]);

			return fail(500, {
				feedbacks
			});
		}
	}
};
