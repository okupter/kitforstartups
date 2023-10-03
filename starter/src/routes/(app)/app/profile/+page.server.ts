import { getUserProfileData } from '$lib/drizzle/mysql/models/users';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	const profile = await getUserProfileData(session?.user.userId);

	return {
		profile
	};
};
