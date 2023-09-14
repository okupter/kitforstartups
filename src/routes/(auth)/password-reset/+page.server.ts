import { generatePasswordResetToken } from '$lib/drizzle/mysql/models/tokens';
import { getUserByEmail, getUserProfileData } from '$lib/drizzle/mysql/models/users';
import { sendEmail } from '$lib/emails/send';
import { getFeedbackObject } from '$lib/utils';
import { fail } from '@sveltejs/kit';

export const actions = {
	sendPasswordResetLink: async ({ request, url }) => {
		const formData = Object.fromEntries(await request.formData());

		// TODO: validation
		const { email } = formData as {
			email: string;
		};

		const storedUser = await getUserByEmail(email);

		if (!storedUser) {
			return fail(
				400,
				getFeedbackObject({
					type: 'error',
					title: 'Invalid email',
					message: 'The email you entered does not match any account.'
				})
			);
		}

		const profile = await getUserProfileData(storedUser.id);

		try {
			const resetToken = await generatePasswordResetToken(storedUser.id);

			const sender = 'KitForStartups <justin@updates.okupter.com>';
			const recipient = profile?.firstName ? `${profile.firstName}` : storedUser.email;
			const emailHtml = `Hello ${recipient},<br><br>Here is your password reset link:<br><br><a href="${url.origin}/password-reset/${resetToken}">Reset Password</a><br><br>Thanks,<br>Justin from KitForStartups`;

			return await sendEmail({
				from: sender,
				to: storedUser.email as string,
				subject: 'Password Reset',
				html: emailHtml
			});
		} catch (error) {
			return fail(
				500,
				getFeedbackObject({
					type: 'error',
					title: 'Error sending email',
					message: 'An unknown error occurred while sending the email. Please try again later.'
				})
			);
		}
	}
};
