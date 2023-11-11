import { getCampaign } from '$lib/drizzle/mysql/models/campaigns';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import type { Actions } from '@sveltejs/kit';


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

export const actions: Actions = {
  update: async ({ locals, request }) => {
    const session = await locals.auth.validate();
    
    if (!session) return { status: 401 };
    
    const profile = await getUserProfileData(session?.user.userId);
    const clientId = profile.clientId;
    
    if (!clientId) return { status: 401 };
    
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries()) as { [key: string]: any };
    data.active = data.active === 'on';
    
    return data;
  },
};