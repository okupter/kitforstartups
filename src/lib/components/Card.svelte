<script lang="ts">
	export let image_src = '';
  export let image_alt = '';
	export let title: string;
	export let description =
		'A description of the card that is in the view and has an image, title, description and a button';
</script>

<div class="p-4 border rounded-md shadow-lg flex flex-col gap-2">
	<slot name="image">
		{#if image_src}
			<img src={image_src} alt={image_alt} />
		{:else}
			<div class="aspect-video bg-gray-300"></div>
		{/if}
	</slot>

	<div class="text-2xl font-bold">
		<slot name="title">
			{#if title}
				{title}
			{:else}
				Default Title
			{/if}
		</slot>
	</div>
	<div>
		<slot name="description">
			{#if description}
				{description}
			{:else}
				Default description: A description of the card that is in the view and has an image, title,
				description and a button
			{/if}
		</slot>
	</div>
	<div>
		<slot name="button"/>
	</div>
</div>
