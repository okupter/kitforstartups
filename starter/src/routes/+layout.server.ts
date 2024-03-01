export const load = async ({ locals }) => {
	const { user } = locals;

	return {
		user
	};
};
