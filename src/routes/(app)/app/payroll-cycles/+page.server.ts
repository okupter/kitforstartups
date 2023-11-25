import { getPayrollCycles } from '$lib/drizzle/mysql/models/payroll-cycles';
import { numberOfPaystubsByPayrollCycleId } from '$lib/drizzle/mysql/models/paystubs.js';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import type { SelectPayrollCycle } from '$lib/types/db.model.js';


export const load = async ({ locals }) => {
  const session = await locals.auth.validate();
  
  if (!session) return { status: 401 };
  
  const payrollCycles = async (): Promise<(SelectPayrollCycle & { paystubCount: number })[]> => {
    const profile = await getUserProfileData(session?.user.userId);
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) return [];
    
    const payrollCycles = await getPayrollCycles(profile?.clientId as string);
    
    const payrollCyclesWithPaystubCount = payrollCycles.map(async (pc) => {
      const count = await numberOfPaystubsByPayrollCycleId(pc.id);
      
      return {
        ...pc,
        paystubCount: count,
      };
    });
    
    return await Promise.all(payrollCyclesWithPaystubCount);
  }
  
  return {
    payrollCycles: await payrollCycles(),
  };
}