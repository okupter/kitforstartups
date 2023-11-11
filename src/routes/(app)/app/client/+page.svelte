<script lang="ts">
	import { createCollapsible, melt } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';
	import { ChevronsUpDown, X } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';

	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible();
	export let data;
	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<svelte:head>
	<title>Clients</title>
</svelte:head>

<div>
	<div class="pb-4">
		<Breadcrumb aria-label="Breadcrumb">
			<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
			<BreadcrumbItem>Clients</BreadcrumbItem>
		</Breadcrumb>
	</div>	
	
	<h4>Manage Clients</h4>

	<div use:melt={$root} class="relative mt-8 mb-28 w-[18rem] max-w-full sm:w-[25rem]">
		<div class="flex items-center justify-between">
			<span class="text-sm font-semibold text-neutral-900">
				Add a new client
			</span>
			<button
				use:melt={$trigger}
				class="relative h-6 w-6 place-items-center rounded-md bg-white text-sm
        text-neutral-800 shadow hover:opacity-75 data-[disabled]:cursor-not-allowed
        data-[disabled]:opacity-75"
				aria-label="Toggle"
			>
				<div class="abs-center">
					{#if $open}
						<X class="square-4" />
					{:else}
						<ChevronsUpDown class="square-4" />
					{/if}
				</div>
			</button>
		</div>

		<div style:position="absolute" style:top="calc(100% + 10px)">
			{#if $open}
				<div use:melt={$content} transition:slide>
					<form action="?/add" method="post" class="flex flex-col justify-start gap-2" use:enhance>
						<label>
							<span>Name</span>
							<input type="text" name="name" id="name" required />
						</label>
				
						<button class="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 flex justify-around items-center gap-2" type="submit">Save</button>
					</form>
				</div>
			{/if}
		</div>
	</div>

	<h5>Clients</h5>

	<div class="flex flex-col gap-2 pt-4">
		{#each data.clients as client}
			<!-- content here -->
			<div class="border border-primary-500 rounded-md shadow-md p-4">
				<p class="font-bold">{client.name}</p>
				{#if client.contactUserId}
					<p>Contact User ID: {client.contactUserId}</p>
				{/if}
			</div>
		{/each}
	</div>
</div>
