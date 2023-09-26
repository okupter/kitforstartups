<script lang="ts">
	import { enhance } from '$app/forms';
	import InlineFormNotice from '$lib/components/InlineFormNotice.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { createToast } from '$lib/components/Toast.svelte';
	import { getFeedbackObjectByPath } from '$lib/utils';
	import type { SubmitFunction } from './$types';

	export let form;
	let running = false;

	const submitSignupUser: SubmitFunction = () => {
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
					// Feedbacks with path are related to a specific field in the form
					// they are already handled by the InlineFormNotice component
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
	<title>Sign Up</title>
</svelte:head>

<div class="text-center">
	<h1 class="text-3xl font-bold">Sign Up</h1>
	<p class="text-gray-600">Get Started with KitForStartups</p>
</div>

<div class="p-8 border border-gray-300 rounded-sm shadow-sm">
	<form method="post" action="?/signupUser" use:enhance={submitSignupUser}>
		<div class="form-control">
			<label for="firstName">First Name</label>
			<input type="text" name="firstName" placeholder="First Name" />
		</div>

		<div class="form-control">
			<label for="lastName">Last Name</label>
			<input type="text" name="lastName" placeholder="First Name" />
		</div>

		<div class="form-control">
			<label for="email">Email</label>
			<input type="email" name="email" placeholder="Your email address" required />
			<InlineFormNotice feedback={getFeedbackObjectByPath(form?.feedbacks, 'email')} />
		</div>

		<div class="form-control">
			<label for="password">Password</label>
			<input type="password" name="password" placeholder="Your password" required />
			<InlineFormNotice feedback={getFeedbackObjectByPath(form?.feedbacks, 'password')} />
		</div>

		<SubmitButton {running} text="Sign Up" />
	</form>
</div>

<div class="text-center">
	<p class="text-sm text-gray-600">
		Already have an account? <a href="/auth/login" class="font-medium text-blue-600 underline"
			>Login instead</a
		>
	</p>
</div>
