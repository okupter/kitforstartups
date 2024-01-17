<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SelectCampaign, SelectEmployee } from '$lib/types/db.model';
	import type { SaleTableInputData } from '$lib/types/sale-table-input-data.model';
	import type { SaleWithEmployee } from '$lib/types/sale.model';
	import { formatDate } from '$lib/utils';
	import dayjs from 'dayjs';
	import { Label, Button, Select, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, Table } from 'flowbite-svelte';
	import { CloseSolid } from 'flowbite-svelte-icons';
	import { PlusIcon, PenIcon } from 'lucide-svelte';
  
  export let data: SaleTableInputData;
  export let viewOnly = false;
  
  let { campaigns, employees, startDate, endDate, sales: allSales } = data;
  
  const saleStatusItems = [
    {
      name: 'All',
      value: null,
    },
    {
      name: 'Pending',
      value: 'pending',
    },
    {
      name: 'Approved',
      value: 'approved',
    },
    {
      name: 'Declined',
      value: 'declined',
    },
  ];

  const usd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  $: employeeItems = employees.map((employee) => {
    return {
      name: `${employee.firstName} ${employee.lastName}`,
      value: employee.id,
    };
  });
  
  $: campaignItems = campaigns.map((campaign) => {
    return {
      name: campaign.name,
      value: campaign.id,
    };
  });
  
  let selectedEmployeeItem: string;
  let selectedCampaignItem: string;
  let selectedSaleStatusItem: string;
  
  $: sales = selectedEmployeeItem || selectedCampaignItem || selectedSaleStatusItem
    ? allSales.filter((sale) => {
        if (selectedCampaignItem && selectedEmployeeItem && selectedSaleStatusItem) {
          return sale.employee.id == selectedEmployeeItem && sale.campaign.id == selectedCampaignItem && sale.statusDescription == selectedSaleStatusItem;
        } else if (selectedCampaignItem && selectedEmployeeItem) {
          return sale.employee.id == selectedEmployeeItem && sale.campaign.id == selectedCampaignItem;
        } else if (selectedCampaignItem && selectedSaleStatusItem) {
          return sale.campaign.id == selectedCampaignItem && sale.statusDescription == selectedSaleStatusItem;
        } else if (selectedEmployeeItem && selectedSaleStatusItem) {
          return sale.employee.id == selectedEmployeeItem && sale.statusDescription == selectedSaleStatusItem;
        } else if (selectedCampaignItem) {
          return sale.campaign.id == selectedCampaignItem;
        } else if (selectedEmployeeItem) {
          return sale.employee.id == selectedEmployeeItem;
        } else if (selectedSaleStatusItem) {
          return sale.statusDescription == selectedSaleStatusItem;
        }
      })
    : allSales;
    
  const clearFilter = (filter: string) => {
    if (filter === 'employee') {
      selectedEmployeeItem = '';
    }
    
    if (filter === 'campaign') {
      selectedCampaignItem = '';
    }
    
    if (filter === 'saleStatus') {
      selectedSaleStatusItem = '';
    }
  }
  
  startDate = dayjs(startDate).format('YYYY-MM-DD');
  endDate = dayjs(endDate).format('YYYY-MM-DD');
  const inputClass = 'bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
  
  let submitBtn: HTMLButtonElement;
  let campaignName: string;
  
  const getCampaignName = (id: string) => {
    if (campaignName !== undefined) return campaignName;
    campaignName = campaigns.find((campaign) => campaign.id === id)?.name || '';
    return campaignName;
  }
</script>

