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
	<p class="text-gray-600 dark:text-gray-100">Login into your account</p>
</div>

<div class="p-8 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm">
	<form method="post" action="?/loginUser" use:enhance={submitLoginUser}>
		<div>
			<label for="email" class="mb-0.5 text-text-900">Email</label>
			<input type="email" name="email" placeholder="Your email address" required class="h-10 w-[100%] rounded-md px-3 py-2 text-neutral-700 dark:bg-gray-400 dark:text-neutral-50" />
			<InlineFormNotice feedback={getFeedbackObjectByPath(form?.feedbacks, 'email')} />
		</div>

		<div>
			<label for="password" class="mb-0.5 text-text-900">Password</label>
			<input type="password" name="password" placeholder="Your password" class="h-10 w-[100%] rounded-md px-3 py-2 text-neutral-700 dark:bg-gray-400 dark:text-neutral-50" />
			<InlineFormNotice feedback={getFeedbackObjectByPath(form?.feedbacks, 'password')} />

			<a href="/password-reset" class="text-sm text-right text-blue-600 underline">Forgot your password?</a>
		</div>

		<SubmitButton {running} text="Login" />
	</form>

	<div class="flex flex-col mt-12 space-y-4 social-logins">
		<!-- <a href="/oauth/github" class="rounded-md bg-gray-900 p-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 flex justify-around items-center">Login with GitHub</a> -->
		<a href="/oauth/google" class="rounded-md bg-primary-600 dark:bg-primary-300 p-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 dark:hover:bg-primary-300 
			focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 flex justify-around items-center"
		>
			Login with Google
		</a>
	</div>
</div>

<!-- <div class="text-center">
	<p class="text-sm text-gray-600">
		You don't have an account yet? <a
			href="/auth/signup"
			class="font-medium text-blue-600 underline">Create one</a
		>
	</p>
</div> -->
