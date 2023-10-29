import { drizzleClient } from '$lib/drizzle/mysql/client';
import type { SelectCampaign } from '$lib/types/db.model';
import { campaigns } from '../schema';
import { eq } from 'drizzle-orm';

const getCampaigns = async (clientId: string): Promise<SelectCampaign[]> => {
  if (!clientId) {
    return [];
  }
  
  const data = await drizzleClient.query.campaigns.findMany({
    where: (campaign, { eq }) => eq(campaign.clientId, clientId),
  });
  
  return data || [];
}

export { getCampaigns };