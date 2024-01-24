<script lang="ts">
	import { Button, Input, Label, Modal, Select } from 'flowbite-svelte';
	import { getEmployeeOptions, getManualOverrides, getSelectedEmployee } from './context';
	import { enhance } from '$app/forms';
	import { onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import { nanoid } from 'nanoid';

  export let open = false;
  export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'xs';
  
  const unsubs = [] as Unsubscriber[];
  const employees = getEmployeeOptions();
  const targetEmployeeId = getSelectedEmployee();
  const overrides = getManualOverrides();
  
  const setManualOverride = (pendingManualOverride: any) => {
    const unsub = employees.subscribe(ees => {
      const ee = ees.find(e => e.value == pendingManualOverride.originatingEmployeeId);
      const names = ee?.name.split(' ') as string[];
      const mapped = {
        ...pendingManualOverride,
        id: nanoid(),
        isManual: true,
        sale: {
          employee: {
            firstName: names[0],
            lastName: names[1],
          },
        },
      };
      overrides.update(o => [...o, mapped]);
      open = false;
    });
    unsubs.push(unsub);
  }
  
  onDestroy(() => unsubs.forEach(unsub => unsub()));
</script>

<Modal bind:open bind:size={size} autoclose={false} class="w-full">
  <form action="?/add-manual-override" class="flex flex-col" method="post"
    use:enhance={({ formData, cancel }) => {
      const pendingManualOverride = Object.fromEntries(formData.entries());
      setManualOverride(pendingManualOverride);
      cancel();
      return ({ result, update }) => {}
    }}
  >
    <h3 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Add a manual override</h3>
    <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      Manual overrides do not get associated with employee sales and should only be used in special circumstances.
    </p>
    <div class="flex flex-col space-y-6">
      <Label class="space-y-2">
        <span>Sales Agent</span>
        <Select items={$employees} placeholder="Select Employee" name="originatingEmployeeId" required />
      </Label>
      
      <Label class="space-y-2">
        <span>Amount</span>
        <Input type="text" name="overrideAmount" />
      </Label>
      
      <div class="flex justify-between mb-2">
        <Button type="button" color="alternative" on:click={() => open = false}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </div>
    <input type="hidden" name="beneficiaryEmployeeId" bind:value={$targetEmployeeId} />
  </form>
</Modal>