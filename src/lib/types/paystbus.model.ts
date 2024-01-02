import type { SelectCampaign, SelectClient, SelectEmployee, SelectEmployeeProfile, SelectPayrollCycle, SelectPaystub, SelectSale } from './db.model';

export type PaystubWith = (SelectPaystub & {
  employee: SelectEmployee & {
    employeeProfile: SelectEmployeeProfile;
  };
  campaign: SelectCampaign;
  payrollCycle: SelectPayrollCycle;
  sales: (SelectSale & {
    employee: SelectEmployee;
  })[];
  client: SelectClient;
});

export type CycleAndPaystubs = {
  cycle: SelectPayrollCycle;
  paystubs: PaystubWith[];
}