<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Button, Checkbox, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Toggle } from 'flowbite-svelte';
	import { PenIcon, PlusIcon } from 'lucide-svelte';
  import { formatDate } from '$lib/utils';
  
  export let data;
  
  const { campaigns, employees, startDate, endDate, sales } = data;
  
  console.log(sales);
  let showClosed = false;
  
  const usd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
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
            <div class="flex flex-row gap-6">
              <div>
                <div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
                  <Toggle checked={showClosed} on:change={() => showClosed = !showClosed}>
                    Show Closed Payroll Cycles
                  </Toggle>
                </div>
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
        </caption>
        <TableHead class="text-sm text-background-800 font-semibold">
          <TableHeadCell>Sale Date</TableHeadCell>
          <TableHeadCell>First Name</TableHeadCell>
          <TableHeadCell>Last Name</TableHeadCell>
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
              <TableBodyCell>{sale.customerFirstName}</TableBodyCell>
              <TableBodyCell>{sale.customerLastName}</TableBodyCell>
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

