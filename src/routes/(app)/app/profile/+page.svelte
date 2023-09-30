<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<div>
	<h1>Profile</h1>

	<p>Email: {data.user?.email}</p>
	<p>Email is verified: {Boolean(data.user?.emailVerified)}</p>

	<div>
		<h2>From GitHub</h2>
		<p>GitHub username: {data.user?.githubUsername}</p>
	</div>

	<div>
		<h2>Profile Data</h2>
		<p>First Name: {data.profile?.firstName}</p>
		<p>Last Name: {data.profile?.lastName}</p>
		
		<p>Client ID: {data.profile?.clientId}</p>
		<p>Role: {data.profile?.role}</p>

		{#if data.profile?.picture}
			<img
				src={data.profile.picture}
				alt={`${data.profile?.firstName} ${data.profile?.lastName}`}
			/>
		{/if}
	</div>
</div>
