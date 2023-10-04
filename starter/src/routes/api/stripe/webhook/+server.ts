import { STRIPE_WEBHOOK_SIGNING_SECRET } from '$env/static/private';
import { stripe } from '$lib/stripe';
import { error } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const signature = request.headers.get('stripe-signature');

	if (!signature) {
		throw error(400, 'No signature');
	}

	try {
		const event = stripe.webhooks.constructEvent(
			await request.text(),
			signature,
			STRIPE_WEBHOOK_SIGNING_SECRET
		);

		switch (event.type) {
			case 'checkout.session.completed': {
				console.log('checkout.session.completed', event.data.object);
				break;
			}

			case 'invoice.paid': {
				console.log('invoice.paid', event.data.object);
				break;
			}

			case 'invoice.payment_failed': {
				console.log('invoice.payment_failed', event.data.object);
				break;
			}

			default: {
				console.warn(`Unhandled event type: ${event.type}`);
			}
		}
	} catch (error) {
		console.error(error);
	}

	return new Response('ok', { status: 200 });
};
