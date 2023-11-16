import { detachPayrollCycleFromPaystub } from '$lib/drizzle/mysql/models/paystubs.js';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users.js';
import type { SelectPaystub } from '$lib/types/db.model.js';


/**
 * Used to detach a payroll cycle from a paystub.
 *  
 * @type {import('./$types').RequestHandler} 
**/
export async function POST({ request, locals }) {
  const paystub = await request.json() as SelectPaystub;
  
  const session = await locals.auth.validate();
  if (!session) return new Response('Unauthorized', { status: 401 });
  
  const profile = await getUserProfileData(session.user.userId);
  
  if (!profile || profile.clientId != paystub.clientId) 
    return new Response('Unauthorized', { status: 401 });
  
  try {
    const result = await detachPayrollCycleFromPaystub(paystub.id);
    
    console.log(`Detached payroll cycle from paystub: ${result}`)
  } catch (ex) {
    console.error(ex);
    return new Response('Error detaching payroll cycle from paystub', {
      status: 500,
    });
  }
  
  return new Response(null, {
    status: 200,
    statusText: 'OK',
  });
}