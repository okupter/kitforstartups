<script lang="ts">
	import { enhance } from '$app/forms';
	import InlineFormNotice from '$lib/components/InlineFormNotice.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { createToast } from '$lib/components/Toast.svelte';
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

	$: {
		if (form?.feedbacks && form.feedbacks.length > 0) {
			form.feedbacks.forEach((feedback) => {
				if (!feedback.path) {
					createToast({
						type: feedback.type,
						title: feedback.title,
						description: feedback.message
					});
				}
			});
		}
	}
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
			<InlineFormNotice feedback={getFeedbackObjectByPath(form?.feedbacks, 'email')} />
		</div>

		<div class="form-control">
			<label for="password">Password</label>
			<input type="password" name="password" placeholder="Your password" />
			<InlineFormNotice feedback={getFeedbackObjectByPath(form?.feedbacks, 'password')} />

			<a href="/password-reset" class="text-xs font-medium text-right text-blue-600 underline"
				>Forgot your password?</a
			>
		</div>

		<SubmitButton {running} text="Login" />
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
