import { getCampaigns } from '$lib/drizzle/mysql/models/campaigns.js';
import { getEmployee, getEmployees } from '$lib/drizzle/mysql/models/employees.js';
import { getPendingSaleOverrides, saveManualOverrides, saveSaleOverrides } from '$lib/drizzle/mysql/models/overrides.js';
import { getPayrollCycles } from '$lib/drizzle/mysql/models/payroll-cycles.js';
import { generatePendingPaystub, insertPaystub } from '$lib/drizzle/mysql/models/paystubs.js';
import { getUnallocatedSalesByEmployee, saveSales } from '$lib/drizzle/mysql/models/sales.js';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import type { Employee, SelectSale, SelectSaleOverride } from '$lib/types/db.model';
import type { InsertManualOverride } from '$lib/types/override.model.js';
import { formatDate } from '$lib/utils.js';
import { error } from '@sveltejs/kit';


export const load = async ({ locals }) => {
  const session = await locals.auth.validate();
  
  if (!session) error(401, 'Unauthorized');
  
  const profile = await getUserProfileData(session?.user.userId);
  
  if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) error(403, 'Forbidden');
  
  const campaigns = async () => {
    const camps = await getCampaigns(profile?.clientId || '');
    return camps.map(cc => ({
      name: cc.name,
      value: cc.id,
    }));
  };
  const employees = async () => {
    const emps = await getEmployees(profile?.clientId || '');
    return emps.map(ee => ({
      name: `${ee.firstName} ${ee.lastName}`,
      value: ee.id,
    }));
  };
  const payrollCycles = async () => {
    const cycles = await getPayrollCycles(profile?.clientId || '');
    return cycles.map(cc => ({
      name: `${formatDate(cc.startDate)} - ${formatDate(cc.endDate)}`,
      value: cc.id,
    }));
  }
  
  return {
    campaigns: await campaigns(),
    employees: await employees(),
    cycles: await payrollCycles(),
  };
};

export const actions = {
  'get-sales-by-employee': async ({ locals, request }) => {
    const session = await locals.auth.validate();
    
    if (!session) error(401, 'Unauthorized');
    
    const profile = await getUserProfileData(session?.user.userId);
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) error(403, 'Forbidden');
    
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries());
    const { employeeId, campaignId } = data;
    
    const sales = await getUnallocatedSalesByEmployee(profile?.clientId || '', `${campaignId}`, `${employeeId}`);
    const overrides = await getPendingSaleOverrides(employeeId as string);
    
    return { sales, overrides };
  },
  'save-selected-sales': async ({ locals, request }) => {
    const session = await locals.auth.validate();
    
    if (!session) error(401, 'Unauthorized');
    
    const profile = await getUserProfileData(session?.user.userId);
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) error(403, 'Forbidden');
    
    const payload = await request.formData();
    const { selectedSales: salesRaw, employeeId, campaignId, selectedSaleOverrides: rawOverrides, pendingManualOverrides: rawManualOverrides } = Object.fromEntries(payload.entries());
    const selectedSales = JSON.parse(salesRaw as any) as SelectSale[];
    const selectedOverrides = JSON.parse(rawOverrides as any) as SelectSaleOverride[];
    const pendingManualOverrides = JSON.parse(rawManualOverrides as any) as InsertManualOverride[];
    const clientId = profile?.clientId || '';
    
    if (!clientId || !employeeId || !campaignId || !selectedSales?.length) error(400, 'Bad Request');
    
    const pendingPaystub = generatePendingPaystub(clientId, employeeId as string, campaignId as string);
    
    pendingPaystub.totalSales = selectedSales.length;
    
    const employee = await getEmployee(employeeId as string, false, false, false, true) as unknown as Employee;
    const { overrideTo } = employee;
    
    // employee has a default override manager selected, so let's create override records for each sale that has been 
    // saved to this paystub. 
    if (overrideTo) {
      // todo: how do i save pending overrides without overlapping with the selected overrides? 
      // save sale overrides based on the default agent rule
      const overridesSaved = await saveSaleOverrides(selectedSales, overrideTo.employeeId, pendingPaystub.id);
      if (!overridesSaved.success) {
        console.error('Error saving sale overrides');
        error(500, 'Error saving sale overrides');
      }
      
      const manualOverridesSaved = await saveManualOverrides(clientId, pendingPaystub.id, pendingManualOverrides);
      if (!manualOverridesSaved.success) {
        console.error('Error saving manual overrides');
        error(500, 'Error saving manual overrides');
      }
      
      pendingPaystub.grossPay += (overridesSaved.total + manualOverridesSaved.total);
      pendingPaystub.totalOverrides = selectedSales.length + pendingManualOverrides.length;
    } 
    
    const sales = await saveSales(selectedSales);
    pendingPaystub.totalSales = sales.length;
    pendingPaystub.grossPay += sales.reduce((acc, curr) => acc + curr.saleAmount, 0);
    pendingPaystub.netPay = pendingPaystub.grossPay;
    
    // save the paystub
    const paystubSaved = await insertPaystub(pendingPaystub);
    
    // test data
    return {
      paystub: paystubSaved,
    };
  },
  'add-manual-override': async ({ locals, request }) => {
    const session = await locals.auth.validate();
    
    if (!session) error(401, 'Unauthorized');
    
    const profile = await getUserProfileData(session?.user.userId);
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) error(403, 'Forbidden');
    
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries());
    
    // todo: save the override
    
    return data;
  },
};