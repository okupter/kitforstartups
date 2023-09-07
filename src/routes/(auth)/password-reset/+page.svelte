<script lang="ts">
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
</script>

<svelte:head>
	<title>Get a reset link</title>
</svelte:head>

<div class="text-center">
	<h1 class="text-3xl font-bold">Get a reset link</h1>
</div>

<div class="p-8 border border-gray-300 rounded-sm shadow-sm">
	<form method="post" action="?/sendPasswordResetLink" use:enhance>
		<div class="form-control">
			<label for="email">Email</label>
			<input type="email" name="email" placeholder="Your email address" required />
		</div>

		<SubmitButton text="Email password reset link" />
	</form>
</div>

<div class="text-center">
	<p class="text-sm text-gray-600">
		Already have an account? <a href="/auth/login" class="font-medium text-blue-600 underline"
			>Login instead</a
		>
	</p>
</div>