<Table striped={true} shadow={true} divClass="bg-background-100 dark:bg-background-300">
  {#if !viewOnly}
    <caption class="p-5 text-left bg-background-100 dark:bg-background-300">
      <div class="flex flex-row gap-6 text-sm justify-between">
        <form method="post" action="?/search" class="flex flex-row gap-6 items-center"
          use:enhance={({ cancel }) => {
            
            return ({ result, update }) => {
              if (result.status !== 200) return;
              
              const { startDate, endDate, sales } = result.data;
              
              allSales = [...sales];
            }
          }}
        >
          <div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
            <Label class="block mb-2">Start Date</Label>
            <!-- <Datepicker datepickerButtons bind:value={startDate} datepickerTitle="Start Date" on:change={() => submitBtn.click()} /> -->
            <input type="date" name="start" id="start" bind:value={startDate} class={inputClass} on:change={() => submitBtn.click()} />
          </div>
          
          <p>to</p>
          
          <div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
            <Label class="block mb-2">End Date</Label>
            <!-- <Datepicker datepickerButtons bind:value={endDate} datepickerTitle="End Date" on:change={() => submitBtn.click()} /> -->
            <input type="date" name="end" id="end" bind:value={endDate} on:change={() => submitBtn.click()} class={inputClass} />
          </div>
          <button type="submit" bind:this={submitBtn} class="hidden"></button>
        </form>
        
        <div class="flex flex-row justify-center gap-4">
          <div>
            <Button href="/app/sales/add" class="!p-2">
              <span class="sr-only">New</span>
              <PlusIcon class="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
      
      <div class="flex flex-row gap-5 text-sm">
        <div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
          <Label class="block mb-2 pt-4">
            <span>
              Employee
              {#if selectedEmployeeItem}
                <Button color="alternative" pill={true} class="!p-2" size="xs" on:click={() => clearFilter('employee')}>
                  <CloseSolid class="w-2 h-2" />
                </Button>
              {/if}
            </span>
            <Select class="mt-2" items={employeeItems} bind:value={selectedEmployeeItem} />
          </Label>
        </div>
        
        <div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
          <Label class="block mb-2 pt-4">
            Campaign
            {#if selectedCampaignItem}
              <Button color="alternative" pill={true} class="!p-2" size="xs" on:click={() => clearFilter('campaign')}>
                <CloseSolid class="w-2 h-2" />
              </Button>
            {/if}
            <Select class="mt-2" items={campaignItems} bind:value={selectedCampaignItem} />
          </Label>
        </div>
        
        <div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
          <Label class="block mb-2 pt-4">
            Status
            {#if selectedSaleStatusItem}
              <Button color="alternative" pill={true} class="!p-2" size="xs" on:click={() => clearFilter('saleStatus')}>
                <CloseSolid class="w-2 h-2" />
              </Button>
            {/if}
            <Select class="mt-2" items={saleStatusItems} bind:value={selectedSaleStatusItem} />
          </Label>
        </div>
      </div>
    </caption>
  {/if}
  <TableHead class="text-sm text-background-800 font-semibold">
    <TableHeadCell>Sale Date</TableHeadCell>
    <TableHeadCell>Employee</TableHeadCell>
    {#if !viewOnly}
      <TableHeadCell>Campaign</TableHeadCell>
    {/if}
    <TableHeadCell>Customer</TableHeadCell>
    <TableHeadCell>Address</TableHeadCell>
    <TableHeadCell>Status</TableHeadCell>
    <TableHeadCell>Amount</TableHeadCell>
    {#if !viewOnly}
      <TableHeadCell>
        <span class="sr-only">Edit</span>
      </TableHeadCell>
    {/if}
  </TableHead>
  
  <TableBody tableBodyClass="divide-y">
    {#each sales as sale (sale.id)}
      <TableBodyRow>
        <TableBodyCell>{formatDate(sale.saleDate * 1000)}</TableBodyCell>
        <TableBodyCell>{sale?.employee?.firstName} {sale?.employee?.lastName}</TableBodyCell>
        {#if !viewOnly}
          <TableBodyCell>{getCampaignName(sale.campaignId)}</TableBodyCell>
        {/if}
        <TableBodyCell>{sale.customerFirstName} {sale.customerLastName}</TableBodyCell>
        <TableBodyCell>{sale.customerAddress}</TableBodyCell>
        <TableBodyCell>{sale.statusDescription}</TableBodyCell>
        <TableBodyCell>{usd.format(sale.saleAmount)}</TableBodyCell>
        {#if !viewOnly}
          <TableBodyCell>
            <Button href={`/app/sales/${sale.id}`} class="!p-2">
              <span class="sr-only">Edit</span>
              <PenIcon class="w-3 h-3" />
            </Button>
          </TableBodyCell>
        {/if}
      </TableBodyRow>
    {/each}
  </TableBody>
</Table>