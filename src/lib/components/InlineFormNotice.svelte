<script lang="ts">
	import type { Feedback } from '$lib/utils';

	export let feedback: Feedback | undefined;
</script>

{#if feedback}
	<p class="text-sm text-red-600">
		{feedback.message}
	</p>
{/if}
