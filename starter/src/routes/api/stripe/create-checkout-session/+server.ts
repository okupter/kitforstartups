import { stripe } from '$lib/stripe';
import { error, json } from '@sveltejs/kit';

export const POST = async ({ request, url }) => {
	const { priceId } = (await request.json()) as { priceId: string | undefined };

	if (!priceId) {
		throw error(400, 'Missing userId');
	}

	const session = await stripe.checkout.sessions.create({
		mode: 'subscription',
		line_items: [
			{
				price: priceId,
				quantity: 1
			}
		],
		success_url: `${url.origin}/stripe/?session_id={CHECKOUT_SESSION_ID}`
	});

	return json({ success: true, url: session.url });
};
