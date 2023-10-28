import { addEmployeeNote, getEmployee } from '$lib/drizzle/mysql/models/employees';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users.js';

export const load = async ({ locals, params }) => {
  const id = params.id;
  
  return {
    ee: await getEmployee(id),
  };
}

export const actions = {
  'add-note': async ({ locals, request }) => {
    const session = await locals.auth.validate();
    
    if (!session) return { status: 401 };
    
    const profile = await getUserProfileData(session?.user.userId);
    const myClientId = profile.clientId;
    
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries()) as {
      employee_id: string;
      notes: string;
    };
    
    const ee = await getEmployee(data.employee_id);
    
    if (!ee) return { status: 404 };
    if (ee.clientId !== myClientId) return { status: 403 };
    
    try {
      await addEmployeeNote(data.employee_id, data.notes);
    } catch (err) {
      console.error(err);
      return { status: 500 };
    }
    
    return data;
  },
};