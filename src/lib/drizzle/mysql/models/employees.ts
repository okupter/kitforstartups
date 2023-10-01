import { drizzleClient as db } from '$lib/drizzle/mysql/client';
import { eq } from 'drizzle-orm';
import { employee, employeeProfile } from '../schema';


const getEmployees = async (clientId: string) => {
  if (!clientId) {
    return undefined;
  }
  
  const data = await db.select().from(employee)
    .innerJoin(employeeProfile, eq(employee.id, employeeProfile.employeeId))
    .where(eq(employee.clientId, clientId));
    
  return data;
}

export { getEmployees };