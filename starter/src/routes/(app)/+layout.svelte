<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
</script>

<nav class="flex justify-between py-4 container-base">
	<a href="/">Home</a>

	<div class="flex gap-4">
		{#if data.user}
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
