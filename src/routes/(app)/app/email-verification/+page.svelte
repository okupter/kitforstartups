<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<svelte:head>
	<title>Email Verification</title>
</svelte:head>

<div class="space-y-8">
	<h1>Email Verification</h1>
	<div class="space-y-2">
		<p>
			Your email verification link was sent to your inbox. Please check your email and click the
			link to verify your email address.
		</p>

		<p>
			If you did not receive the email, please check your spam folder or try to resend the email.
		</p>
	</div>

	<div class="space-y-4">
		<h2>Resend verification link</h2>
		<form method="post" action="?/resendEmailVerificationLink" use:enhance>
			<button type="submit" class="action-base action-primary w-fit">Resend</button>
		</form>
	</div>
</div>
