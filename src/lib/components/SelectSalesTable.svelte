<script lang="ts">
	import type { SaleTableInputData } from '$lib/types/sale-table-input-data.model';
	import type { SaleWithEmployee } from '$lib/types/sale.model';
	import { formatDate } from '$lib/utils';
	import dayjs from 'dayjs';
	import { TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, Table, Checkbox } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
	  
  export let data: SaleTableInputData;
  
  // let { startDate, endDate, sales: allSales } = data;

  const usd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  const startDate = dayjs(data.startDate).format('YYYY-MM-DD');
  const endDate = dayjs(data.endDate).format('YYYY-MM-DD');
  
  $: sales = data && data.sales ? data.sales : [];
  
  let selectedSales: SaleWithEmployee[] = [];
  
  const handleCheckboxChange = (e: Event) => {
    const checkbox = e.target as HTMLInputElement;
    const saleId = checkbox.value;
    const sale = sales.find(s => s.id === saleId);
    
    console.log(sale);
    
    selectedSales = (checkbox.checked ? [...selectedSales, sale] : selectedSales.filter(s => s.id !== saleId)) as SaleWithEmployee[];
    
    dispatch('saleSelected', selectedSales);
  };
</script>

<div class="mb-6">
  <h5 class="mb-2">Pending Sales</h5>
  <Table striped={true} shadow={true} divClass="bg-background-100 dark:bg-background-300 max-h-80 overflow-y-scroll">
    <TableHead class="text-sm text-background-800 font-semibold">
      <TableHeadCell>&nbsp;</TableHeadCell>
      <TableHeadCell>Sale Date</TableHeadCell>
      <TableHeadCell>Customer</TableHeadCell>
      <TableHeadCell>Address</TableHeadCell>
      <TableHeadCell>Status</TableHeadCell>
      <TableHeadCell>Amount</TableHeadCell>
    </TableHead>
    
    <TableBody tableBodyClass="divide-y">
      {#each sales as sale (sale.id)}
        <TableBodyRow>
          <TableBodyCell>
            <Checkbox on:change={e => handleCheckboxChange(e)} value={sale.id}></Checkbox>
          </TableBodyCell>
          <TableBodyCell>{formatDate(sale.saleDate * 1000)}</TableBodyCell>
          <TableBodyCell>{sale.customerFirstName} {sale.customerLastName}</TableBodyCell>
          <TableBodyCell>{sale.customerAddress}</TableBodyCell>
          <TableBodyCell>{sale.statusDescription}</TableBodyCell>
          <TableBodyCell>{usd.format(sale.saleAmount)}</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</div>