import { generateEmailVerificationToken } from '$lib/drizzle/mysql/models/tokens';
import { getUserByEmail, getUserProfileData } from '$lib/drizzle/mysql/models/users';
import { sendEmail } from '$lib/emails/resend';
import { fail } from '@sveltejs/kit';

export const actions = {
	resendEmailVerificationLink: async ({ locals, url }) => {
		const session = await locals.auth.validate();
		const user = await getUserByEmail(session?.user.email);

		if (!user) {
			return fail(400, {
				message: 'User does not exist'
			});
		}

		const profile = await getUserProfileData(session?.user.userId);

		try {
			const verificationToken = await generateEmailVerificationToken(user.id);

			const sender = 'KitForStartups <justin@updates.okupter.com>';
			const recipient = profile?.firstName ? `${profile.firstName}` : user.email;
			const emailHtml = `Hello ${recipient},<br><br>Thank you for signing up to KitForStartups! Please click the link below to verify your email address:<br><br><a href="${url.origin}/app/email-verification/${verificationToken}">Verify Email Address</a><br><br>Thanks,<br>Justin from KitForStartups`;

			await sendEmail({
				from: sender,
				to: user.email,
				subject: 'Verify Your Email Address',
				html: emailHtml
			});

			return {
				success: true
			};
		} catch {
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
	}
};
