import { getCampaigns } from '$lib/drizzle/mysql/models/campaigns.js';
import { getEmployees } from '$lib/drizzle/mysql/models/employees.js';
import { getPayrollCycles } from '$lib/drizzle/mysql/models/payroll-cycles.js';
import { getUnallocatedSalesByEmployee } from '$lib/drizzle/mysql/models/sales.js';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import { formatDate } from '$lib/utils.js';
import { error } from '@sveltejs/kit';


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
  const payrollCycles = async () => {
    const cycles = await getPayrollCycles(profile?.clientId || '');
    return cycles.map(cc => ({
      name: `${formatDate(cc.startDate)} - ${formatDate(cc.endDate)}`,
      value: cc.id,
    }));
  }
  
  return {
    campaigns: await campaigns(),
    employees: await employees(),
    cycles: await payrollCycles(),
  };
};

export const actions = {
  'get-sales-by-employee': async ({ locals, request }) => {
    const session = await locals.auth.validate();
    
    if (!session) error(401, 'Unauthorized');
    
    const profile = await getUserProfileData(session?.user.userId);
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) error(403, 'Forbidden');
    
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries());
    const { employeeId, campaignId } = data;
    
    const sales = await getUnallocatedSalesByEmployee(profile?.clientId || '', `${campaignId}`, `${employeeId}`);
    
    return { sales };
  },
};