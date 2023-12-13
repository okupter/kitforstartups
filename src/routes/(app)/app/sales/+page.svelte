<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Button, ButtonGroup, Checkbox, Datepicker, InputAddon, Label, Select, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Toggle } from 'flowbite-svelte';
	import { PenIcon, PlusIcon } from 'lucide-svelte';
  import { formatDate } from '$lib/utils';
  import dayjs from 'dayjs';
	import { CloseCircleSolid, CloseSolid } from 'flowbite-svelte-icons';
  
  export let data;
  
  const { campaigns, employees, startDate, endDate, sales: allSales } = data;
  
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
  
  const handleEmployeeChange = () => {
    console.dir(selectedEmployeeItem);
  }
  
  const handleCampaignChange = () => {
    console.dir(selectedCampaignItem);
  }
  
  $: sales = selectedEmployeeItem || selectedCampaignItem
    ? allSales.filter((sale) => {
        if (selectedCampaignItem && selectedEmployeeItem) {
          return sale.employee.id == selectedEmployeeItem && sale.campaign.id == selectedCampaignItem;
        }
      
        if (selectedEmployeeItem) {
          return sale.employee.id == selectedEmployeeItem;
        }
  
        if (selectedCampaignItem) {
          return sale.campaign.id == selectedCampaignItem;
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
  }
</script>

<div class="container max-w-3xl p-4">
  <div class="pb-8">
    <h4>Sales</h4>
    <p>
      Search for sales here by agent, campaign, dates, etc. You can also add a new sale 
      <Button href="/app/sales/add" pill color="light" size="sm">Add Sale</Button>
      or import numerous sales 
      <Button href="/app/sales/import" pill color="light" size="sm">Import Sales</Button>.
    </p>
  </div>
  
  <div class="pb-4">
    <Breadcrumb>
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem>Sales</BreadcrumbItem>
    </Breadcrumb>
  </div>
  
  <div class="flex flex-col pt-4">
    <div class="py-6 px-1">
      <Table striped={true} shadow={true} divClass="bg-background-100 dark:bg-background-300">
        <caption class="p-5 text-left bg-background-100 dark:bg-background-300">
          <div class="flex flex-row gap-6 text-sm justify-between">
            <div class="flex flex-row gap-6 items-center">
              <div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
                <Label class="block mb-2">Start Date</Label>
                <Datepicker datepickerButtons value={dayjs(startDate).format('MM/DD/YYYY')} datepickerTitle="Start Date" />
              </div>
              
              <p>to</p>
              
              <div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
                <Label class="block mb-2">End Date</Label>
                <Datepicker datepickerButtons value={dayjs(endDate).format('MM/DD/YYYY')} datepickerTitle="End Date" />
              </div>
            </div>
            
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
                <Select class="mt-2" items={employeeItems} bind:value={selectedEmployeeItem} on:change={handleEmployeeChange} />
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
                <Select class="mt-2" items={campaignItems} bind:value={selectedCampaignItem} on:change={handleCampaignChange} />
              </Label>
            </div>
          </div>
        </caption>
        <TableHead class="text-sm text-background-800 font-semibold">
          <TableHeadCell>Sale Date</TableHeadCell>
          <TableHeadCell>Employee</TableHeadCell>
          <TableHeadCell>Campaign</TableHeadCell>
          <TableHeadCell>Customer</TableHeadCell>
          <TableHeadCell>Address</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
          <TableHeadCell>Amount</TableHeadCell>
          <TableHeadCell>
            <span class="sr-only">Edit</span>
          </TableHeadCell>
        </TableHead>
        
        <TableBody tableBodyClass="divide-y">
          {#each sales as sale (sale.id)}
            <TableBodyRow>
              <TableBodyCell>{formatDate(sale.saleDate * 1000)}</TableBodyCell>
              <TableBodyCell>{sale.employee?.firstName} {sale.employee?.lastName}</TableBodyCell>
              <TableBodyCell>{sale.campaign.name}</TableBodyCell>
              <TableBodyCell>{sale.customerFirstName} {sale.customerLastName}</TableBodyCell>
              <TableBodyCell>{sale.customerAddress}</TableBodyCell>
              <TableBodyCell>{sale.statusDescription}</TableBodyCell>
              <TableBodyCell>{usd.format(sale.saleAmount)}</TableBodyCell>
              <TableBodyCell>
                <Button href={`/app/sales/${sale.id}`} class="!p-2">
                  <span class="sr-only">Edit</span>
                  <PenIcon class="w-3 h-3" />
                </Button>
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    </div>
  </div>
</div>

