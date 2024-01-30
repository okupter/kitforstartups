<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SelectSale, SelectSaleOverride } from '$lib/types/db.model.js';
	import type { OverrideTableInputData } from '$lib/types/override-table-input-data.model.js';
	import type { SaleTableInputData } from '$lib/types/sale-table-input-data.model.js';
	import dayjs from 'dayjs';
	import { Breadcrumb, BreadcrumbItem, Card, Helper, Label, Select, Tabs, TabItem, Input } from 'flowbite-svelte';

  export let data;
  const { campaigns, employees, startDate, endDate, } = data;
  
  let submitBtn: HTMLButtonElement;
  let selectedSales: SelectSale[] = [];
  let selectedSaleOverrides: SelectSaleOverride[] = [];
  let selectedEmployee = '';
  let selectedCampaign = '';
  let selectedCycle = '';
</script>

<div class="container max-w-5xl">
  <div class="flex">
    <div>
      <h4 class="mb-2">Search Paystubs</h4>
      <p class="mb-4">
        Search paystubs by employee, campaign, or cycle.
      </p>
    </div>
  </div>
  
  <div class="pb-4">
    <Breadcrumb>
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem href="/app/payroll/search">Payroll</BreadcrumbItem>
    </Breadcrumb>
  </div>
  
  <!-- <div class="grid grid-cols-4 pt-4 gap-2"> -->
    <form action="?/search" method="post" class="grid grid-cols-4 pt-4 gap-2"
      use:enhance={({ cancel }) => {
        
        return ({ result, update }) => {
          if (result.data) {
            console.dir(result.data);
            // salesTableData = {
            //   ...salesTableData,
            //   sales: [...result.data.sales],
            // };
            
            // overrideTableData = {
            //   ...overrideTableData,
            //   overrides: [...result.data.overrides,],
            // };
          }
        }
      }}
    >
      <Card class="grid grid-cols-2 gap-2 max-w-md col-span-2">
        <Label class="space-y-2">
          <span>Start Date</span>
          <Input type="date" name="startDate" value={startDate} />
        </Label>
        
        <Label class="space-y-2">
          <span>End Date</span>
          <Input type="date" name="endDate" value={endDate} />
        </Label>
      </Card>
      
      <Card class="w-full max-w-md">
        <div class="flex flex-col space-y-6">
          <Label class="space-y-2">
            <span>Employee</span>
            <Select placeholder="Filter by Employee" name="employeeId" items={employees} bind:value={selectedEmployee} on:change={() => submitBtn.click()} />
          </Label>
        </div>
      </Card>
      
      <Card class="w-full max-w-md">
        <div class="flex flex-col space-y-6">
          <Label class="space-y-2">
            <span>Campaign</span>
            <Select placeholder="Filter by Campaign" name="campaignId" items={campaigns} bind:value={selectedCampaign} on:change={() => submitBtn.click()} />
          </Label>
        </div>
      </Card>
      <button type="submit" bind:this={submitBtn} class="hidden"></button>
    </form>
  <!-- </div> -->
</div>