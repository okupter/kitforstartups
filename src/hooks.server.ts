import { auth } from '$lib/lucia';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const protectedPaths = ['/auth/email-verification', '/profile'];
const authRoutes = ['/auth/login', '/auth/signup'];

const authHandler: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	const session = await event.locals.auth.validate();

	if (session) {
		if (authRoutes.includes(event.url.pathname)) {
			// If user is on an auth page and their email is not verified
			// redirect them to the email verification page
			if (!session.user.emailVerified) {
				throw redirect(302, '/auth/email-verification');
			}

			// If user is on an auth page and they are logged in
			// redirect them to the profile page
			throw redirect(302, '/profile');
		}

		// If user is on the email verification page and their email is verified
		// redirect them to the profile page
		if (event.url.pathname === '/auth/email-verification' && session.user.emailVerified) {
			throw redirect(302, '/profile');
		}
	} else {
		// Prevent non-authenticated users from accessing protected pages
		if (protectedPaths.includes(event.url.pathname)) {
			throw redirect(302, '/auth/login');
		}
	}

	return await resolve(event);
};

export const handle = sequence(authHandler);
