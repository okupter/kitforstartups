<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SelectSale, SelectSaleOverride } from '$lib/types/db.model';
	import type { PaystubWith } from '$lib/types/paystbus.model';
	import { formatCurrency, formatDate } from '$lib/utils';
	import { Breadcrumb, BreadcrumbItem, Card, Label, Select, Input, Table, TableHead, TableHeadCell, TableBody, TableBodyCell, TableBodyRow, Button } from 'flowbite-svelte';

  export let data;
  const { campaigns, employees, startDate, endDate, } = data;
  
  let paystubs = [] as PaystubWith[];
  
  let submitBtn: HTMLButtonElement;
  let selectedEmployee = '';
  let selectedCampaign = '';
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
  
  <form action="?/search" method="post" class="grid grid-cols-4 pt-4 gap-2"
    use:enhance={({ cancel }) => {
      
      return ({ result, update }) => {
        if (!result.data) return;
        
        paystubs = [...result.data.paystubs];
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
          <Select name="employeeId" items={employees} bind:value={selectedEmployee} on:change={() => submitBtn.click()} />
        </Label>
      </div>
    </Card>
    
    <Card class="w-full max-w-md">
      <div class="flex flex-col space-y-6">
        <Label class="space-y-2">
          <span>Campaign</span>
          <Select name="campaignId" items={campaigns} bind:value={selectedCampaign} on:change={() => submitBtn.click()} />
        </Label>
      </div>
    </Card>
    <button type="submit" bind:this={submitBtn} class="hidden"></button>
  </form>
  
  <Table class="my-6 space-y-6 rounded-lg">
    <TableHead>
      <TableHeadCell>Employee</TableHeadCell>
      <TableHeadCell>Campaign</TableHeadCell>
      <TableHeadCell>Sales</TableHeadCell>
      <TableHeadCell>Total</TableHeadCell>
      <TableHeadCell>Payment Date</TableHeadCell>
    </TableHead>
    
    <TableBody>
      {#each paystubs as paystub (paystub.id)}
        <TableBodyRow>
          <TableBodyCell>{paystub.employee.firstName} {paystub.employee.lastName}</TableBodyCell>
          <TableBodyCell>{paystub.campaign?.name}</TableBodyCell>
          <TableBodyCell>{paystub.totalSales}</TableBodyCell>
          <TableBodyCell>{formatCurrency(paystub.netPay)}</TableBodyCell>
          {#if paystub.payrollCycle}
            <TableBodyCell>{formatDate(paystub.payrollCycle?.paymentDate)}</TableBodyCell>
          {:else}
            <TableBodyCell>
              <Button type="button" size="xs" color="alternative" outline pill>Add to Cycle</Button>
            </TableBodyCell>
          {/if}
        </TableBodyRow>
      {/each}
      {#if !paystubs.length}
        <TableBodyRow>
          <TableBodyCell colspan="5">No paystubs found.</TableBodyCell>
        </TableBodyRow>
      {/if}
    </TableBody>
  </Table>
</div>