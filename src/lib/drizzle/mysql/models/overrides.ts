import { nanoid } from 'nanoid';
import { drizzleClient } from '../client';
import { overridingEmployee, saleOverride } from '../schema';
import type { InsertSaleOverride, SelectSale, SelectSaleOverride } from '$lib/types/db.model';

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

export const saveSaleOverrides = async (sales: SelectSale[], overridesToEmployeeId: string, paystubId: string | null = null): Promise<boolean> => {
  if (!sales?.length) return false;
  
  const saleOverrides = sales.map(s => ({
    id: nanoid(),
    originatingSaleId: s.id,
    originatingEmployeeId: s.employeeId,
    clientId: s.clientId,
    beneficiaryEmployeeId: overridesToEmployeeId,
    overrideAmount: 0, // todo: we need to figure this out... update the sql db and add a column for this 
    paidOnPaystubId: paystubId,
  } as InsertSaleOverride));
  
  try {
    await drizzleClient.insert(saleOverride).values(saleOverrides);
  } catch (ex) {
    console.error(ex);
    return false;
  }
  
  return true;
}