import { RESEND_API_KEY } from '$env/static/private';
import { Resend } from 'resend';

const sendResendEmail = async (options: { from: string; to: string; subject: string; html: string }) => {
	const resend = new Resend(RESEND_API_KEY);

	try {
		await resend.emails.send(options);

		console.log('Email sent successfully');
	} catch (err) {
		console.error(err);
	}
};

export { sendResendEmail };
