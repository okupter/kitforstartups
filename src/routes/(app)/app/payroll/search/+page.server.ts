import { getCampaigns } from '$lib/drizzle/mysql/models/campaigns';
import { getEmployees } from '$lib/drizzle/mysql/models/employees';
import { getPayrollCycles } from '$lib/drizzle/mysql/models/payroll-cycles';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import { formatDate } from '$lib/utils';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';


export const load = async ({ locals }) => {
  const session = await locals.auth.validate();
  
  if (!session) error(401, 'Unauthorized');
  
  const profile = await getUserProfileData(session?.user.userId);
  
  if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) error(403, 'Forbidden');
  
  const campaigns = async () => {
    const camps = await getCampaigns(profile?.clientId || '');
    return camps.map(cc => ({
      name: cc.name,
      value: cc.id,
    }));
  };
  const employees = async () => {
    const emps = await getEmployees(profile?.clientId || '');
    return emps.map(ee => ({
      name: `${ee.firstName} ${ee.lastName}`,
      value: ee.id,
    }));
  };
  
  const startDate = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
  const endDate = dayjs().format('YYYY-MM-DD');
  
  return {
    campaigns: await campaigns(),
    employees: await employees(),
    startDate, 
    endDate,
  };
}

export const actions = {
  'search': async ({ locals, request }) => {
    const session = await locals.auth.validate();
    
    if (!session) error(401, 'Unauthorized');
    
    const profile = await getUserProfileData(session?.user.userId);
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) error(403, 'Forbidden');
    
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries());
    const { employeeId, startDate: startDateStr, endDate: endDateStr, campaignId } = data;
    const startDate = dayjs(startDateStr as string, 'YYYY-MM-DD').unix();
    const endDate = dayjs(endDateStr as string, 'YYYY-MM-DD').unix();
    
    
    
    return { campaignId, employeeId, startDate, endDate };
  }
}