import { drizzleClient as db, drizzleClient } from '$lib/drizzle/mysql/client';
import { client } from '$lib/drizzle/mysql/schema';
import type { SelectClient } from '$lib/types/db.model';


const getClients = async (): Promise<SelectClient[]> => {
  const data = await drizzleClient.query.client.findMany() as SelectClient[];
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