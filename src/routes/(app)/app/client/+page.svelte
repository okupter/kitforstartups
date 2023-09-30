<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>Clients</title>
</svelte:head>

<div>
	<h1>Clients</h1>

	<div class="pt-4">
		{#each data.clients as client}
			<!-- content here -->
			<h3>{client.name}</h3>
			{#if client.contactUserId}
				<p>Contact User ID: {client.contactUserId}</p>
			{/if}
		{/each}
	</div>
</div>
