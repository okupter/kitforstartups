import { getCampaigns } from '$lib/drizzle/mysql/models/campaigns';
import { getEmployees } from '$lib/drizzle/mysql/models/employees';
import { processImport, saveSales } from '$lib/drizzle/mysql/models/sales.js';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import type { InsertSale } from '$lib/types/db.model.js';
import type { ImportRow } from '$lib/types/sale.model.js';
import { redirect, type Actions, error } from '@sveltejs/kit';
import { read, utils, writeFile } from 'xlsx';

export const load = async ({ locals, request }) => {
  const session = await locals.auth.validate();
	const profile = await getUserProfileData(session?.user.userId);
  
  if (!session || !profile?.clientId) redirect(302, '/');
  if (!['org_admin', 'super_admin'].includes(profile?.role)) redirect(302, '/');
  
  const clientId = profile.clientId
  
  const campaigns = async () => {
    const campaigns = await getCampaigns(clientId);
    
    return campaigns.map(c => ({
      name: c.name,
      value: c.id,
    }));
  };
  
  const employees = async () => {
    const employees = await getEmployees(clientId, true);
    
    return employees.map(e => ({
      name: `${e.firstName} ${e.lastName}`,
      value: e.id,
    }));
  }
  
  return {
    campaigns: campaigns(),
    employees: employees(),
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
    
    if (!session) error(401, { message: 'Unauthorized' });
    
    const profile = await getUserProfileData(session?.user.userId);
    
    if (!profile?.clientId) error(401, { message: 'Unauthorized' });
    if (!['org_admin', 'super_admin'].includes(profile?.role)) error(401, { message: 'Unauthorized' });
    
    const result = {
      good: [] as InsertSale[],
      bad: [] as { property: string, sales: InsertSale[], }[],
      // bad: [] as InsertSale[],
    };
    const data = Object.fromEntries(await request.formData());
    
    const campaignId = data.campaign_id as string;
    const file = data.file as File;
    
    const workbook = read(await file.arrayBuffer(), { type: 'array', raw: false, cellDates: true, });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = utils.sheet_to_json<ImportRow>(sheet);
    
    const headers = Object.keys(rows[0]).map(h => h.toLowerCase().trim());
    
    if (headers.length !== Object.keys(importHeaders).length) 
      error(400, { message: 'Invalid or wrong number of headers provided', } as Error);
    
    const missingHeaders = Object.keys(importHeaders).map(k => importHeaders[k]).filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) 
      error(400, { message: 'Missing headers', cause: missingHeaders } as Error);
    
    const dtos = await processImport(profile.clientId, campaignId, rows);
    const badOnes = {} as { [key: string]: InsertSale[] };
    
    // check for missing employee ids
    dtos.forEach(d => {
      if (d.employeeId.includes('MISSING')) {
        const [, salesCode] = d.employeeId.split('|');
        
        if (badOnes[salesCode]?.length) badOnes[salesCode].push(d);
        else badOnes[salesCode] = [d];
      }
      else result.good.push(d);
    });
    
    for (const p in badOnes) {
      result.bad.push({ property: p, sales: badOnes[p], });
    }
    
    if (result.bad.length) return result;
    
    // save all of the good records
    await saveSales(result.good);
    
    return result;
  },
};