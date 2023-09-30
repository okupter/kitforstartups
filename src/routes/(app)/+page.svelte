<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>Stacks</title>
</svelte:head>

<div>
	<h1>Stacks</h1>

	{#if data.user}
		<p>Welcome, {data.user.email}</p>
	{/if}
</div>
