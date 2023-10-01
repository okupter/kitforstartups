import { getClients } from '$lib/drizzle/mysql/models/clients';

export const load = async ({ locals }) => {
  const session = await locals.auth.validate();

  return {
    session,
    clients: getClients(),
  };
};
