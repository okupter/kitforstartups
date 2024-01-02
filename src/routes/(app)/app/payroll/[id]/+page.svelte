<script lang="ts">
	import { formatCurrency, formatDate } from '$lib/utils.js';
	import { Breadcrumb, BreadcrumbItem, Card, Hr } from 'flowbite-svelte';
	import SalesTable from '$lib/components/SalesTable.svelte';
	import type { SaleTableInputData } from '$lib/types/sale-table-input-data.model';
	import dayjs from 'dayjs';
  
  export let data;
  
  const { paystub, campaigns } = data;
  
  const inputData = {
    sales: paystub.sales as any,
    campaigns,
    employees: [paystub.employee],
    startDate: dayjs(paystub.payrollCycle.startDate).format('YYYY-MM-DD'),
    endDate: dayjs(paystub.payrollCycle.endDate).format('YYYY-MM-DD'), 
  } as SaleTableInputData;
</script>

<div class="container max-w-5xl">
  <div class="flex">
    <div>
      <h1 class="text-2xl font-bold">Earnings Statement</h1>
      <p class="text-gray-500">Payment Date: {formatDate(paystub.payrollCycle.paymentDate)}</p>
    </div>
  </div>
  
  <div class="pb-4">
    <Breadcrumb>
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem href="/app/payroll/search">Payrolls</BreadcrumbItem>
      <BreadcrumbItem>Paystub</BreadcrumbItem>
    </Breadcrumb>
  </div>
  
  <div class="w-full p-2">
    <div class="flex py-3">
      <h5 class="mb-2 text-xl font-bold tracking-tight">
        {paystub.client.name}
      </h5>
    </div>
    
    <div class="flex py-4 justify-between items-end">
      <div>
        <h5 class="mb-2 text-xl font-bold tracking-tight">
          {paystub.employee.firstName} {paystub.employee.lastName}
        </h5>
        <div>
          <div>{paystub.employee?.employeeProfile.address}</div>
          <div>{paystub.employee?.employeeProfile.address2}</div>
          <div>{paystub.employee?.employeeProfile.city}, {paystub.employee?.employeeProfile.state} {paystub.employee?.employeeProfile.zip}</div>
        </div>
      </div>
      
      <div>
        <p class="mb-2 tracking-tight">
          <span class="font-bold">Pay Date:</span> {formatDate(paystub.payrollCycle.paymentDate)}
        </p>
        <p class="mb-2 tracking-tight">
          <span class="font-bold">Weekending:</span> {formatDate(paystub.payrollCycle.endDate)}
        </p>
      </div>
    </div>
    
    <div class="p-4 border-slate-300 border rounded-lg">
      <div class="flex justify-around gap-6 mt-4">
        <div>
          <h5 class="mb-2 text-lg font-bold tracking-tight">Gross Pay</h5>
          <p>
            {formatCurrency(paystub.grossPay)}
          </p>
        </div>
        <div>
          <h5 class="mb-2 text-lg font-bold tracking-tight">Total Deductions</h5>
          <p>
            {formatCurrency(paystub.taxDeductions + paystub.otherDeductions)}
          </p>
        </div>
        <div>
          <h5 class="mb-2 text-lg font-bold tracking-tight">Net Pay</h5>
          <p>
            {formatCurrency(paystub.netPay)}
          </p>
        </div>
      </div>
      
      <Hr classHr="w-48 h-1 mx-auto my-4 rounded md:my-10" />
      
      <div class="flex justify-around gap-6">
        <div>
          <h5 class="mb-2 text-lg font-bold tracking-tight"># of Sales</h5>
          <p class="text-center">
            {paystub.totalSales}
          </p>
        </div>
        <!-- {#if paystub.totalOverrides > 0} -->
          <div>
            <h5 class="mb-2 text-lg font-bold tracking-tight">Overrides</h5>
            <p class="text-center">
              {formatCurrency(paystub.totalOverrides)}
            </p>
          </div>
        <!-- {/if} -->
        <div>
          <h5 class="mb-2 text-lg font-bold tracking-tight">Expenses</h5>
          <p class="text-center">
            {formatCurrency(0)}
          </p>
        </div>
      </div>
      
      <Hr classHr="w-48 h-1 mx-auto my-4 rounded md:my-10" />
      
      <SalesTable data={inputData}></SalesTable>
    </div>
  </div>
</div>