import { getCampaigns } from '$lib/drizzle/mysql/models/campaigns';
import { getPaystubById } from '$lib/drizzle/mysql/models/paystubs.js';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import { error } from '@sveltejs/kit';


export const load = async ({ locals, params }) => {
  const session = await locals.auth.validate();
  if (!session) error(401, 'Unauthorized');
  
  const profile = await getUserProfileData(session?.user.userId);
  
  if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) error(401, 'Unauthorized');
  
  const payrollId = params.id;
  
  const getPayroll = () => getPaystubById(profile?.clientId as string, payrollId);
  
  const campaigns = () => getCampaigns(profile?.clientId as string);
  
  return {
    paystub: await getPayroll(),
    campaigns: await campaigns(),
  };
};