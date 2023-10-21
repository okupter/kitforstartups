import { getEmployee } from '$lib/drizzle/mysql/models/employees';

export const load = async ({ locals, params }) => {
  const id = params.id;
  
  return {
    ee: await getEmployee(id),
  };
}