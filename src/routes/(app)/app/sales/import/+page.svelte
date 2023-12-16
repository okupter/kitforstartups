<script lang="ts">
	import { enhance } from '$app/forms';
	import { createToast } from '$lib/components/Toast.svelte';
	import { Button, Breadcrumb, BreadcrumbItem, Label, Fileupload, Table, TableBody, TableBodyRow, TableBodyCell, TableHead, TableHeadCell } from 'flowbite-svelte';
	import type { PageData } from './$types';

  export let data: PageData;
  
  console.dir(data);
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
  
  <div class="flex flex-col pt-4 pb-6 px-1">
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
    
    <form action="?/import" method="post"
      use:enhance={({ formElement, formData, action, cancel, submitter }) => {
        
        // console.log(Object.fromEntries(formData.entries()));
        // cancel();
          
        return async ({ result, update }) => {
          console.dir(result);
          
          if (result.status != 200) return;
          
          createToast({
            title: 'Success!',
            description: 'Sale saved successfully!',
            type: 'success',
          });
          
          update();
        }
      }}
    >
      <div class="pb-4">
        <Label for="file" class="block mb-2">Upload CSV File</Label>
        <Fileupload id="file" name="file" accept=".csv,.xls,.xlsx" enctype="multipart/form-data" />
      </div>
      
      <div class="pb-4">
        <Button type="submit" pill color="primary" size="sm">Import</Button>
      </div>
    </form>
  </div>
</div>