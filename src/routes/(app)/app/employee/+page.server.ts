import { createEmployee, getEmployees } from '$lib/drizzle/mysql/models/employees';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import type { Employee, InsertEmployee, InsertEmployeeProfile } from '$lib/types/db.model';
import { nanoid } from 'nanoid';


export const load = async ({locals}) => {
  const session = await locals.auth.validate();
  
  if (!session) return { status: 401 };
  
  const employees = async (): Promise<Employee[]> => {
    const up = await getUserProfileData(session?.user.userId);
    
    if (!up) return [];
    
    return await getEmployees(up?.clientId as string);
  }
  
  return {
    session,
    employees: await employees(),
  };
}

export const actions = {
  add: async ({ locals, request }) => {
    const session = await locals.auth.validate();
    
    if (!session) return { status: 401 };
    
    const profile = await getUserProfileData(session?.user.userId);
    
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries());
    const insertEmployee: InsertEmployee = {
      id: nanoid(),
      firstName: data.first_name as string,
      lastName: data.last_name as string,
      clientId: profile.clientId as string,
      userId: data.user_id as string,
      created: Date.now() as any,
      updated: Date.now() as any,
    };
    
    const insertEmployeeProfile: InsertEmployeeProfile = {
      id: nanoid(),
      employeeId: insertEmployee.id,
      address: data.address as string,
      address2: data.address_2 as string,
      city: data.city as string,
      state: data.state as string,
      zip: data.zip as string,
      phone: data.phone as string,
      phone2: data.phone_2 as string,
      email: data.email as string,
    };
    
    try {
      await createEmployee(insertEmployee, insertEmployeeProfile);
    } catch (err) {
      console.error(err);
      return { status: 500 };
    }
    
    return data;
  }
}