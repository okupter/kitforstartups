<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div>
	<h1>Login</h1>
	<form method="post" action="?/loginUser" use:enhance>
		<input type="email" name="email" placeholder="Email" required />
		<input type="password" name="password" placeholder="Password" required />

		<button type="submit">Login</button>
	</form>

	<div>
		<a href="/oauth/github">Login with GitHub</a>
	</div>
</div>
