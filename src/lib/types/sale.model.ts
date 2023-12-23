import type { InsertSale, SelectCampaign, SelectEmployee, SelectSale } from './db.model';


export type SaleWithEmployee = SelectSale & { employee: SelectEmployee, campaign: SelectCampaign };

export interface ImportRow {
  sale_date: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_address: string;
  status_description: string;
  sale_amount: string;
  sales_code: string;
}

export interface ImportSalesResult {
  bad: { property: string, sales: InsertSale[], }[];
  good: InsertSale[];
}
