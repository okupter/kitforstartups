import { getCampaigns } from '$lib/drizzle/mysql/models/campaigns';
import { getEmployees } from '$lib/drizzle/mysql/models/employees';
import { getSales } from '$lib/drizzle/mysql/models/sales';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import { redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';


export const load = async ({ locals, request }) => {
  const session = await locals.auth.validate();
	const profile = await getUserProfileData(session?.user.userId);
  
  if (!session || !profile?.clientId) throw redirect(302, '/');
  if (!['org_admin', 'super_admin'].includes(profile?.role)) throw redirect(302, '/');
  
  const clientId = profile.clientId;
  
  const startDate = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
  const endDate = dayjs().format('YYYY-MM-DD');
  
  const sales = async () => {
    const withStmt = {
      employee: {
        columns: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      campaign: {
        columns: {
          id: true,
          name: true,
        },
      },
    };
    
    return getSales(clientId, startDate, endDate, withStmt);
  }
  
  return {
    sales: sales(),
    startDate,
    endDate,
    campaigns: getCampaigns(clientId),
    employees: getEmployees(clientId, true),
  }
};