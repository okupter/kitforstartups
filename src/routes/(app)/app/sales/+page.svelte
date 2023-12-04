<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Button } from 'flowbite-svelte';

  
</script>

<div class="container max-w-3xl p-4">
  <div class="pb-8">
    <h4>Sales</h4>
    <p>
      Search for sales here by agent, campaign, dates, etc. You can also add a new sale 
      <Button href="/app/sales/add" pill color="light" size="sm">Add Sale</Button>
      or import numerous sales 
      <Button href="/app/sales/import" pill color="light" size="sm">Import Sales</Button>.
    </p>
  </div>
  
  <div class="pb-4">
    <Breadcrumb>
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem>Sales</BreadcrumbItem>
    </Breadcrumb>
  </div>
  
  <p>
    put a sales table here or something cool
  </p>
</div>

