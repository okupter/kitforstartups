<script lang="ts">
	import type { SelectEmployee, SelectSale, SelectSaleOverride } from '$lib/types/db.model';
	import { formatDate } from '$lib/utils';
	import { TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, Table, Checkbox, Button } from 'flowbite-svelte';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import AddOverrideModal from './AddOverrideModal.svelte';
	import { getManualOverrides } from './context';
	import type { OverrideTableInputData } from '$lib/types/override-table-input-data.model';
  const dispatch = createEventDispatcher();
	  
  export let data: OverrideTableInputData;
  
  const manualOverrides = getManualOverrides();
  
  const unsub = manualOverrides.subscribe(mo => {
    if (mo && mo.length) overrides = [...overrides, ...(mo as any[])];
  });
  
  $: overrides = data && data.overrides ? data.overrides : [];
  
  onDestroy(() => unsub());

  const usd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  let selected: SelectSaleOverride[] = [];
  
  const handleCheckboxChange = (e: Event) => {
    const checkbox = e.target as HTMLInputElement;
    const overrideId = checkbox.value;
    const override = overrides.find(o => o.id === overrideId);
    
    selected = (checkbox.checked ? [...selected, override] : selected.filter(s => s.id !== overrideId)) as SelectSaleOverride[];
    
    dispatch('overrideSelected', selected);
  };
  
  const selectAll = () => {
    overrides = overrides.map(o => {
      if (!o.isManual) o.checked = !o.checked;
      return o;
    });
  }
  
  let openAddOverrideModal = false;
</script>

<div class="mb-6">
  <div class="flex justify-between">
    <h5 class="mb-2">Pending Overrides</h5>
    <div class="p-2">
      <Button type="button" on:click={() => openAddOverrideModal = !openAddOverrideModal} size="sm">Add Manual Override</Button>
    </div>
    <AddOverrideModal bind:open={openAddOverrideModal}></AddOverrideModal>
  </div>
  <Table striped={true} shadow={true} divClass="bg-background-100 dark:bg-background-300 max-h-80 overflow-y-auto">
    <TableHead class="text-sm text-background-800 font-semibold">
      <TableHeadCell>
        <Checkbox on:change={() => selectAll()}></Checkbox>
      </TableHeadCell>
      <TableHeadCell>Sale Date</TableHeadCell>
      <TableHeadCell>Employee</TableHeadCell>
      <TableHeadCell>Amount</TableHeadCell>
    </TableHead>
    
    <TableBody tableBodyClass="divide-y">
      {#each overrides as over (over.id)}
        <TableBodyRow>
          <TableBodyCell>
            <Checkbox on:change={e => handleCheckboxChange(e)} value={over?.id} checked={over.isManual || over.checked} disabled={over.isManual}></Checkbox>
          </TableBodyCell>
          <TableBodyCell>{over?.sale?.saleDate ? formatDate(over?.sale?.saleDate * 1000) : '(manual)'}</TableBodyCell>
          <TableBodyCell>{over?.sale?.employee?.firstName} {over?.sale?.employee?.lastName}</TableBodyCell>
          <TableBodyCell>{usd.format(over?.overrideAmount)}</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</div>