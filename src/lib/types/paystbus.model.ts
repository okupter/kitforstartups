import type { SelectCampaign, SelectEmployee, SelectPayrollCycle, SelectPaystub, SelectSale } from './db.model';

export type PaystubWith = (SelectPaystub & {
  employee: SelectEmployee;
  campaign: SelectCampaign;
  payrollCycle: SelectPayrollCycle;
  sales: (SelectSale & {
    employee: SelectEmployee;
  })[];
});

export type CycleAndPaystubs = {
  cycle: SelectPayrollCycle;
  paystubs: PaystubWith[];
}