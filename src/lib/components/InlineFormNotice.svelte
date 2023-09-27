<script lang="ts">
	import type { Feedback } from '$lib/utils';

	export let feedback: Feedback | undefined;
</script>

{#if feedback && feedback.path}
	{#if feedback.type === 'error'}
		<p class="text-sm text-red-600">
			{feedback.message}
		</p>
	{/if}
{/if}
