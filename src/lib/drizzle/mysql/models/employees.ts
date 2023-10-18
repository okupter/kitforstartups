import { drizzleClient as db } from '$lib/drizzle/mysql/client';
import { eq } from 'drizzle-orm';
import { employee, employeeProfile } from '../schema';
import type { Employee } from '$lib/types/db.model';

const getEmployees = async (clientId: string): Promise<Employee[]> => {
  if (!clientId) {
    return [];
  }
  
  const data = await db.select().from(employee)
    .innerJoin(employeeProfile, eq(employee.id, employeeProfile.employeeId))
    .where(eq(employee.clientId, clientId));
    
  return data;
}

const createEmployee = async (employeeData: typeof employee.$inferInsert) => {
  try {
    await db.insert(employee)
      .values({
        ...employeeData,
        created: new Date().getMilliseconds() as any,
        updated: new Date().getMilliseconds() as any,
      });
  } catch (err) {
    console.error(err);
    return { success: false, };
  }
  
  return { success: true, };
}

const updateEmployee = async (employeeData: typeof employee.$inferInsert) => {
  try {
    await db.update(employee)
      .set({
        ...employeeData,
        updated: new Date().getMilliseconds() as any,
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
        deleted: new Date().getMilliseconds() as any,
      })
      .where(eq(employee.id, employeeId));
  } catch (err) {
    console.error(err);
    return { success: false, };
  }
  
  return { success: true, };
}

export { getEmployees, createEmployee, updateEmployee, deleteEmployee, };