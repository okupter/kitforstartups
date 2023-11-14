import { getPayrollCycles } from '$lib/drizzle/mysql/models/payroll-cycles';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import type { SelectPayrollCycle } from '$lib/types/db.model.js';


export const load = async ({ locals }) => {
  const session = await locals.auth.validate();
  
  if (!session) return { status: 401 };
  
  const payrollCycles = async (): Promise<SelectPayrollCycle[]> => {
    const profile = await getUserProfileData(session?.user.userId);
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) return [];
    
    return await getPayrollCycles(profile?.clientId as string);
  }
  
  return {
    payrollCycles: await payrollCycles(),
  };
}