import { drizzleClient as db } from '$lib/drizzle/mysql/client';
import { eq } from 'drizzle-orm';
import { employee, employeeProfile } from '../schema';
import type { Employee, InsertEmployee, InsertEmployeeProfile } from '$lib/types/db.model';

const getEmployees = async (clientId: string): Promise<Employee[]> => {
  if (!clientId) {
    return [];
  }
  
  const data = await db.select().from(employee)
    .innerJoin(employeeProfile, eq(employee.id, employeeProfile.employeeId))
    .where(eq(employee.clientId, clientId));
    
  return data;
}

const getEmployee = async (employeeId: string): Promise<Employee> => {
  if (!employeeId) {
    return null as unknown as Employee;
  }
  
  const data = await db.select().from(employee)
    .innerJoin(employeeProfile, eq(employee.id, employeeProfile.employeeId))
    .where(eq(employee.id, employeeId));
    
  return data[0];
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

export { getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee, };