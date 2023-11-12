<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>Stacks</title>
</svelte:head>

<div class="flex flex-col gap-2">
	{#if data.user}
		<h4>Welcome, {data.profile.firstName} {data.profile.lastName}.</h4>
	{/if}
	
	<div class="flex flex-col gap-2 mt-4 px-4 py-6 bg-secondary-100 border-secondary-100
		dark:bg-background-300 border dark:border-background-300 rounded-md shadow-md">
		<h5 class="dark:text-text-600">What is Stacks?</h5>
		<p class="leading-9">
			Stacks is here is to help make team organization and payment coordination easier for on-the-go teams.
			<br />
			Whether you're a start up, established small business, or growing enterprise, Stacks is here to help your 
			team worry less about the little things and focus more on the big picture.
		</p>
	</div> 
</div>
