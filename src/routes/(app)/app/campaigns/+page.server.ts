import { getCampaigns } from '$lib/drizzle/mysql/models/campaigns';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';


export const load = async ({ locals, params }) => {
  const session = await locals.auth.validate();
  
  if (!session) return { status: 401 };
  
  const campaigns = async () => {
    const profile = await getUserProfileData(session?.user.userId);
    const clientId = profile.clientId;
    return getCampaigns(clientId as string)
  };
  
  return {
    campaigns: await campaigns(),
  };
}