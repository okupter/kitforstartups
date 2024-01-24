import { drizzleClient as db, drizzleClient } from '$lib/drizzle/mysql/client';
import { and, eq } from 'drizzle-orm';
import { employee, employeeCodes, employeeNotes, employeeProfile } from '../schema';
import type { Employee, InsertEmployee, InsertEmployeeCode, InsertEmployeeNotes, InsertEmployeeProfile, SelectEmployee, SelectEmployeeCode } from '$lib/types/db.model';
import { nanoid } from 'nanoid';
import { error } from '@sveltejs/kit';

const getEmployees = async (clientId: string, isCommissionable = false): Promise<Employee[]> => {
  if (!clientId) {
    return [] as Employee[];
  }
  
  const andQuery = (employee: any, { eq, and }: { eq: any, and: any }) => isCommissionable ? and(
    eq(employee.clientId, clientId),
    eq(employee.isCommissionable, 1),
  ) : eq(employee.clientId, clientId);
  
  try {
    return await db.query.employee.findMany({ 
      with: {
        employeeProfile: true,
        employeeCodes: {
          where: (code, { eq }) => eq(code.isActive, true),
        },
      },
      where: andQuery,
    });
  } catch (ex) {
    console.error(ex);
    return [] as Employee[];
  }
}

const getEmployee = async (employeeId: string, withProfile = true, withCodes = true, withNotes = true, withOverride = true): Promise<Employee | undefined> => {
  if (!employeeId) {
    return null as unknown as Employee;
  }
  
  const data = await db.query.employee.findFirst({
    with: {
      employeeProfile: withProfile as any,
      employeeCodes: withCodes ? {
        where: (code, { eq }) => eq(code.isActive, true),
      } : false as any,
      employeeNotes: withNotes ? {
        orderBy: (employeeNotes, { desc }) => [desc(employeeNotes.created)],
      } : false as any,
      overrideTo: withOverride ? {
        employeeId: true,
      } : false as any,
    },
    where: (employee, { eq }) => eq(employee.id, employeeId),
  });
    
  return data as any;
}

const _createEmployee = async (employeeData: InsertEmployee) => {
  try {
    await db.insert(employee)
      .values({
        ...employeeData,
        created: Date.now() as any,
        updated: Date.now() as any,
      });
  } catch (err) {
    console.error(err);
    return { success: false, };
  }
  
  return { success: true, };
}

const createEmployee = async (employeeData: InsertEmployee, employeeProfileData: InsertEmployeeProfile) => {
  const employeeResult = await _createEmployee({...employeeData, isCommissionable: 1,});
  
  if (!employeeResult.success) {
    return employeeResult;
  }
  
  try {
    await db.insert(employeeProfile)
      .values({...employeeProfileData});
  } catch (err) {
    console.error(err);
    return { success: false, };
  }
  
  return { success: true, };
}

const updateEmployee = async (employeeData: InsertEmployee) => {
  try {
    await db.update(employee)
      .set({
        ...employeeData,
        updated: Date.now() as any,
      })
      .where(eq(employee.id, employeeData.id));
  } catch (err) {
    console.error(err);
    return { success: false, };
  }
  
  return { success: true, };
}

const deleteEmployee = async (employeeId: string) => {
  try {
    await db.update(employee)
      .set({
        deleted: Date.now() as any,
      })
      .where(eq(employee.id, employeeId));
  } catch (err) {
    console.error(err);
    return { success: false, };
  }
  
  return { success: true, };
}

const addEmployeeNote = async (employeeId: string, note: string) => {
  
  const dto = {
    id: nanoid(),
    employeeId,
    note,
    created: Date.now() as any,
  } as InsertEmployeeNotes;
  
  try {
    await db.insert(employeeNotes).values(dto);
  } catch (err) {
    console.error(err);
    return { success: false, };
  }
  
}

export const getEmployeeIdByCampaignSalesCode = async (campaignId: string, salesCode: string): Promise<string> => {
  if (!salesCode) return '';
  
  try {
    // const ee = await db.query.employee.findFirst({
    //   with: {
    //     employeeCodes: {
    //       where: (code, { eq, and }) => and(
    //         eq(code.campaignId, campaignId),
    //         eq(code.employeeCode, salesCode),
    //       ),
    //     },
    //   },
    // });
    
    const res = (await db.select({ id: employee.id, })
      .from(employee)
      .innerJoin(employeeCodes, eq(employee.id, employeeCodes.employeeId))
      .where(and(
        eq(employeeCodes.campaignId, campaignId),
        eq(employeeCodes.employeeCode, salesCode),
      ))
      .execute());
      
    // const employeeId = res[0]?.id || '';
    
    return res[0]?.id || '';
  } catch (ex) {
    console.error(ex);
    return '';
  }
}

export const upsertEmployeeCodes = async (dtos: { employeeId: string, employeeCode: string, campaignId: string, isActive: boolean }[]) => {
  if (!dtos || dtos.length < 1) return;
  
  const results: { id: string, employeeId: string, employeeCode: string, campaignId: string, isActive: boolean }[] = [];
  
  dtos.forEach(async dto => {
    const curr = await db.query.employeeCodes.findFirst({
      where: (code, { eq }) => and(
        eq(code.employeeId, dto.employeeId),
        eq(code.campaignId, dto.campaignId),
      ),
    }) as SelectEmployeeCode;
    
    try {
      if (curr && curr.employeeCode !== dto.employeeCode) {
        await db.update(employeeCodes)
          .set({
            employeeCode: dto.employeeCode,
            isActive: dto.isActive,
          })
          .where(eq(employeeCodes.id, curr.id));
          
        results.push({
          ...dto,
          id: curr.id,
        });
      } else if (!curr) {
        const insertId = nanoid();
        
        await db.insert(employeeCodes)
          .values({
            id: insertId,
            employeeId: dto.employeeId,
            employeeCode: dto.employeeCode,
            campaignId: dto.campaignId,
            isActive: dto.isActive,
            created: Date.now() as any,
            updated: Date.now() as any,
          } as InsertEmployeeCode);
          
        results.push({
          ...dto,
          id: insertId,
        });
      }
    } catch (ex) {
      console.error(ex);
      error(500, { message: 'Error upserting employee codes' });
    }
  });
  
  return results;
}

export { getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee,
  addEmployeeNote,
};