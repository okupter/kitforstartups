<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Heading, P, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import { Section } from 'flowbite-svelte-blocks';
  import dayjs from 'dayjs';
  
  export let data;
  const { cycleAndPaystubs } = data;
  const cycle = cycleAndPaystubs?.cycle;
  const paystubs = cycleAndPaystubs?.paystubs || [];
  
  const formatDate = (date: any) => dayjs(Number(date)).format('MMMM D, YYYY');
  
  console.log(cycle);
</script>

<div class="container max-w-5xl">
  <div class="flex">
    <div>
      <h4 class="mb-2">Populate Payroll Cycle</h4>
      <p class="mb-4">
        Create paystubs for employees and add them to the payroll cycle, or 
        simply select existing paystubs that have not been paid yet.
      </p>
    </div>
  </div>
  <!-- <div class="pb-8">
    <h4>Populate Payroll Cycle</h4>
    <p>
      Create paystubs for employees and add them to the payroll cycle, or 
      simply select existing paystubs that have not been paid yet. 
    </p>
  </div> -->
  
  <div class="pb-4">
    <Breadcrumb>
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem href="/app/payroll-cycles">Payroll Cycles</BreadcrumbItem>
      <BreadcrumbItem>Payroll Cycle (Pay Date: {formatDate(cycle?.paymentDate)})</BreadcrumbItem>
    </Breadcrumb>
  </div>
  
  <div class="flex flex-col pt-4">
    <div class="w-full p-6 bg-background-100 border border-background-100 shadow-md rounded-md">
      <h5 class="mb-2">Current Payroll Cycle</h5>
      <!-- <P class="mb-4 leading-none md:text-2xl">{formatDate(Number(cycle?.paymentDate))}</P> -->
      <div class="flex flex-row gap-6">
        <div>
          <div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
            Payment Date
          </div>
          <div class="mb-4 font-light text-neutral-500 dark:text-neutral-300">
            {formatDate(Number(cycle?.paymentDate))}
          </div>
        </div>
        
        <div>
          <div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
            Start Date
          </div>
          <div class="mb-4 font-light text-neutral-500 dark:text-neutral-300">
            {formatDate(Number(cycle?.startDate))}
          </div>
        </div>
        
        <div>
          <div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
            End Date
          </div>
          <div class="mb-4 font-light text-neutral-500 dark:text-neutral-300">
            {formatDate(Number(cycle?.endDate))}
          </div>
        </div>
      </div>
    </div>
    
    <div class="py-6 px-1">
      <Table striped={true} shadow={true} divClass="bg-background-100 dark:bg-background-300">
        <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          Our products
          <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Browse a list of Flowbite products designed to help you work and play, stay organized, get answers, keep in touch, grow your business, and more.</p>
        </caption>
        <TableHead class="text-sm text-primary-700 font-semibold">
          <TableHeadCell>Employee</TableHeadCell>
          <TableHeadCell>Campaign</TableHeadCell>
          <TableHeadCell>Total</TableHeadCell>
          <TableHeadCell>Payroll Cycle</TableHeadCell>
          <TableHeadCell>
            <span class="sr-only">Edit</span>
          </TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#each paystubs as item (item.id)}
            <TableBodyRow>
              <TableBodyCell>{item.employee.firstName} {item.employee.lastName}</TableBodyCell>
              <TableBodyCell>&nbsp;</TableBodyCell>
              <TableBodyCell>&nbsp;</TableBodyCell>
              <TableBodyCell>&nbsp;</TableBodyCell>
              <TableBodyCell>Edit</TableBodyCell>
            </TableBodyRow>
          {/each}
          {#if paystubs.length < 1}
            <TableBodyRow>
              <TableBodyCell colspan="5" class="text-center">
                No paystubs found.
              </TableBodyCell>
            </TableBodyRow>
          {/if}
        </TableBody>
      </Table>
    </div>
  </div>
</div>