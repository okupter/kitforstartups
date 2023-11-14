import { getPayrollCycle } from '$lib/drizzle/mysql/models/payroll-cycles.js';
import { getPaystubs } from '$lib/drizzle/mysql/models/paystubs.js';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';


export const load = async ({ locals, params }) => {
  const session = await locals.auth.validate();
  if (!session) return { status: 401 };
  
  const profile = await getUserProfileData(session?.user.userId);
  
  const getData = async () => {  
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) return null;
    
    const cycle = await getPayrollCycle(params.id);
    
    if (profile.clientId !== cycle?.clientId) return null;
    
    const paystubs = await getPaystubs(profile?.clientId, cycle?.startDate as any, cycle?.endDate as any);
    
    return { cycle, paystubs };
  }
  
  return {
    cycleAndPaystubs: await getData(),
  };
};