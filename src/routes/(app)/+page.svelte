<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>KitForStartups</title>
</svelte:head>

<div>
	<h1>KitForStartups</h1>

	{#if data.user}
		<p>Welcome, {data.user.email}</p>
	{/if}
</div>
