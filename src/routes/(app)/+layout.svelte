<script lang="ts">
	import stacks_logo from '$lib/assets/stacks_logo.png';
	import { enhance } from '$app/forms';
	import SelectClient from '$lib/components/SelectClient.svelte';
	import SelectedClientStore from '$lib/stores/client.js';

	export let data;
	
	if (data.profile && data.profile.clientId) {
		SelectedClientStore.set(data?.profile?.clientId);
	}
</script>

<nav class="flex justify-between py-4 container-base">
	<a href="/">
		<img src={stacks_logo} class="object-contain h-24" alt="Stacks logo, looks like overlapping triangles." >
	</a>

	<div class="flex gap-4 items-center">
		{#if data.user}
			{#if data.profile?.role === 'super_admin'}
				<SelectClient clients={data.clients} selectedClientId={data.profile.clientId || ''} />
				<a href="/app/client">Manage Clients</a>
				<a href="/app/user">Users</a>
			{/if}
			<a href="/app/profile">Profile</a>

			<form method="post" action="/auth/login?/logout" use:enhance>
				<button type="submit">Log Out</button>
			</form>
		{:else}
			<a href="/auth/signup" class="action-base action-primary w-fit">Sign Up</a>
			<a href="/auth/login" class="action-base action-outline w-fit">Login</a>
		{/if}
	</div>
</nav>

<main class="py-16 container-base">
	<slot />
</main>
