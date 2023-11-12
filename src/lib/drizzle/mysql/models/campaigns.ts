import { drizzleClient } from '$lib/drizzle/mysql/client';
import type { InsertCampaign, SelectCampaign } from '$lib/types/db.model';
import { eq } from 'drizzle-orm';
import { campaigns } from '../schema';
import { nanoid } from 'nanoid';

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

const updateCampaign = async (campaign: InsertCampaign): Promise<SelectCampaign | null> => {
  if (!campaign) return null;
  const updated = Date.now() as any;
  
  try {
    const current = await getCampaign(campaign.clientId, campaign.id);
    
    if (!current) return null;
    
    await drizzleClient.update(campaigns)
      .set({
        name: campaign.name,
        description: campaign.description,
        url: campaign.url,
        active: campaign.active,
        updated,
      })
      .where(eq(campaigns.id, campaign.id));
  } catch (ex) {
    console.error(ex);
    return null;
  }
  
  return {
    id: campaign.id,
    clientId: campaign.clientId,
    name: campaign.name,
    description: campaign.description,
    url: campaign.url,
    active: campaign.active,
    updated,
  } as SelectCampaign;
}

const addCampaign = async (campaign: InsertCampaign): Promise<SelectCampaign | null> => {
  if (!campaign) return null;
  const updated = Date.now() as any;
  
  const dto = {
    id: nanoid(),
    clientId: campaign.clientId,
    name: campaign.name,
    description: campaign.description,
    url: campaign.url,
    active: campaign.active,
    created: updated,
    updated,
  } as InsertCampaign;
  
  try {
    await drizzleClient.insert(campaigns)
      .values(dto);
  } catch (ex) {
    console.error(ex);
    return null;
  }
  
  return dto as SelectCampaign;
}

export { getCampaign, getCampaigns, updateCampaign, addCampaign };