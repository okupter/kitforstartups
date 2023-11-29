<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Button } from 'flowbite-svelte';

  
</script>

<div class="pb-8">
  <h4>New Sale</h4>
  <p>
    Add a new sale for an employee. Head over to 
    <Button href="/app/sales/import" pill color="light" size="sm">Import Sales</Button>
    if you have numerous sales to import.
  </p>
</div>

<div class="pb-4">
  <Breadcrumb>
    <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
    <BreadcrumbItem href="/app/sales">Sales</BreadcrumbItem>
    <BreadcrumbItem>New Sale</BreadcrumbItem>
  </Breadcrumb>
</div>

