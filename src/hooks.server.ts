import { auth } from '$lib/lucia';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const protectedPaths = ['/profile'];
const authRoutes = ['/auth/login', '/auth/signup'];

const authHandler: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	const session = await event.locals.auth.validate();

	if (session) {
		if (authRoutes.includes(event.url.pathname)) {
			if (!session.user.emailVerified) {
				throw redirect(302, '/auth/email-verification');
			}

			throw redirect(302, '/profile');
		}

		if (event.url.pathname.startsWith('/auth/email-verification') && session.user.emailVerified) {
			throw redirect(302, '/profile');
		}
	} else {
		if (protectedPaths.includes(event.url.pathname)) {
			throw redirect(302, '/auth/login');
		}

		if (event.url.pathname.startsWith('/auth/email-verification')) {
			throw redirect(302, '/auth/login');
		}
	}

	return await resolve(event);
};

export const handle = sequence(authHandler);
