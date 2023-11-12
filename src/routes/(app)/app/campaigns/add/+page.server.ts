import { addCampaign } from '$lib/drizzle/mysql/models/campaigns';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import type { InsertCampaign } from '$lib/types/db.model';
import type { Actions } from '@sveltejs/kit';



export const actions: Actions = {
  save: async ({ locals, request }) => {
    const session = await locals.auth.validate();
    
    if (!session) return { status: 401 };
    
    const profile = await getUserProfileData(session?.user.userId);
    const clientId = profile.clientId;
    
    if (!clientId) return { status: 401 };
    
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries()) as { [key: string]: any };
    data.active = data.active === 'on';
    
    const res = await addCampaign({
      ...data,
      clientId,
    } as InsertCampaign);
    
    return res;
  },
};