import { TRANSACTIONAL_EMAILS_ADDRESS, TRANSACTIONAL_EMAILS_SENDER } from '$env/static/private';
import { generateEmailVerificationToken } from '$lib/drizzle/turso/models/tokens';
import { getUserProfileData } from '$lib/drizzle/turso/models/users';
import { sendEmail } from '$lib/emails/send';
import { getFeedbackObjects } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const { session, user } = locals;

	if (!session) {
		redirect(302, '/auth/login');
	}

	if (!user?.emailVerified) {
		redirect(302, '/app/profile');
	}

	return {};
};

export const actions = {
	resendEmailVerificationLink: async ({ locals, url }) => {
		const { user } = locals;

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

		const profile = await getUserProfileData(user.id);

		try {
			const verificationToken = await generateEmailVerificationToken(user.id);

			const sender = `${TRANSACTIONAL_EMAILS_SENDER} <${TRANSACTIONAL_EMAILS_ADDRESS}>`;
			const recipient = profile?.firstName ? `${profile.firstName}` : user.email;
			const emailHtml = `Hello ${recipient},<br><br>Thank you for signing up to KitForStartups! Please click the link below to verify your email address:<br><br><a href="${url.origin}/app/email-verification/${verificationToken}">Verify Email Address</a><br><br>Thanks,<br>${TRANSACTIONAL_EMAILS_SENDER}`;

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
		} catch (e) {
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
