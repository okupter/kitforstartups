import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import { auth } from '$lib/lucia/mysql';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const protectedRoutesBase = '/app';
const emailVerificationPath = '/app/email-verification';
const superAdminRoutesBase = '/app/client';

const authRoutesBase = ['/auth', '/oauth'];

const authHandler: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	const session = await event.locals.auth.validate();

	if (!session) {
		// If the user is not logged in and is trying to access a protected route,
		// redirect them to the login page
		if (event.url.pathname.startsWith(protectedRoutesBase) ||
			event.url.pathname.startsWith(superAdminRoutesBase)) {
			throw redirect(302, '/auth/login');
		}
	}

	if (session) {
		console.log(session);
		// If the user is logged in and is trying to access an auth route,
		// redirect them to the profile page
		// except if they are trying to logout
		if (
			authRoutesBase.some((route) => event.url.pathname.startsWith(route)) &&
			event.url.search !== '?/logout'
		) {
			throw redirect(302, '/app/profile');
		}

		// If the user is logged in, but their email is not verified
		// and they are trying to access a protected route,
		// redirect them to the email verification page
		if (
			!session.user.emailVerified &&
			(event.url.pathname.startsWith(superAdminRoutesBase) ||
			event.url.pathname.startsWith(protectedRoutesBase)) &&
			!event.url.pathname.startsWith(emailVerificationPath)
		) {
			throw redirect(302, '/app/email-verification');
		}
		
		if (event.url.pathname.startsWith(superAdminRoutesBase)) {
			const referer = event.request.headers.get('referer') || '/';
			const profile = await getUserProfileData(session?.user?.userId);
			
			if (profile?.role !== 'super_admin') {
				throw redirect(302, referer);
			}
		}
	}

	return await resolve(event);
};

export const handle = sequence(authHandler);
