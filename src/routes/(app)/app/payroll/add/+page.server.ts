import { getUserProfileData } from '$lib/drizzle/mysql/models/users';


export const load = async ({ locals }) => {
  const session = await locals.auth.validate();
  
  if (!session) return { status: 401 };
  
  const profile = await getUserProfileData(session?.user.userId);
  
  if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) return { status: 403 };
  
  
};