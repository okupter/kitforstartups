import { getCampaigns } from '$lib/drizzle/mysql/models/campaigns.js';
import { addEmployeeNote, getEmployee, upsertEmployeeCodes } from '$lib/drizzle/mysql/models/employees';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users.js';
import { error } from '@sveltejs/kit';

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
    
    if (!session) throw error(401, { message: 'Unauthorized' });
    
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
  save: async ({ locals, request }) => {
    const session = await locals.auth.validate();
    
    if (!session) throw error(401, { message: 'Unauthorized' });
    
    const profile = await getUserProfileData(session?.user.userId);
    const clientId = profile?.clientId;
    
    const data = Object.fromEntries(await request.formData());
    const employeeId = data.employeeId as string;
    
    const emp = await getEmployee(employeeId, true, false);
    
    if (emp?.clientId !== clientId) throw error(403, { message: 'Unauthorized' });
    
    const campaigns: { employeeId: string, employeeCode: string, campaignId: string, isActive: boolean }[] = [];
    
    for (const p in data) {
      if (p.startsWith('code|')) {
        const campaignId = p.split('|')[p.split('|').length - 1];
        const code = data[p] as string;
        
        if (!code) continue;
        
        campaigns.push({
          employeeId: data.employeeId as string,
          employeeCode: code,
          campaignId,
          isActive: true, // no UI to support this currently
        });
      }
    }
    
    // sync campaigns for the employee 
    const updatedEmployeeCodes = await upsertEmployeeCodes(campaigns);
    
    // todo: make the rest of the form update
    // need to implement the rest of this stuff... but for now, it updates the sales codes.... lol 
    
    return data;
  }
};