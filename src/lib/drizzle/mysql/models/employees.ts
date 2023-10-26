import { drizzleClient as db } from '$lib/drizzle/mysql/client';
import { eq } from 'drizzle-orm';
import { employee, employeeProfile } from '../schema';
import type { Employee, InsertEmployee, InsertEmployeeProfile } from '$lib/types/db.model';

const getEmployees = async (clientId: string): Promise<Employee[]> => {
  if (!clientId) {
    return [];
  }
  
  const data = await db.query.employee.findMany({ 
    with: {
      employeeProfile: true,
      employeeCodes: true,
    },
    where: (employee, { eq }) => eq(employee.clientId, clientId),
  })
    
  return data;
}

const getEmployee = async (employeeId: string): Promise<Employee | undefined> => {
  if (!employeeId) {
    return null as unknown as Employee;
  }
  
  const data = await db.query.employee.findFirst({
    with: {
      employeeProfile: true,
      employeeCodes: true,
    },
    where: (employee, { eq }) => eq(employee.id, employeeId),
  });
    
  return data;
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