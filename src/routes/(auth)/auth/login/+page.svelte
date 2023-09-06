<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="text-center">
	<h1 class="text-3xl font-bold">Welcome back</h1>
	<p class="text-gray-600">Login into your account</p>
</div>

<div class="p-8 border border-gray-300 rounded-sm shadow-sm">
	<form method="post" action="?/loginUser" use:enhance>
		<div class="form-control">
			<label for="email">Email</label>
			<input type="email" name="email" placeholder="Your email address" required />
		</div>

		<div class="form-control">
			<label for="password">Password</label>
			<input type="password" name="password" placeholder="Your password" required />
		</div>

		<button type="submit" class="action-base action-primary">Login</button>
	</form>

	<div class="flex flex-col mt-12 space-y-4 social-logins">
		<a href="/api/oauth/github" class="action-base action-outline">Login with GitHub</a>
		<a href="/api/oauth/google" class="action-base action-outline">Login with Google</a>
	</div>
</div>

<div class="text-center">
	<p class="text-sm text-gray-600">
		You don't have an account yet? <a
			href="/auth/signup"
			class="font-medium text-blue-600 underline">Create one</a
		>
	</p>
</div>
