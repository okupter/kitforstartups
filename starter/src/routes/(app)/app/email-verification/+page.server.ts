import { generateEmailVerificationToken } from '$lib/drizzle/mysql/models/tokens';
import { getUserByEmail, getUserProfileData } from '$lib/drizzle/mysql/models/users';
import { sendEmail } from '$lib/emails/send';
import { getFeedbackObjects } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		throw redirect(302, '/auth/login');
	}

	if (session.user.emailVerified) {
		throw redirect(302, '/app/profile');
	}

	return {};
};

export const actions = {
	resendEmailVerificationLink: async ({ locals, url }) => {
		const session = await locals.auth.validate();
		const user = await getUserByEmail(session?.user.email);

		if (!user) {
			const feedbacks = getFeedbackObjects([
				{
					type: 'error',
					title: 'Invalid user',
					message: 'The user associated with this session is invalid.'
				}
			]);

			return fail(400, {
				feedbacks
			});
		}

		const profile = await getUserProfileData(session?.user.userId);

		try {
			const verificationToken = await generateEmailVerificationToken(user.id);

			const sender = 'KitForStartups <justin@updates.okupter.com>';
			const recipient = profile?.firstName ? `${profile.firstName}` : user.email;
			const emailHtml = `Hello ${recipient},<br><br>Thank you for signing up to KitForStartups! Please click the link below to verify your email address:<br><br><a href="${url.origin}/app/email-verification/${verificationToken}">Verify Email Address</a><br><br>Thanks,<br>Justin from KitForStartups`;

			const verificationEmail = await sendEmail({
				from: sender,
				to: user.email,
				subject: 'Verify Your Email Address',
				html: emailHtml
			});

			if (verificationEmail[0].type === 'error') {
				return fail(500, {
					feedbacks: verificationEmail
				});
			}
		} catch(e) {
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
	}
};
