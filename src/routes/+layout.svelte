<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<nav>
	<a href="/">Home</a>
	<a href="/auth/signup">Sign Up</a>
	<a href="/auth/login">Login</a>
	<form method="post" action="/auth/login?/logout" use:enhance>
		<button type="submit">Log Out</button>
	</form>
</nav>

<slot />
