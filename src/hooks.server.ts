import { auth } from '$lib/lucia';

export const handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);

	return await resolve(event);
};
