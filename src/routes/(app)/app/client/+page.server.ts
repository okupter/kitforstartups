import { getClients, createClient } from '$lib/drizzle/mysql/models/clients';
import type { client } from '$lib/drizzle/mysql/schema';
import { json } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const load = async ({ locals }) => {
  const session = await locals.auth.validate();

  return {
    session,
    clients: getClients(),
  };
};

export const actions = {
  add: async ({ locals, request }) => {
    const session = await locals.auth.validate();
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries()) as { name: string };
    
    try {
      await createClient({
        id: nanoid(),
        name: data.name,
        contactUserId: session?.user.userId,
        created: Date.now() as any,
        updated: Date.now() as any,
      });
    } catch (err) {
      return {
        status: false,
        body: json({ error: err }),
      };
    }
    
    return { success: true, };
  }
}