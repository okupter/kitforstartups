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
	} catch (error) {
		console.error(error);
	}
};

export { sendTestEmail };
