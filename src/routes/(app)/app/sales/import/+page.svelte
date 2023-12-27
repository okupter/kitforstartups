<script lang="ts">
	import { enhance } from '$app/forms';
	import { createToast } from '$lib/components/Toast.svelte';
	import { Button, Breadcrumb, BreadcrumbItem, Label, Fileupload, Table, TableBody, TableBodyRow, TableBodyCell, TableHead, TableHeadCell, Select } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { read, utils } from 'xlsx';
  import type { ImportSalesResult } from '$lib/types/sale.model';
	import type { ActionResult } from '@sveltejs/kit';
	import type { InsertSale } from '$lib/types/db.model';
	import { formatCurrency, formatDate } from '$lib/utils';

  export let data: PageData;
  const { campaigns, employees } = data;
  
  let baddies = [] as { property: string, sales: InsertSale[], }[];
  $: reconcileBadSales = baddies?.length > 0;
  
  const handleSuccessfulImport = async (result: ActionResult<Record<string, unknown> | undefined, Record<string, unknown> | undefined>, update: (options?: {
    reset: boolean;
} | undefined) => Promise<void>) => {
    console.dir(result);
          
    if (result.status != 200) return;
    const payload = (result as any).data as ImportSalesResult;
    
    if (payload?.good.length > 0 && payload?.bad.length < 1) {
      createToast({
        title: 'Success!',
        description: `Imported ${(payload?.good?.length || 0)} sales successfully!`,
        type: result.type as "success" | "error" | "warning" | "info",
      });
    }
    
    if (Object.keys(payload?.bad).length > 0) {
      const { bad } = payload;
      
      // do something here to show the bad sales grouped by each sale
      baddies = [...bad];
    }
    
    update();
  }
</script>

<div class={reconcileBadSales ? 'container p-4 max-w-4xl' : 'container p-4 max-w-3xl'}>
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
  
  <div class="flex flex-col pt-4 pb-6 px-1">
    {#if reconcileBadSales}
      <section>
        <h5>Unassigned Sales</h5>
        <p>
          There are {baddies.length} sets of sales that need to be assigned to an employee. Select the apporpriate employee for each set of sales, 
          then click the save button to assign the sales to the employee. If the employee is not available in the list, you will need to make sure that the 
          employee is active and has a sales code for the campaign from the <a href="/app/employee">Employees</a> page.
        </p>
        
        <div class="p-4">
          <Table>
            <TableHead>
              <TableHeadCell>Date</TableHeadCell>
              <TableHeadCell>Customer Name</TableHeadCell>
              <TableHeadCell>Address</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Amount</TableHeadCell>
            </TableHead>
            <TableBody>
              {#each baddies as { property, sales } (property)}
                <TableBodyRow>
                  <TableBodyCell colspan="2">
                    <h6 class="font-bold text-lg">{property}</h6>
                  </TableBodyCell>
                  <TableBodyCell colspan="3">
                    <form action="?/attach-sales-code" method="post" class="flex justify-between">
                      <Label class="sr-only">
                        Select Employee to assign sales code
                      </Label>
                      <Select size="sm" name="employee_id" items={employees}
                          placeholder="Select Employee"
                          required></Select>
                      <div class="flex justify-center items-center p-2">
                        <Button type="submit" size="sm">Save</Button>
                      </div>
                    </form>
                  </TableBodyCell>
                </TableBodyRow>
                
                {#each sales as sale (sale.id)}
                  <TableBodyRow>
                    <TableBodyCell>{formatDate(sale.saleDate * 1000)}</TableBodyCell>
                    <TableBodyCell>{sale.customerFirstName} {sale.customerLastName}</TableBodyCell>
                    <TableBodyCell>{sale.customerAddress}</TableBodyCell>
                    <TableBodyCell>{sale.statusDescription}</TableBodyCell>
                    <TableBodyCell>{formatCurrency(sale.saleAmount)}</TableBodyCell>
                  </TableBodyRow>
                {/each}
              {/each}
            </TableBody>
          </Table>
        </div>
      </section>
    {:else}
      <section>
        <h5>Instructions</h5>
        <p>To import sales, you need to have a CSV, XLS, or XLSX file with the following columns:</p>
        
        <div class="p-4">
          <Table>
            <TableHead>
              <TableHeadCell>Column</TableHeadCell>
              <TableBodyCell>Description</TableBodyCell>
            </TableHead>
            <TableBody>
              <TableBodyRow>
                <TableBodyCell>sale_date</TableBodyCell>
                <TableBodyCell>The date of the sale</TableBodyCell>
              </TableBodyRow>
              <TableBodyRow>
                <TableBodyCell>sales_code</TableBodyCell>
                <TableBodyCell>Employee's sale code for the given campaign</TableBodyCell>
              </TableBodyRow>
              <TableBodyRow>
                <TableBodyCell>customer_name</TableBodyCell>
                <TableBodyCell>The name of the customer</TableBodyCell>
              </TableBodyRow>
              <TableBodyRow>
                <TableBodyCell>address</TableBodyCell>
                <TableBodyCell>The address of the customer</TableBodyCell>
              </TableBodyRow>
              <TableBodyRow>
                <TableBodyCell>commissionable</TableBodyCell>
                <TableBodyCell>The status of the sale (Accepted, Pending Enrollment, Rejected)</TableBodyCell>
              </TableBodyRow>
              <TableBodyRow>
                <TableBodyCell>amount</TableBodyCell>
                <TableBodyCell>The amount of the sale</TableBodyCell>
              </TableBodyRow>
            </TableBody>
          </Table>
        </div>
        
        <div class="pt-2">
          <p class="mb-4">
            The file should be in the format below for easiest ingestion:
          </p>
          
          <pre>
            sale_date, sales_code, customer_name, address, commissionable, amount
            2021-01-01, 1234, John Doe, 123 Main St, Accepted, 100
            2021-01-01, 1234, John Doe, 123 Main St, Pending Enrollment, 100
            2021-01-01, 1234, John Doe, 123 Main St, Rejected, 100
          </pre>
        </div>
        
        <div class="pt-2">
          <p class="text-sm">
            Note: The column names should be exactly as shown above. The order of the columns does not matter. If you cannot provide all the columns, 
            the import will build out a review table with as much information as possible but you will be required to fill in the missing information. 
            
            If headers do not match, you will be prompted to map the headers to the correct columns.
          </p>
        </div>
      </section>
      
      <form action="?/import" method="post" class="mt-4"
        use:enhance={async () => async ({ result, update }) => handleSuccessfulImport(result, update) }
      >
        <div class="pb-4">
          <Label for="file" class="block mb-2">Upload CSV File</Label>
          <Fileupload id="file" name="file" accept=".csv,.xls,.xlsx" enctype="multipart/form-data" />
        </div>
        
        <div class="pb-4">
          <Label class="block mb-2">
            Campaign
            <Select class="mt-2" name="campaign_id" items={campaigns} required></Select>
          </Label>
        </div>
        
        <div class="pb-4">
          <Button type="submit" pill color="primary" size="sm">Import</Button>
        </div>
      </form>
    {/if}
    
  </div>
</div>