import type { InsertSale, SaleDto, SelectEmployee, SelectSale } from '$lib/types/db.model';
import { nanoid } from 'nanoid';
import { drizzleClient } from '../client';
import { sale } from '../schema';
import dayjs from 'dayjs';
import { desc } from 'drizzle-orm';
import type { SaleWithEmployee } from '$lib/types/sale.model';

export const toInsertSale = (data: any): InsertSale => ({
  id: data.id || nanoid(),
  clientId: data.client_id,
  campaignId: data.campaign_id,
  saleDate: dayjs(data.sale_date).unix(),
  saleAmount: data.sale_amount,
  statusDescription: data.status_description,
  isComplete: data.is_complete,
  employeeId: data.employee_id,
  customerFirstName: data.customer_first_name,
  customerLastName: data.customer_last_name,
  customerAddress: data.customer_address,
  created: data.created || Date.now(),
  updated: data.updated || Date.now(),
} as InsertSale);

export const toClientDto = (data: InsertSale | SelectSale): SaleDto => ({
  id: data.id,
  client_id: data.clientId,
  campaign_id: data.campaignId,
  sale_date: data.saleDate as unknown as number,
  sale_amount: data.saleAmount as number,
  status_description: data.statusDescription,
  is_complete: data.isComplete == 1,
  employee_id: data.employeeId,
  created: Number(data.created),
  updated: Number(data.updated),
  customer_first_name: data.customerFirstName,
  customer_last_name: data.customerLastName,
  customer_address: data.customerAddress,
});

export const saveSale = async (dto: InsertSale): Promise<SelectSale> => {
  dto.id = nanoid();
  
  try {
    await drizzleClient.insert(sale).values({...dto});
  } catch (ex) {
    console.error(ex);
    return null as unknown as SelectSale;
  }
  
  return dto as SelectSale;
}

export const getSales = async <T = SelectSale>(clientId: string, startDate: string, endDate: string, withStmt: any = undefined): Promise<T[]> => {
  const sales = await drizzleClient.query.sale.findMany({
    with: withStmt || undefined,
    orderBy: s => desc(s.saleDate),
    where: (sale, { and, eq, gte, lte }) => and(
      eq(sale.clientId, clientId),
      gte(sale.saleDate, dayjs(startDate).unix()),
      lte(sale.saleDate, dayjs(endDate).unix()),
    ),
  });
  
  return sales as T[];
}