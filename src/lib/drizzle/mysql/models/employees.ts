import { drizzleClient as db } from '$lib/drizzle/mysql/client';
import { eq } from 'drizzle-orm';
import { employee, employeeNotes, employeeProfile } from '../schema';
import type { Employee, InsertEmployee, InsertEmployeeNotes, InsertEmployeeProfile } from '$lib/types/db.model';
import { nanoid } from 'nanoid';

const getEmployees = async (clientId: string, isCommissionable = false): Promise<Employee[]> => {
  if (!clientId) {
    return [] as Employee[];
  }
  
  try {
    return await db.query.employee.findMany({ 
      with: {
        employeeProfile: true,
        employeeCodes: {
          where: (code, { eq }) => eq(code.isActive, true),
        },
      },
      where: (employee, { eq, and }) => and(
        eq(employee.clientId, clientId),
        eq(employee.isCommissionable, isCommissionable ? 1 : 0),
      ),
    });
  } catch (ex) {
    console.error(ex);
    return [] as Employee[];
  }
}

const getEmployee = async (employeeId: string, withProfile = true, withCodes = true, withNotes = true): Promise<Employee | undefined> => {
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
  const employeeResult = await _createEmployee(employeeData);
  
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

export { getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee,
  addEmployeeNote,
};