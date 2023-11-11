<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';

	export let data;
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<div>
	<div class="pb-4">
		<Breadcrumb aria-label="Breadcrumb">
			<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
			<BreadcrumbItem>Profile</BreadcrumbItem>
		</Breadcrumb>
	</div>
	
	<h4>Profile</h4>

	<p>Email: {data.user?.email}</p>
	<p>Email is verified: {Boolean(data.user?.emailVerified)}</p>

	<div>
		<h4>From GitHub</h4>
		<p>GitHub username: {data.user?.githubUsername}</p>
	</div>

	<div>
		<h4>Profile Data</h4>
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
