<script lang="ts">
	import { enhance } from '$app/forms';
	import SelectSaleOverridesTable from '$lib/components/SelectSaleOverridesTable.svelte';
	import SelectSalesTable from '$lib/components/SelectSalesTable.svelte';
	import { getEmployeeOptions, getManualOverrides, getSelectedEmployee, setEmployeeOptions, setSelectedEmployee } from '$lib/components/context.js';
	import type { SelectEmployee, SelectSale, SelectSaleOverride } from '$lib/types/db.model';
	import type { OverrideTableInputData } from '$lib/types/override-table-input-data.model.js';
	import type { SaleTableInputData } from '$lib/types/sale-table-input-data.model';
	import { Breadcrumb, BreadcrumbItem, Button, Card, Helper, Label, Select } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
  
  export let data;
  const { employees, campaigns, cycles } = data;
  
  const selectedEmployeeContext = getSelectedEmployee();
  const employeeContext = getEmployeeOptions();
  employeeContext.set(employees);
  const manualOverrides = getManualOverrides();
  
  let submitBtn: HTMLButtonElement;
  let selectedSales: SelectSale[] = [];
  let selectedSaleOverrides: SelectSaleOverride[] = [];
  let selectedEmployee = '';
  let selectedCampaign = '';
  let selectedCycle = '';
  
  let salesTableData = {
    sales: [],
    startDate: '',
    endDate: '',
  } as SaleTableInputData;
  
  let overrideTableData = {
    overrides: [],
  } as OverrideTableInputData;
  
  const handleSaleSelected = (e: CustomEvent<SelectSale[]>) => {
    const sales = e.detail;
    selectedSales = [...sales];
  };
  
  const handleOverrideSelected = (e: CustomEvent<SelectSaleOverride[]>) => {
    const overrides = e.detail;
    selectedSaleOverrides = [...overrides];
  };
  
  const handleEmployeeSelect = (e: any) => {
    selectedEmployeeContext.set(e.target.value);
    submitBtn.click();
  }
</script>

<div class="container max-w-5xl">
  <div class="flex">
    <div>
      <h4 class="mb-2">Create a Paystub</h4>
      <p class="mb-4">
        Create a new paystub for an employee.
      </p>
    </div>
  </div>
  
  <div class="pb-4">
    <Breadcrumb>
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem href="/app/payroll/search">Payroll</BreadcrumbItem> 
      <BreadcrumbItem>Create a Paystub</BreadcrumbItem>
    </Breadcrumb>
  </div>
  
  <div class="grid grid-cols-3 pt-4 gap-2">
    <form action="?/get-sales-by-employee" method="post" class="flex gap-2 justify-between col-span-2"
      use:enhance={({ cancel }) => {
        
        return ({ result, update }) => {
          if (result.data) {
            salesTableData = {
              ...salesTableData,
              sales: [...result.data.sales],
            };
            
            overrideTableData = {
              ...overrideTableData,
              overrides: [...result.data.overrides,],
            };
          }
        }
      }}
    >
      <Card class="w-full max-w-md">
        <div class="flex flex-col space-y-6">
          <Label class="space-y-2">
            <span>Employee</span>
            <Select placeholder="Select Employee" name="employeeId" items={employees} bind:value={selectedEmployee} on:change={handleEmployeeSelect} required />
          </Label>
        </div>
      </Card>
      
      <Card class="w-full max-w-md">
        <div class="flex flex-col space-y-6">
          <Label class="space-y-2">
            <span>Campaign</span>
            <Select placeholder="Select Campaign" name="campaignId" items={campaigns} bind:value={selectedCampaign} on:change={() => submitBtn.click()} required />
          </Label>
        </div>
      </Card>
      <button type="submit" bind:this={submitBtn} class="hidden"></button>
    </form>
    
    <Card class="w-full max-w-md">
      <div class="flex flex-col space-y-6">
        <Label class="space-y-2">
          <span>Payroll Cycle <span class="text-gray-400 text-sm italic">Optional</span></span>
          <Select placeholder="Select Cycle" items={cycles} value={selectedCycle} />
          <Helper class="text-sm">
            Assign this paystub to a payroll cycle.
          </Helper>
        </Label>
      </div>
    </Card>
  </div>
  
  <div class="flex justify-end my-6">
    <form action="?/save-paystub" method="post" use:enhance={async ({ cancel, formData }) => {
      return ({ result, update }) => {
        console.dir(result);
      }
    }}>
      <Button disabled={!selectedSales?.length} type="submit">
        Next <ArrowRightOutline class="w-3.5 h-3.5 ms-2" />
      </Button>
      <input type="hidden" name="employeeId" value={selectedEmployee} />
      <input type="hidden" name="campaignId" value={selectedCampaign} />
      <input type="hidden" name="selectedSales" value={JSON.stringify(selectedSales)} />
      <input type="hidden" name="selectedSaleOverrides" value={JSON.stringify(selectedSaleOverrides)} />
      <input type="hidden" name="pendingManualOverrides" value={JSON.stringify($manualOverrides)} />
    </form>
  </div>
  
  <div class="my-6">
    <SelectSalesTable bind:data={salesTableData} on:saleSelected={handleSaleSelected}></SelectSalesTable>
  </div>
  
  <div class="my-6">
    <SelectSaleOverridesTable bind:data={overrideTableData} on:overrideSelected={handleOverrideSelected}></SelectSaleOverridesTable>
  </div>
</div>