import { getUserProfileData, updateUserProfileData } from '$lib/drizzle/mysql/models/users';
import type { userProfile } from '$lib/drizzle/mysql/schema';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	// do something
  const { id: clientId } = await request.json() as { id: string };
  
  const session = await locals.auth.validate();
	const profile = await getUserProfileData(session?.user.userId);
  
  if (!profile) return json({ error: 'No profile found' }, { status: 400 });
  
  const updatedProfile = {...profile, clientId };
  
  try {
    await updateUserProfileData(updatedProfile as typeof userProfile.$inferInsert);
  } catch (e) {
    return json({ error: e }, { status: 500 });
  }
  
  return json(updatedProfile);
}