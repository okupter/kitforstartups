import { drizzleClient as db } from '$lib/drizzle/mysql/client';
import { client } from '$lib/drizzle/mysql/schema';

export const load = async ({ locals }) => {
  const session = await locals.auth.validate();
  const clients = async () => await db.select().from(client);

  return {
    session,
    clients: await clients(),
  };
};
