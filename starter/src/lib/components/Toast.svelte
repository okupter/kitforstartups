<script lang="ts" context="module">
	export type ToastData = {
		type: 'success' | 'error' | 'warning' | 'info';
		title: string;
		description: string;
	};

	const {
		elements: { content, title, description, close },
		helpers,
		states: { toasts },
		actions: { portal }
	} = createToaster<ToastData>();

	export const createToast = (data: ToastData) => {
		helpers.addToast({
			data
		});
	};
</script>

<script lang="ts">
	import { createToaster, melt } from '@melt-ui/svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
</script>

<div use:portal class="fixed bottom-0 right-0 z-10 flex m-4 max-w-[300px] flex-col gap-2">
	{#each $toasts as { id, data } (id)}
		<div
			use:melt={$content(id)}
			animate:flip={{ duration: 500 }}
			in:fly={{ duration: 150, x: '100%' }}
			out:fly={{ duration: 150, x: '100%' }}
			class="px-6 py-4 rounded-md flex items-start gap-4 {data.type === 'success'
				? 'bg-green-900 text-white'
				: ''}
			{data.type === 'error' ? 'bg-red-900 text-white' : ''}
			{data.type === 'warning' ? 'bg-yellow-900 text-white' : ''}
			{data.type === 'info' ? 'bg-blue-900 text-white' : ''}"
		>
			<div>
				<h3 use:melt={$title(id)} class="font-medium">
					{data.title}
				</h3>
				<div use:melt={$description(id)} class="text-sm">
					{data.description}
				</div>
			</div>

			<button use:melt={$close(id)} class="p-1 rounded-full bg-white/10">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="w-4 h-4"
				>
					<path d="M18 6 6 18" /><path d="m6 6 12 12" />
				</svg>
			</button>
		</div>
	{/each}
</div>
