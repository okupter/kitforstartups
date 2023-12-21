import { getCampaigns } from '$lib/drizzle/mysql/models/campaigns';
import { processImport } from '$lib/drizzle/mysql/models/sales.js';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import type { InsertSale } from '$lib/types/db.model.js';
import type { ImportRow } from '$lib/types/sale.model.js';
import { redirect, type Actions, error } from '@sveltejs/kit';
import { read, utils, writeFile } from 'xlsx';

export const load = async ({ locals, request }) => {
  const session = await locals.auth.validate();
	const profile = await getUserProfileData(session?.user.userId);
  
  if (!session || !profile?.clientId) throw redirect(302, '/');
  if (!['org_admin', 'super_admin'].includes(profile?.role)) throw redirect(302, '/');
  
  const clientId = profile.clientId
  
  const campaigns = async () => {
    const campaigns = await getCampaigns(clientId);
    
    return campaigns.map(c => ({
      name: c.name,
      value: c.id,
    }));
  };
  
  return {
    campaigns: campaigns(),
  };
};

const importHeaders = {
  date: 'sale_date',
  salesCode: 'sales_code',
  customerFirstName: 'customer_first_name',
  customerLastName: 'customer_last_name',
  customerAddress: 'customer_address',
  statusDescription: 'status_description',
  saleAmount: 'sale_amount',
} as any;

export const actions: Actions = {
  import: async ({ locals, request }) => {
    const session = await locals.auth.validate();
    
    if (!session) throw error(401, { message: 'Unauthorized' });
    
    const profile = await getUserProfileData(session?.user.userId);
    
    if (!profile?.clientId) throw error(401, { message: 'Unauthorized' });
    if (!['org_admin', 'super_admin'].includes(profile?.role)) throw error(401, { message: 'Unauthorized' });
    
    const result = {
      good: [] as InsertSale[],
      bad: [] as InsertSale[],
    };
    const data = Object.fromEntries(await request.formData());
    
    const campaignId = data.campaign_id as string;
    const file = data.file as File;
    
    const workbook = read(await file.arrayBuffer(), { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = utils.sheet_to_json<ImportRow>(sheet);
    
    const headers = Object.keys(rows[0]).map(h => h.toLowerCase().trim());
    
    if (headers.length !== Object.keys(importHeaders).length) 
      throw error(400, { message: 'Invalid or wrong number of headers provided', } as Error);
    
    const missingHeaders = Object.keys(importHeaders).map(k => importHeaders[k]).filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) 
      throw error(400, { message: 'Missing headers', cause: missingHeaders } as Error);
    
    const dtos = await processImport(profile.clientId, campaignId, rows);
    
    // check for missing employee ids
    dtos.forEach(d => {
      if (d.employeeId === 'MISSING')
        result.bad.push(d);
      else 
        result.good.push(d);
    });
    
    // const sales = rows.map((value, index, arr) => {
    //   const sale = {} as { [key: string]: any };
      
    //   for (const p in value) {
    //     if (value[p] === '') {
    //       delete value[p];
    //     }
    //     sale[p] = value[p];
    //   }
      
    //   return sale;
    // });
    
    return result;
  },
};