<script lang="ts">
	import { enhance } from '$app/forms';
	import SelectSalesTable from '$lib/components/SelectSalesTable.svelte';
	import type { SelectSale } from '$lib/types/db.model';
	import type { SaleTableInputData } from '$lib/types/sale-table-input-data.model';
	import { Breadcrumb, BreadcrumbItem, Button, Card, Helper, Label, Select } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

  
  export let data;
  const { employees, campaigns, cycles } = data;
  
  let submitBtn: HTMLButtonElement;
  let selectedSales: SelectSale[] = [];
  let selectedEmployee = '';
  let selectedCampaign = '';
  let selectedCycle = '';
  
  let salesTableData = {
    sales: [],
    startDate: '',
    endDate: '',
  } as SaleTableInputData;
  
  const handleSaleSelected = (e: CustomEvent<SelectSale[]>) => {
    const sales = e.detail;
    
    console.dir(sales);
    selectedSales = [...sales];
  };
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
          }
        }
      }}
    >
      <Card class="w-full max-w-md">
        <div class="flex flex-col space-y-6">
          <Label class="space-y-2">
            <span>Employee</span>
            <Select placeholder="Select Employee" name="employeeId" items={employees} value={selectedEmployee} on:change={() => submitBtn.click()} required />
          </Label>
        </div>
      </Card>
      
      <Card class="w-full max-w-md">
        <div class="flex flex-col space-y-6">
          <Label class="space-y-2">
            <span>Campaign</span>
            <Select placeholder="Select Campaign" name="campaignId" items={campaigns} value={selectedCampaign} on:change={() => submitBtn.click()} required />
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
    <Button disabled={!selectedSales?.length}>
      Next <ArrowRightOutline class="w-3.5 h-3.5 ms-2" />
    </Button>
  </div>
  
  <div class="mt-8">
    <SelectSalesTable bind:data={salesTableData} on:saleSelected={handleSaleSelected}></SelectSalesTable>
  </div>
</div>