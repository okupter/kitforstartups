import { drizzleClient } from '$lib/drizzle/mysql/client';
import type { SelectCampaign } from '$lib/types/db.model';

const getCampaigns = async (clientId: string): Promise<SelectCampaign[]> => {
  if (!clientId) {
    return [];
  }
  
  const data = await drizzleClient.query.campaigns.findMany({
    where: (campaign, { eq }) => eq(campaign.clientId, clientId),
    orderBy: (campaign, { asc }) => [asc(campaign.name)],
  });
  
  return data || [];
}

export { getCampaigns };