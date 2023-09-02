<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<div>
	<h1>Profile</h1>

	<p>Email: {data.user?.email}</p>
</div>
