<script lang="ts">
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { getFeedbackObjectByPath } from '$lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let form;

	let running = false;
	const submitResetPassword: SubmitFunction = () => {
		running = true;

		return async ({ update }) => {
			running = false;
			await update();
		};
	};
</script>

<svelte:head>
	<title>Reset your password</title>
</svelte:head>

<div class="text-center">
	<h1 class="text-3xl font-bold">Reset your password</h1>
</div>

<div class="p-8 border border-gray-300 rounded-sm shadow-sm">
	<form method="post" action="?/resetPassword" use:enhance={submitResetPassword}>
		<div class="form-control">
			<label for="password">New Password</label>
			<input type="password" name="password" placeholder="Your new password" required />
			{#if getFeedbackObjectByPath(form?.feedbacks, 'password') && getFeedbackObjectByPath(form?.feedbacks, 'password')?.type === 'error'}
				<p class="text-sm text-red-600">
					{getFeedbackObjectByPath(form?.feedbacks, 'password')?.message}
				</p>
			{/if}
		</div>

		<SubmitButton {running} text="Reset your password" />
	</form>
</div>

<div class="text-center">
	<p class="text-sm text-gray-600">
		Already have an account? <a href="/auth/login" class="font-medium text-blue-600 underline"
			>Login instead</a
		>
	</p>
</div>
