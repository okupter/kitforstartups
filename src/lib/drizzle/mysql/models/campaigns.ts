import { drizzleClient } from '$lib/drizzle/mysql/client';
import type { SelectCampaign } from '$lib/types/db.model';

const getCampaign = async (clientId: string, campaignId: string): Promise<SelectCampaign | null> => {
  if (!clientId || !campaignId) {
    return null;
  }
  
  const data = await drizzleClient.query.campaigns.findFirst({
    where: (campaign, { and, eq }) => and(
      eq(campaign.clientId, clientId),
      eq(campaign.id, campaignId),
    ),
  });
  
  return data || null;
}

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

export { getCampaign, getCampaigns };