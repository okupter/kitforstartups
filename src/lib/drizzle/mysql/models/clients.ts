import { drizzleClient as db } from '$lib/drizzle/mysql/client';
import { client } from '$lib/drizzle/mysql/schema';


const getClients = async () => {
  const data = await db.select().from(client);
  return data;
}

const createClient = async (clientData: typeof client.$inferInsert) => {
  await db
    .insert(client)
    .values(clientData)
    .onDuplicateKeyUpdate({
      set: Object.fromEntries(
        Object.entries(clientData).filter(([key]) => !['id'].includes(key))
      )
    });
}

export { getClients, createClient };