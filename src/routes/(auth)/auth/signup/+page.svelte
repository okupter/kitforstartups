<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from './$types';

	let running = false;

	const submitSignupUser: SubmitFunction = () => {
		running = true;

		return async ({  update }) => {
			running = false;
			await update();
		};
	};
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
		</div>

		<div class="form-control">
			<label for="password">Password</label>
			<input type="password" name="password" placeholder="Your password" required />
		</div>

		<button type="submit" disabled={running} class="action-base action-primary">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-rotate-cw {running ? 'w-4 h-4 opacity-100 transition-all mr-2 animate-spin duration-500' : 'h-0 w-0 opacity-0 mr-0'}"
				><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg
			>

			<span>Sign Up</span>
		</button>
	</form>
</div>

<div class="text-center">
	<p class="text-sm text-gray-600">
		Already have an account? <a href="/auth/login" class="font-medium text-blue-600 underline"
			>Login instead</a
		>
	</p>
</div>
