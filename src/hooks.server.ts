import { auth } from '$lib/lucia';
import { redirect } from '@sveltejs/kit';

const protectedPaths = ['/profile'];

export const handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);

	if (protectedPaths.includes(event.url.pathname)) {
		const session = await event.locals.auth.validate();
		if (!session) {
			throw redirect(302, '/auth/login');
		}
	}

	const response = await resolve(event);
	return response;
};
