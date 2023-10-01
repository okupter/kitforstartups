import { drizzleClient as db } from '$lib/drizzle/mysql/client';
import { client } from '$lib/drizzle/mysql/schema';


const getClients = async () => {
  const data = await db.select().from(client);
  return data;
}

export { getClients };