import { getFeedbackObject } from '$lib/utils';
import { SMTPClient } from 'emailjs';

const client = new SMTPClient({
	host: 'localhost',
	port: 1025,
	ssl: false
});

const sendTestEmail = async (options: {
	from: string;
	to: string;
	subject: string;
	html: string;
}) => {
	try {
		await client.sendAsync({
			text: options.subject,
			from: options.from,
			to: options.to,
			subject: options.subject,
			attachment: [{ data: options.html, alternative: true }]
		});

		console.log('Test email sent successfully');

		return getFeedbackObject({
			type: 'success',
			title: 'Test email sent successfully',
			message: 'Check your inbox for the test email.'
		});
	} catch (e) {
		console.error(e);

		return getFeedbackObject({
			type: 'error',
			title: 'Error sending test email',
			message: 'An unknown error occurred while sending the test email. Please try again later.'
		});
	}
};

export { sendTestEmail };
