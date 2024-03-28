import { dev } from '$app/environment';
import { sendTestEmail } from '$lib/emails/mailhog';
import { sendResendEmail } from '$lib/emails/resend';

const sendEmail = async (options: { from: string; to: string; subject: string; html: string }) => {
	if (dev) {
		return await sendTestEmail(options);
	} else {
		return await sendResendEmail(options);
	}
};

export { sendEmail };
