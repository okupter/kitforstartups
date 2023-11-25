<script lang="ts">
	import type { SelectPayrollCycle } from '$lib/types/db.model';
	import { formatDate } from '$lib/utils';
	import { Breadcrumb, BreadcrumbItem, Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { PenIcon } from 'lucide-svelte';

  export let data;
  
  const { payrollCycles } = data;
  
  const cycles = [...(payrollCycles || [])] as (SelectPayrollCycle & { paystubCount: number })[];
</script>

<div class="container max-w-5xl">
  <div class="flex">
    <div>
      <h4 class="mb-2">Payroll Cycles</h4>
      <p class="mb-4">
        Craete a new payroll cycle or edit an existing cycle.
      </p>
    </div>
  </div>
  
  <div class="pb-4">
    <Breadcrumb>
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem>Payroll Cycles</BreadcrumbItem> 
    </Breadcrumb>
  </div>
  
  <div class="flex flex-col pt-4">
    <div class="py-6 px-1">
      <Table striped={true} shadow={true} divClass="bg-background-100 dark:bg-background-300">
        <TableHead class="text-sm text-background-800 font-semibold">
          <TableHeadCell>Payment Date</TableHeadCell>
          <TableHeadCell>Start Date</TableHeadCell>
          <TableHeadCell>End Date</TableHeadCell>
          <TableHeadCell># of Paystubs</TableHeadCell>
          <TableHeadCell>
            <span class="sr-only">Edit</span>
          </TableHeadCell>
        </TableHead>
        
        <TableBody tableBodyClass="divide-y">
          {#each cycles as cycle (cycle.id)}
            <TableBodyRow>
              <TableBodyCell>{formatDate(Number(cycle.paymentDate))}</TableBodyCell>
              <TableBodyCell>{formatDate(Number(cycle.startDate))}</TableBodyCell>
              <TableBodyCell>{formatDate(Number(cycle.endDate))}</TableBodyCell>
              <TableBodyCell>{cycle.paystubCount}</TableBodyCell>
              <TableBodyCell>
                <Button href={`/app/payroll-cycles/${cycle.id}`} class="!p-2">
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