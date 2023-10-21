<script lang="ts">
	import AddEmployeeDialog from '$lib/components/AddEmployeeDialog.svelte';
	import EmployeeCard from '$lib/components/EmployeeCard.svelte';
	import type { Employee } from '$lib/types/db.model';

  
  export let data: {
    employees: Employee[];
  }
  
  console.log(data)
</script>

<div class="pb-4">
  <AddEmployeeDialog />
</div>

<div class="flex gap-4 mt-8">
  {#each data?.employees as employee}
     <!-- content here -->
     <EmployeeCard employee={employee} />
  {/each}
</div>