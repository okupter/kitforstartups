import { nanoid } from 'nanoid';
import { drizzleClient } from '../client';
import { overridingEmployee, saleOverride } from '../schema';
import type { InsertSaleOverride, SelectSale, SelectSaleOverride } from '$lib/types/db.model';
import type { InsertManualOverride } from '$lib/types/override.model';

export const getPendingSaleOverrides = async (employeeId: string): Promise<SelectSaleOverride[]> => {
  if (!employeeId) return [] as SelectSaleOverride[];
  
  try {
    return await drizzleClient.query.saleOverride.findMany({
      where: (so, { eq }) => eq(so.beneficiaryEmployeeId, employeeId),
      with: {
        sale: {
          with: {
            employee: true,
          },
        },
      },
    });
  } catch (ex) {
    console.error(ex);
    return [] as SelectSaleOverride[];
  }
}

export const saveOverridingEmployee = async (employeeId: string, overridesToEmployeeId: string): Promise<boolean> => {
  if (!employeeId || !overridesToEmployeeId) return false;
  
  // check for existing override 
  const existingOverride = await drizzleClient.query.overridingEmployee.findFirst({
    where: (oe, { and, eq }) => and(eq(oe.employeeId, overridesToEmployeeId), eq(oe.overridesEmployeeId, employeeId)),
  });
  
  if (existingOverride) return true;
  
  try {
    await drizzleClient.insert(overridingEmployee)
      .values({
        id: nanoid(),
        employeeId: overridesToEmployeeId,
        overridesEmployeeId: employeeId,
      });
  } catch (ex) {
    console.error(ex);
    return false;
  }
  
  return true;
}

export const saveSaleOverrides = async (sales: SelectSale[], overridesToEmployeeId: string, paystubId: string | null = null): Promise<{ success: boolean; total: number }> => {
  if (!sales?.length) return false;
  
  let total = 0;
  const overrideEmployeeMap = {} as { [key: string]: number };
  
  (await drizzleClient.query.overridingEmployee.findMany({
    where: (oe, { eq }) => eq(oe.overridesEmployeeId, overridesToEmployeeId),
    columns: {
      overridesEmployeeId: true,
      overrideAmount: true,
    },
  }))?.forEach(oe => overrideEmployeeMap[oe.overridesEmployeeId] = oe.overrideAmount);
  
  const saleOverrides = sales.map(s => {
    const dto = {
      id: nanoid(),
      originatingSaleId: s.id,
      originatingEmployeeId: s.employeeId,
      clientId: s.clientId,
      beneficiaryEmployeeId: overridesToEmployeeId,
      overrideAmount: overrideEmployeeMap[s.employeeId] || 0, // todo: we need to figure this out... update the sql db and add a column for this 
      paidOnPaystubId: paystubId,
    } as InsertSaleOverride;
    
    const amt = dto.overrideAmount || 0;
    total += amt;
    
    return dto;
  });
  
  try {
    await drizzleClient.insert(saleOverride).values(saleOverrides);
  } catch (ex) {
    console.error(ex);
    return { success: false, total: 0, };
  }
  
  return { success: true, total, };
}

export const saveManualOverrides = async (clientId: string, paystubId: string, pendingManualOverrides: InsertManualOverride[]): Promise<{ success: boolean; total: number }> => {
  let total = 0;
  const overrideEmployeeMap = {} as { [key: string]: number };
  const overridesToEmployeeId = pendingManualOverrides[0].beneficiaryEmployeeId;
  
  (await drizzleClient.query.overridingEmployee.findMany({
    where: (oe, { eq }) => eq(oe.overridesEmployeeId, overridesToEmployeeId),
    columns: {
      overridesEmployeeId: true,
      overrideAmount: true,
    },
  }))?.forEach(oe => overrideEmployeeMap[oe.overridesEmployeeId] = oe.overrideAmount);
  
  const saleOverrides = pendingManualOverrides.map(s => {
    const dto = {
      id: nanoid(),
      originatingSaleId: null,
      originatingEmployeeId: s.originatingEmployeeId,
      clientId,
      beneficiaryEmployeeId: overridesToEmployeeId,
      overrideAmount: overrideEmployeeMap[s.originatingEmployeeId] || 0, // todo: we need to figure this out... update the sql db and add a column for this
      paidOnPaystubId: paystubId,
    };
    
    total += dto.overrideAmount;
    
    return dto;
  });
  
  try {
    await drizzleClient.insert(saleOverride).values(saleOverrides);
  } catch (ex) {
    console.error(ex);
    return { success: false, total: 0, };
  }
  
  return { success: true, total, };
}
