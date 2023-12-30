import { getClients } from '$lib/drizzle/mysql/models/clients';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	const profile = await getUserProfileData(session?.user.userId);

	return {
		user: session?.user,
		profile,
		clients: await getClients(),
	};
};
