<script lang="ts">
	import stacks_logo from '$lib/assets/stacks_logo.png';
	import { enhance } from '$app/forms';
	import SelectClient from '$lib/components/SelectClient.svelte';
	import SelectedClientStore from '$lib/stores/client';
	import { Moon, Sun } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	export let data;
	
	if (data.profile && data.profile.clientId) {
		SelectedClientStore.set(data?.profile?.clientId);
	}
	const isDarkMode = writable(browser && localStorage.getItem('theme') === 'dark' || false);
	
	const toggleTheme = () => {
		const isDark = document.documentElement.classList.contains('dark');
		isDarkMode.set(!isDark);
		
		if (isDark) {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		} else {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		}
	}
	
	onMount(() => {
		const isDark = browser && localStorage.getItem('theme') === 'dark';
		document.documentElement.classList.add('dark');
		isDarkMode.set(isDark);
	});
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
				<a href="/app/campaigns">Campaigns</a>
				<a href="/app/user">Users</a>
			{/if}
			{#if ['super_admin', 'org_admin'].includes(data.profile?.role)}
				 <!-- content here -->
				<a href="/app/employee">Employees</a>
				<a href="/app/profile">Profile</a>
			{/if}

			<form method="post" action="/auth/login?/logout" use:enhance>
				<button type="submit">Log Out</button>
			</form>
		{:else}
			<a href="/auth/signup" class="action-base action-primary w-fit">Sign Up</a>
			<a href="/auth/login" class="action-base action-outline w-fit">Login</a>
		{/if}
		
		<button type="button" on:click={toggleTheme}>
			{#if $isDarkMode}
				<span transition:fade><Moon /></span>
			{:else}
				<span transition:fade><Sun /></span>
			{/if}
		</button>
	</div>
</nav>

<main class="py-16 container-base">
	<slot />
</main>
