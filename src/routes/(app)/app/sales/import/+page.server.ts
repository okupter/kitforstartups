import { getCampaigns } from '$lib/drizzle/mysql/models/campaigns';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import { redirect, type Actions } from '@sveltejs/kit';
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
  customerName: 'customer_name',
  address: 'address',
  commissionable: {
    header: 'commissionable',
    values: ['accepted', 'pending', 'rejected'],
  },
  amount: 'amount',
} as any;

export const actions: Actions = {
  import: async ({ locals, request }) => {
    const session = await locals.auth.validate();
    
    if (!session) return { status: 401 };
    
    const profile = await getUserProfileData(session?.user.userId);
    
    if (!profile?.clientId) return { status: 401 };
    if (!['org_admin', 'super_admin'].includes(profile?.role)) return { status: 401 };
    
    const data = Object.fromEntries(await request.formData());
    
    const file = data.file as File;
    
    const workbook = read(await file.arrayBuffer(), { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = utils.sheet_to_json<{ [key: string]: any }>(sheet);
    
    const headers = Object.keys(rows[0]);
    
    if (headers.length !== Object.keys(importHeaders).length) {
      return { status: 400, body: { message: 'Invalid or wrong number of headers provided' } };
    }
    
    const missingHeaders = Object.keys(importHeaders).map(k => {
      if (typeof importHeaders[k] === 'object') {
        return importHeaders[k].header;
      }
      
      return importHeaders[k];
    }).filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      return { status: 400, body: { message: 'Missing headers', data: missingHeaders } };
    }
    
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
    
    return rows;
  },
};