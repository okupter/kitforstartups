import { RESEND_API_KEY } from '$env/static/private';
import { getFeedbackObjects } from '$lib/utils';
import { Resend } from 'resend';

const sendResendEmail = async (options: {
	from: string;
	to: string;
	subject: string;
	html: string;
}) => {
	const resend = new Resend(RESEND_API_KEY);

	try {
		await resend.emails.send(options);

		console.log('Email sent successfully');

		return getFeedbackObjects([
			{
				type: 'success',
				title: 'Email sent successfully',
				message: 'Check your inbox for the email.'
			}
		]);
	} catch (err) {
		console.error(err);

		return getFeedbackObjects([
			{
				type: 'error',
				title: 'Error sending email',
				message: 'An unknown error occurred while sending the email. Please try again later.'
			}
		]);
	}
};

export { sendResendEmail };
