<script lang="ts">
	import { enhance } from '$app/forms';
	import InlineFormNotice from '$lib/components/InlineFormNotice.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { createToast } from '$lib/components/Toast.svelte';
	import { getFeedbackObjectByPath } from '$lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { ActionData } from './$types.js';

	export let data;
	export let form: ActionData;

	let running = false;
	const submitSendResetPasswordLink: SubmitFunction = () => {
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
	<title>Get a reset link</title>
</svelte:head>

<div class="text-center">
	<h1 class="text-3xl font-bold">Get a reset link</h1>
</div>

<div class="p-8 border border-gray-300 rounded-sm shadow-sm">
	<form method="post" action="?/sendPasswordResetLink" use:enhance={submitSendResetPasswordLink}>
		<div class="form-control">
			<label for="email">Email</label>
			<input type="email" name="email" placeholder="Your email address" required />
			<InlineFormNotice feedback={getFeedbackObjectByPath(form?.feedbacks, 'email')} />
		</div>

		<SubmitButton {running} text="Email password reset link" />
	</form>
</div>

{#if !data.user}
	<div class="text-center">
		<p class="text-sm text-gray-600">
			Already have an account? <a href="/auth/login" class="font-medium text-blue-600 underline"
				>Login instead</a
			>
		</p>
	</div>
{/if}
