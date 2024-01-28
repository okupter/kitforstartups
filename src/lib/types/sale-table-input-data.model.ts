import type { SelectCampaign, SelectEmployee } from './db.model';
import type { SaleWithEmployee } from './sale.model';


export interface SaleTableInputData {
  campaigns?: SelectCampaign[];
  employees?: SelectEmployee[];
  sales: (SaleWithEmployee & { checked: boolean })[];
  startDate: string;
  endDate: string;
}