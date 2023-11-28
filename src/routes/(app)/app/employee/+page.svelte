<script lang="ts">
	import AddEmployeeDialog from '$lib/components/AddEmployeeDialog.svelte';
	import EmployeeCard from '$lib/components/EmployeeCard.svelte';
	import type { Employee } from '$lib/types/db.model';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';

  
  export let data: {
    employees: Employee[];
  }
</script>

<div class="pb-4">
  <Breadcrumb aria-label="Breadcrumb">
    <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
    <BreadcrumbItem>Employees</BreadcrumbItem>
  </Breadcrumb>
</div>

<div class="pb-4">
  <AddEmployeeDialog />
</div>

<div class="flex gap-4 mt-8">
  {#each data?.employees as employee}
     <!-- content here -->
     <EmployeeCard employee={employee} />
  {/each}
</div>