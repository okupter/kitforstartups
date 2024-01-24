import { getCampaigns } from '$lib/drizzle/mysql/models/campaigns.js';
import { addEmployeeNote, getEmployee, getEmployees, upsertEmployeeCodes } from '$lib/drizzle/mysql/models/employees';
import { saveOverridingEmployee } from '$lib/drizzle/mysql/models/overrides.js';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users.js';
import type { EmployeeWithNotes, SelectOverridingEmployee } from '$lib/types/db.model';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
  const id = params.id;
  const session = await locals.auth.validate();
  
  if (!session) error(401, 'Unauthorized');
  
  const profile = await getUserProfileData(session?.user.userId);
  const clientId = profile?.clientId || '';
  
  if (!clientId) error(403, 'Forbidden');
  
  const campaigns = async () => {
    return getCampaigns(clientId as string)
  };
  
  const allEmployees = async () => (await getEmployees(clientId)).map(ee => ({
    name: `${ee.firstName} ${ee.lastName}`,
    value: ee.id,
  }));
  
  const employee = async () => (await getEmployee(id)) as unknown as (EmployeeWithNotes & { overrideTo: SelectOverridingEmployee });
  
  return {
    ee: await employee(),
    campaigns: await campaigns(),
    employees: await allEmployees(),
  };
}

export const actions = {
  'add-note': async ({ locals, request }) => {
    const session = await locals.auth.validate();
    
    if (!session) error(401, { message: 'Unauthorized' });
    
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
    
    if (!session) error(401, { message: 'Unauthorized' });
    
    const profile = await getUserProfileData(session?.user.userId);
    const clientId = profile?.clientId;
    
    const data = Object.fromEntries(await request.formData());
    const employeeId = data.employeeId as string;
    
    const emp = await getEmployee(employeeId, true, false);
    
    if (emp?.clientId !== clientId) error(403, { message: 'Unauthorized' });
    
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
    
    const overridesToEmployeeId = data.overridesToEmployeeId as string;
    
    if (overridesToEmployeeId) {
      await saveOverridingEmployee(employeeId, overridesToEmployeeId);
    }
    
    return data;
  }
};