import type { InsertPayrollCycle, SelectPayrollCycle } from '$lib/types/db.model';
import { drizzleClient } from '../client';
import { payrollCycle } from '../schema';

export const getPayrollCycles = async (clientId: string): Promise<SelectPayrollCycle[]> => {
  if (!clientId) {
    return [];
  }
  
  const data = await drizzleClient.query.payrollCycle.findMany({
    where: (pc, { eq }) => eq(pc.clientId, clientId),
    orderBy: (pc, { asc }) => [asc(pc.startDate)],
  });
  
  return data || [];
}

export const getPayrollCycle = async (id: string): Promise<SelectPayrollCycle | null> => {
  if (!id) return null;
  
  const data = await drizzleClient.query.payrollCycle.findFirst({
    where: (pc, { eq }) => eq(pc.id, id),
  });
  
  return data || null;
}

export const addPayrollCycle = async (dto: InsertPayrollCycle): Promise<SelectPayrollCycle | null> => {
  if (!dto) return null;
  
  try {
    await drizzleClient.insert(payrollCycle)
      .values(dto);
  } catch (ex) {
    console.error(ex);
    return null;
  }
  
  return {...dto} as SelectPayrollCycle;
}