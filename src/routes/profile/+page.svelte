<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<div>
	<h1>Profile</h1>

	<p>Email: {data.user?.email}</p>

	<div>
		<h2>From GitHub</h2>
		<p>GitHub username: {data.user?.githubUsername}</p>
	</div>

	<div>
		<h2>From Google</h2>
		<p>First Name: {data.profile?.firstName}</p>
		<p>Last Name: {data.profile?.lastName}</p>
		<img src={data.profile?.picture} alt={`${data.profile?.firstName} ${data.profile?.lastName}`} />
	</div>
</div>
