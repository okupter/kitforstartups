import type { SelectCampaign, SelectEmployee } from './db.model';
import type { SaleWithEmployee } from './sale.model';


export interface SaleTableInputData {
  campaigns?: SelectCampaign[];
  employees?: SelectEmployee[];
  sales: SaleWithEmployee[];
  startDate: string;
  endDate: string;
}