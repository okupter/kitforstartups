import { auth } from '$lib/lucia';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const protectedPaths = ['/profile'];
const authRoutes = ['/auth/login', '/auth/signup'];

const authHandler: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	const session = await event.locals.auth.validate();

	if (session) {
		// If user is on the sign up page and their email is not verified
		// redirect them to the email verification page
		if (event.url.pathname === '/auth/signup' && !session.user.emailVerified) {
			throw redirect(302, '/email-verification');
		}

		// If user is on the login or sign up page and they are logged in
		// redirect them to the home page
		if (authRoutes.includes(event.url.pathname)) {
			throw redirect(302, '/');
		}
	}

	// Prevent access to protected routes if not logged in
	if (!session && protectedPaths.includes(event.url.pathname)) {
		throw redirect(302, '/auth/login');
	}

	return await resolve(event);
};

export const handle = sequence(authHandler);
