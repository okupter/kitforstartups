import { getCampaign } from '$lib/drizzle/mysql/models/campaigns';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';


export const load = async ({ locals, params }) => {
  const session = await locals.auth.validate();
  
  if (!session) return { status: 401 };
  
  const campaign = async () => {
    const profile = await getUserProfileData(session?.user.userId);
    const clientId = profile.clientId;
    const data = await getCampaign(clientId as string, params.id);
    
    return data ? {
      ...data,
      created: Number(data?.created),
      updated: Number(data?.updated),
    } : null;
  }
  
  return {
    campaign: await campaign(),
  };
}