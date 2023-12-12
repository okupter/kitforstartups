import type { SelectCampaign, SelectEmployee, SelectSale } from './db.model';


export type SaleWithEmployee = SelectSale & { employee: SelectEmployee, campaign: SelectCampaign };