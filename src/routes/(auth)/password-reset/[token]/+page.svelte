<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<svelte:head>
	<title>Reset your password</title>
</svelte:head>

<div class="text-center">
	<h1 class="text-3xl font-bold">Reset your password</h1>
</div>

<div class="p-8 border border-gray-300 rounded-sm shadow-sm">
	<form method="post" action="?/resetPassword" use:enhance>
		<div class="form-control">
			<label for="password">New Password</label>
			<input type="password" name="password" placeholder="Your new password" required />
		</div>

		<button type="submit" class="action-base action-primary">Reset your password</button>
	</form>
</div>

<div class="text-center">
	<p class="text-sm text-gray-600">
		Already have an account? <a href="/auth/login" class="font-medium text-blue-600 underline"
			>Login instead</a
		>
	</p>
</div>
