import { getPayrollCycle } from '$lib/drizzle/mysql/models/payroll-cycles.js';
import { attachPayrollCycleToPaystub, getPaystubs } from '$lib/drizzle/mysql/models/paystubs.js';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import type { SelectPayrollCycle } from '$lib/types/db.model.js';
import type { CycleAndPaystubs, PaystubWith } from '$lib/types/paystbus.model';
import type { Actions } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
  const session = await locals.auth.validate();
  if (!session) return { cycleAndPaystubs: null as unknown as CycleAndPaystubs };
  
  const profile = await getUserProfileData(session?.user.userId);
  
  const getData = async (): Promise<CycleAndPaystubs> => {  
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) return {
      cycle: null as unknown as SelectPayrollCycle,
      paystubs: [] as PaystubWith[],
    };
    
    const cycle = await getPayrollCycle(params.id);
    
    if (profile.clientId !== cycle?.clientId) return {
      cycle: null as unknown as SelectPayrollCycle,
      paystubs: [] as PaystubWith[],
    }
    
    const paystubs = await getPaystubs(profile?.clientId, cycle?.startDate as any, cycle?.endDate as any);
    
    return { cycle, paystubs };
  }
  
  return {
    cycleAndPaystubs: await getData(),
  };
};

export const actions: Actions = {
  'attach-payroll-cycle': async ({ request, locals, params }) => {
    const session = await locals.auth.validate();
    
    if (!session) return { status: 401 };
    
    const profile = await getUserProfileData(session?.user.userId);
    
    const formData = await request.formData();
    const data = Object.fromEntries(formData) as {
      paystubId: string;
      payrollCycleId: string;
    }
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) return null;
    
    const result = await attachPayrollCycleToPaystub(data.paystubId, data.payrollCycleId);
    
    return result;
  },
};