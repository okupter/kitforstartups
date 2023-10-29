import { getCampaigns } from '$lib/drizzle/mysql/models/campaigns.js';
import { addEmployeeNote, getEmployee } from '$lib/drizzle/mysql/models/employees';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users.js';

export const load = async ({ locals, params }) => {
  const id = params.id;
  const session = await locals.auth.validate();
  
  if (!session) return { status: 401 };
  
  const campaigns = async () => {
    const profile = await getUserProfileData(session?.user.userId);
    const clientId = profile.clientId;
    return getCampaigns(clientId as string)
  };
  
  return {
    ee: await getEmployee(id),
    campaigns: await campaigns(),
  };
}

export const actions = {
  'add-note': async ({ locals, request }) => {
    const session = await locals.auth.validate();
    
    if (!session) return { status: 401 };
    
    const profile = await getUserProfileData(session?.user.userId);
    const myClientId = profile.clientId;
    
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries()) as {
      employee_id: string;
      notes: string;
    };
    
    const ee = await getEmployee(data.employee_id);
    
    if (!ee) return { status: 404 };
    if (ee.clientId !== myClientId) return { status: 403 };
    
    try {
      await addEmployeeNote(data.employee_id, data.notes);
    } catch (err) {
      console.error(err);
      return { status: 500 };
    }
    
    return data;
  },
};