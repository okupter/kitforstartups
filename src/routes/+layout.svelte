<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<nav>
	<a href="/">Home</a>
	<a href="/profile">Profile</a>
	<a href="/auth/signup">Sign Up</a>
	<a href="/auth/login">Login</a>
	<form method="post" action="/profile?/logout" use:enhance>
		<button type="submit">Log Out</button>
	</form>
</nav>

<slot />
