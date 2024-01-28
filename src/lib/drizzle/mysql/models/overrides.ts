import { nanoid } from 'nanoid';
import { drizzleClient } from '../client';
import { overridingEmployee, saleOverride } from '../schema';
import type { InsertSaleOverride, SelectSale, SelectSaleOverride } from '$lib/types/db.model';
import type { InsertManualOverride } from '$lib/types/override.model';
import { error } from '@sveltejs/kit';

export const getPendingSaleOverrides = async (employeeId: string): Promise<SelectSaleOverride[]> => {
  if (!employeeId) return [] as SelectSaleOverride[];
  
  try {
    return await drizzleClient.query.saleOverride.findMany({
      where: (so, { eq, and, isNull }) => and(
        eq(so.beneficiaryEmployeeId, employeeId),
        isNull(so.paidOnPaystubId),
      ),
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

/**
 * Takes a list of sales for an employee, finds the corresponding override_employee records to determine all 
 * employees that should receive an override from this set of sales and then creates those records and submits them. 
 * These records cannot be attached to a paystub as they are being created when the agent's paystub is being created. 
 * There is risk in doing it this way in the instance where the admin manually adds overrides for an employee before 
 * adding them for the agents. The payroll admin is responsible for reviewing and removing any overrides that should not apply. 
 * 
 * @param sales 
 * @returns 
 */
export const createOverridesFromSalesForOverridingManagers = async (sales: SelectSale[]): Promise<{ success: boolean; total: number }> => {
  if (!sales?.length) error(400, 'Bad Request');
  
  let total = 0;
  const saleEmployeeIds = Array.from((new Set(sales.map(s => s.employeeId))).values());
  
  // get the override amounts for each employee
  const employeesReceivingOverrides = await drizzleClient.query.overridingEmployee.findMany({
    where: (oe, { inArray }) => inArray(oe.overridesEmployeeId, saleEmployeeIds),
  });
  
  const saleOverrides = [] as InsertSaleOverride[];
  
  sales.forEach(s => {
    employeesReceivingOverrides.forEach(oe => {
      const dto = {
        id: nanoid(),
        originatingSaleId: s.id,
        originatingEmployeeId: s.employeeId,
        clientId: s.clientId,
        beneficiaryEmployeeId: oe.employeeId,
        overrideAmount: oe.overrideAmount, // todo: we need to figure this out... update the sql db and add a column for this 
      } as InsertSaleOverride;
      
      const amt = dto.overrideAmount || 0;
      total += amt;
      
      saleOverrides.push(dto);
    });
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
  // const overrideEmployeeMap = {} as { [key: string]: number };
  // const beneficiaryEmployeeId = pendingManualOverrides[0].beneficiaryEmployeeId;
  
  // (await drizzleClient.query.overridingEmployee.findMany({
  //   where: (oe, { eq }) => eq(oe.overridesEmployeeId, beneficiaryEmployeeId),
  //   columns: {
  //     overridesEmployeeId: true,
  //     overrideAmount: true,
  //   },
  // }))?.forEach(oe => overrideEmployeeMap[oe.overridesEmployeeId] = oe.overrideAmount);
  
  const saleOverrides = pendingManualOverrides.map(s => {
    const dto = {
      id: nanoid(),
      originatingSaleId: null,
      originatingEmployeeId: s.originatingEmployeeId,
      clientId,
      beneficiaryEmployeeId: s.beneficiaryEmployeeId,
      overrideAmount: Number(s.overrideAmount), // todo: we need to figure this out... update the sql db and add a column for this
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
