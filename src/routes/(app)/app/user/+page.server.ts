import { getUserProfileData, getUsers } from '$lib/drizzle/mysql/models/users';


export const load = async ({locals}) => {
  const session = await locals.auth.validate();
  
  if (!session) {
    return {
      status: 401,
    };
  }
  
  const users = async () => {
    const profile = await getUserProfileData(session?.user.userId);
    
    if (!profile) {
      return [];
    }
    
    const users = await getUsers(profile?.clientId as string);
    
    return users;
  }
  
  return {
    session,
    users: await users(),
  };
}