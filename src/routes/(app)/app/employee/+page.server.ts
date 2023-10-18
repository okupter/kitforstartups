import { getEmployees } from '$lib/drizzle/mysql/models/employees';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users.js';
import type { Employee } from '$lib/types/db.model.js';


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
    
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries());
    
    return data;
  }
}