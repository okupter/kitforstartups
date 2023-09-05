<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<div>
	<h1>Sign Up</h1>

	<form method="post" action="?/signupUser" use:enhance>
		<input type="text" name="firstName" placeholder="First Name" />
		<input type="text" name="lastName" placeholder="First Name" />
		<input type="email" name="email" placeholder="Email" required />
		<input type="password" name="password" placeholder="Password" required />

		<button type="submit">Sign Up</button>
	</form>
</div>
