<script lang="ts">
	import { Button, Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';

  
</script>

<div class="container max-w-3xl p-4">
  <div class="pb-8">
    <h4>Import Sales</h4>
    <p>
      Import multiple sales here. Head over to 
      <Button href="/app/sales/add" pill color="light" size="sm">Add Sale</Button>
      if you'd like to add a single sale.
    </p>
  </div>
  
  <div class="pb-4">
    <Breadcrumb>
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem href="/app/sales">Sales</BreadcrumbItem>
      <BreadcrumbItem>Import Sales</BreadcrumbItem>
    </Breadcrumb>
  </div>
  
  
</div>