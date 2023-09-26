<script lang="ts">
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { getFeedbackObjectByPath } from '$lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let form;

	let running = false;
	const submitLoginUser: SubmitFunction = () => {
		running = true;

		return async ({ update }) => {
			running = false;
			await update();
		};
	};
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="text-center">
	<h1 class="text-3xl font-bold">Welcome back</h1>
	<p class="text-gray-600">Login into your account</p>
</div>

<div class="p-8 border border-gray-300 rounded-sm shadow-sm">
	<form method="post" action="?/loginUser" use:enhance={submitLoginUser}>
		<div class="form-control">
			<label for="email">Email</label>
			<input type="email" name="email" placeholder="Your email address" required />

			{#if getFeedbackObjectByPath(form?.feedbacks, 'email') && getFeedbackObjectByPath(form?.feedbacks, 'email')?.type === 'error'}
				<p class="text-sm text-red-600">
					{getFeedbackObjectByPath(form?.feedbacks, 'email')?.message}
				</p>
			{/if}
		</div>

		<div class="form-control">
			<label for="password">Password</label>
			<input type="password" name="password" placeholder="Your password" required />

			{#if getFeedbackObjectByPath(form?.feedbacks, 'password') && getFeedbackObjectByPath(form?.feedbacks, 'password')?.type === 'error'}
				<p class="text-sm text-red-600">
					{getFeedbackObjectByPath(form?.feedbacks, 'password')?.message}
				</p>
			{/if}

			<a href="/password-reset" class="text-xs font-medium text-right text-blue-600 underline"
				>Forgot your password?</a
			>
		</div>

		<SubmitButton {running} text="Login" />
	</form>

	<div class="flex flex-col mt-12 space-y-4 social-logins">
		<a href="/oauth/github" class="action-base action-outline">Login with GitHub</a>
		<a href="/oauth/google" class="action-base action-outline">Login with Google</a>
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
