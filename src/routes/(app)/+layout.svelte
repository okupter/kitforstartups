<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
</script>

<nav>
	<a href="/">Home</a>

	{#if data.user}
		<a href="/profile">Profile</a>

		<form method="post" action="/profile?/logout" use:enhance>
			<button type="submit">Log Out</button>
		</form>
	{:else}
		<a href="/auth/signup">Sign Up</a>
		<a href="/auth/login">Login</a>
	{/if}
</nav>

<slot />
