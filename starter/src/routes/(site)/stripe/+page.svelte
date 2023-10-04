<script lang="ts">
	import { goto } from '$app/navigation';

	export let data;

	// 	{
	//     "id": "prod_OjsJMbvj0bqPID",
	//     "object": "product",
	//     "active": true,
	//     "attributes": [],
	//     "created": 1696162577,
	//     "default_price": "price_1NwOZKKIZAcVqrw8eiXuOWQI",
	//     "description": "KitForStartups Enterprise Plan",
	//     "features": [],
	//     "images": [],
	//     "livemode": false,
	//     "metadata": {},
	//     "name": "KitForStartups Enterprise",
	//     "package_dimensions": null,
	//     "shippable": null,
	//     "statement_descriptor": null,
	//     "tax_code": null,
	//     "type": "service",
	//     "unit_label": null,
	//     "updated": 1696162578,
	//     "url": null,
	//     "price": {
	//         "id": "price_1NwOZKKIZAcVqrw8eiXuOWQI",
	//         "object": "price",
	//         "active": true,
	//         "billing_scheme": "per_unit",
	//         "created": 1696162578,
	//         "currency": "usd",
	//         "custom_unit_amount": null,
	//         "livemode": false,
	//         "lookup_key": null,
	//         "metadata": {},
	//         "nickname": null,
	//         "product": "prod_OjsJMbvj0bqPID",
	//         "recurring": null,
	//         "tax_behavior": "unspecified",
	//         "tiers_mode": null,
	//         "transform_quantity": null,
	//         "type": "one_time",
	//         "unit_amount": 11900,
	//         "unit_amount_decimal": "11900"
	//     }
	// }

	const handlePriceIdSubmit = async (e: SubmitEvent) => {
		const target = e.target as HTMLFormElement;
		const priceId = target.priceId.value;

		const response = await fetch(`/api/stripe/create-checkout-session`, {
			method: 'POST',
			body: JSON.stringify({ priceId })
		});

		if (!response.ok) {
			alert('Something went wrong, please try again later.');
		}

		const { url } = await response.json();

		await goto(url);
	};
</script>

<svelte:head>
	<title>Stripe - KitForStartups</title>
</svelte:head>

<div class="space-y-8">
	<h1>Stripe</h1>

	{#if data.products && data.products.length > 0}
		<div class="grid sm:grid-cols-3 gap-8">
			{#each data.products as product (product.id)}
				<div class="shadow-md bg-gray-50 p-8 space-y-4">
					<div>
						<p class="text-xl font-medium text-gray-900">{product.name}</p>
						<p class="text-sm text-gray-500">{product.description}</p>
					</div>

					<div>
						{#if product.price.unit_amount}
							<p class="text-2xl font-semibold text-gray-900">
								${product.price.unit_amount / 100}
								{#if product.price.type === 'recurring'}
									<span class="text-sm text-gray-500">
										/{product.price.recurring?.interval}
									</span>
								{/if}
							</p>
						{/if}
					</div>

					<form on:submit|preventDefault={handlePriceIdSubmit} method="post">
						<input type="hidden" name="priceId" value={product.price.id} />
						<button type="submit" class="action-base action-primary">Buy</button>
					</form>
				</div>
			{/each}
		</div>
	{/if}
</div>
