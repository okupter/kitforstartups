import type { SelectSaleOverride, SelectSale, SelectEmployee } from './db.model';


export interface OverrideTableInputData {
  overrides: (
    SelectSaleOverride & {
      sale: (
        SelectSale & {
          employee: SelectEmployee
        }
      );
      isManual: boolean;
      checked: boolean;
    }
  )[];
}