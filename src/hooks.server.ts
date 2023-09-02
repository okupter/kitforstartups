import { auth } from '$lib/lucia';

export const handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);

	const response = await resolve(event);
	return response;
};
