import { auth } from '$lib/server/lucia/mysql';

export const handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);

	return await resolve(event);
};
