<script lang="ts">
	import stacks_logo from '$lib/assets/stacks_logo.png';
	import { enhance } from '$app/forms';
	import SelectClient from '$lib/components/SelectClient.svelte';
	import SelectedClientStore from '$lib/stores/client';
	import { ChevronDown, Moon, Sun } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Dropdown, DropdownItem, DropdownDivider, Button } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { ChevronRightSolid } from 'flowbite-svelte-icons';
	$: activeUrl = $page.url.pathname;
	export let data;

	if (data.profile && data.profile.clientId) {
		SelectedClientStore.set(data?.profile?.clientId);
	}
	const isDarkMode = writable((browser && localStorage.getItem('theme') === 'dark') || false);

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
	};

	onMount(() => {
		const isDark = browser && localStorage.getItem('theme') === 'dark';
		if (isDark) document.documentElement.classList.add('dark');
		isDarkMode.set(isDark);
	});
</script>

<Navbar>
	<NavBrand href="/" class="gap-4">
		<img
			src={stacks_logo}
			class="object-contain h-24"
			alt="Stacks logo, looks like overlapping triangles."
		/>
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Stacks</span>
	</NavBrand>
	
	<div class="flex gap-2 md:order-2">
		{#if data.user && ['super_admin'].includes(data.profile?.role)}
			<SelectClient clients={data.clients} selectedClientId={data.profile.clientId || ''} />
		{/if}
		<button type="button" on:click={toggleTheme}>
			{#if $isDarkMode}
				<span transition:fade><Moon /></span>
			{:else}
				<span transition:fade><Sun /></span>
			{/if}
		</button>
		<NavHamburger />
	</div>
	
	<NavUl {activeUrl} class="order-1" ulClass={'flex flex-col p-4 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:text-md'}>
		<NavLi href="/">Home</NavLi>
		{#if data.user}
			{#if ['super_admin'].includes(data.profile?.role)}
				<NavLi class="cursor-pointer">
					Manage<ChevronDown class="w-3 h-3 ml-2 text-primary-800 dark:text-white inline" />
				</NavLi>
				<Dropdown class="w-44 z-20">
					<DropdownItem href="/app/client">Clients</DropdownItem>
					<DropdownItem href="/app/campaigns">Campaigns</DropdownItem>
					<DropdownDivider />
					<DropdownItem href="/app/user">Users</DropdownItem>
				</Dropdown>
			{/if}
			
			{#if ['super_admin', 'org_admin'].includes(data.profile?.role)}
				<NavLi class="cursor-pointer">
					Payroll<ChevronDown class="w-3 h-3 ml-2 text-primary-800 dark:text-white inline" />
				</NavLi>
				<Dropdown class="w-44 z-20">
					<DropdownItem href="/app/payroll-cycles/add">Start Payroll</DropdownItem>
					<DropdownItem href="/app/payroll-cycles">History</DropdownItem>
					<DropdownItem href="/app/payroll/search">Find Paystub</DropdownItem>
					<DropdownItem href="/app/payroll/add">New Paystub</DropdownItem>
				</Dropdown>
				<!-- <NavLi href="/app/employee">Employees</NavLi> -->
				<NavLi class="cursor-pointer">
					Employee<ChevronDown class="w-3 h-3 ml-2 text-primary-800 dark:text-white inline" />
				</NavLi>
				<Dropdown class="w-44 z-20">
					<DropdownItem class="flex items-center justify-between">
						Employees<ChevronRightSolid class="w-3 h-3 ml-2 text-primary-700 dark:text-white" />
					</DropdownItem>
					<Dropdown placement="right-start">
						<DropdownItem href="/app/employee">View</DropdownItem>
						<DropdownItem href="/app/employee?add">Add</DropdownItem>	
					</Dropdown>
					<DropdownItem class="flex items-center justify-between">
						Sales<ChevronRightSolid class="w-3 h-3 ml-2 text-primary-700 dark:text-white" />
					</DropdownItem>
					<Dropdown placement="right-start">
						<DropdownItem href="/app/sales">View</DropdownItem>
						<DropdownItem href="/app/sales/add">Add</DropdownItem>
					</Dropdown>
					<DropdownItem class="flex items-center justify-between">
						Expenses<ChevronRightSolid class="w-3 h-3 ml-2 text-primary-700 dark:text-white" />
					</DropdownItem>
					<Dropdown placement="right-start">
						<DropdownItem href="/app/expenses">Reports</DropdownItem>
						<DropdownItem href="/app/expenses/add">Add</DropdownItem>
					</Dropdown>
				</Dropdown>
			{/if}
			
			<NavLi href="/app/paystubs">My Pay</NavLi>
			<NavLi href="/app/profile">Profile</NavLi>

			<form method="post" action="/auth/login?/logout" use:enhance>
				<button type="submit">Log Out</button>
			</form>
		{:else}
			<NavLi href="/auth/signup">Sign Up</NavLi>
			<NavLi href="/auth/login">Login</NavLi>
		{/if}
	</NavUl>
</Navbar>
  <!--
	<a href="/">
		<img
			src={stacks_logo}
			class="object-contain h-24"
			alt="Stacks logo, looks like overlapping triangles."
		/>
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
	-->	
	
<main class="py-16 container-base">
	<slot />
</main>
