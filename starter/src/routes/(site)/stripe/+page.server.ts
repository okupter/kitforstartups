import { stripe } from '$lib/stripe';

export const load = async () => {
	const productsIds = ['prod_OktPbYeCgVRrCK'];

	const products = await Promise.all(
		productsIds.map(async (id) => {
			const product = await stripe.products.retrieve(id);
			const price = await stripe.prices.retrieve(String(product.default_price));

			return {
				...product,
				price
			};
		})
	);

	return {
		products
	};
};
