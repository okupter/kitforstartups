import { auth } from '$lib/lucia/turso';

export const handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);

	return await resolve(event);
};
