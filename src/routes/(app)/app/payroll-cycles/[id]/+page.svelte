<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Button, Heading, P, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import { Section } from 'flowbite-svelte-blocks';
  import { PlusOutline, ThumbsUpSolid } from 'flowbite-svelte-icons';
  import dayjs from 'dayjs';
	import { PlusCircleIcon } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import type { SelectPaystub } from '$lib/types/db.model';
	import { createToast } from '$lib/components/Toast.svelte';
  
  export let data;
  const { cycleAndPaystubs } = data;
  const cycle = cycleAndPaystubs?.cycle;
  const paystubs = cycleAndPaystubs?.paystubs || [];
  
  const formatDate = (date: any) => dayjs(Number(date)).format('MMMM D, YYYY');
  const formatCurrency = (amount: any) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  
  console.log(cycle);
  
  const detachPayrollCycle = async (paystub: SelectPaystub) => {
    const result = await fetch('/api/paystubs/detach-payroll-cycle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: paystub.id,
        clientId: paystub.clientId,
      }),
    });
    
    if (result.status != 200) {
      console.log('Error detaching payroll cycle');
      return;
    }
    
    paystub.payrollCycleId = null;
    
    createToast({
      title: 'Removed',
      description: 'Paystub removed from payroll cycle.',
      type: 'success',
    });
  }
</script>

<div class="container max-w-5xl">
  <div class="flex">
    <div>
      <h4 class="mb-2">Populate Payroll Cycle</h4>
      <p class="mb-4">
        Create paystubs for employees and add them to the payroll cycle, or 
        simply select existing paystubs that have not been paid yet.
      </p>
    </div>
  </div>
  <!-- <div class="pb-8">
    <h4>Populate Payroll Cycle</h4>
    <p>
      Create paystubs for employees and add them to the payroll cycle, or 
      simply select existing paystubs that have not been paid yet. 
    </p>
  </div> -->
  
  <div class="pb-4">
    <Breadcrumb>
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem href="/app/payroll-cycles">Payroll Cycles</BreadcrumbItem>
      <BreadcrumbItem>Payroll Cycle (Pay Date: {formatDate(cycle?.paymentDate)})</BreadcrumbItem>
    </Breadcrumb>
  </div>
  
  <div class="flex flex-col pt-4">
    
    <div class="py-6 px-1">
      <Table striped={true} shadow={true} divClass="bg-background-100 dark:bg-background-300">
        <caption class="p-5 text-lg font-semibold text-left bg-background-100 dark:bg-background-300">
          <h5 class="mb-2 text-background-950 dark:text-background-900">Current Payroll Cycle</h5>
          <div class="flex flex-row gap-6 text-sm">
            <div>
              <div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
                Payment Date
              </div>
              <div class="mb-4 font-light text-neutral-500 dark:text-neutral-300">
                {formatDate(Number(cycle?.paymentDate))}
              </div>
            </div>
            
            <div>
              <div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
                Start Date
              </div>
              <div class="mb-4 font-light text-neutral-500 dark:text-neutral-300">
                {formatDate(Number(cycle?.startDate))}
              </div>
            </div>
            
            <div>
              <div class="mb-2 font-semibold leading-none text-neutral-900 dark:text-neutral-200">
                End Date
              </div>
              <div class="mb-4 font-light text-neutral-500 dark:text-neutral-300">
                {formatDate(Number(cycle?.endDate))}
              </div>
            </div>
          </div>
          <!-- <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Browse a list of Flowbite products designed to help you work and play, stay organized, get answers, keep in touch, grow your business, and more.</p> -->
        </caption>
        <TableHead class="text-sm text-background-800 font-semibold">
          <TableHeadCell>Employee</TableHeadCell>
          <TableHeadCell>Campaign</TableHeadCell>
          <TableHeadCell>Total</TableHeadCell>
          <TableHeadCell>Payroll Cycle</TableHeadCell>
          <TableHeadCell>
            <span class="sr-only">Edit</span>
          </TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#each paystubs as item (item.id)}
            <TableBodyRow>
              <TableBodyCell>{item.employee.firstName} {item.employee.lastName}</TableBodyCell>
              <TableBodyCell>{item.campaign.name}</TableBodyCell>
              <TableBodyCell>{formatCurrency(item.netPay)}</TableBodyCell>
              <TableBodyCell>
                {#if item.payrollCycle != null}
                  {formatDate(item.payrollCycle?.paymentDate)}
                {:else}
                  <span class="italic text-neutral-400">Unassigned</span>
                {/if}
              </TableBodyCell>
              <TableBodyCell>
                <div class="flex justify-around">
                  <form action="?/attach-payroll-cycle" method="post"
                    use:enhance={({ formData, cancel }) => {
                      
                      return async ({ result, update }) => {
                        if (result.status != 200 || !result.data) return;
                        
                        item.payrollCycleId = `${cycle?.id}`;
                        update();
                      }
                    }}
                  >
                    <input type="hidden" name="paystubId" value={item?.id} />
                    <input type="hidden" name="payrollCycleId" value={cycle?.id} />
                    {#if item.payrollCycleId == null}
                      <Button type="submit" pill={true} outline={true} class="!p-2" size="lg">
                        <PlusOutline class="w-3 h-3" />
                      </Button>
                    {:else}
                      <!-- <Button href={'/app/paystubs/' + item.id} pill={true} outline={true}>
                        Edit
                      </Button> -->
                      <Button on:click={() => detachPayrollCycle(item)} pill={true} outline={true} color="red">
                        Remove
                      </Button>
                    {/if}
                  </form>
                </div>
              </TableBodyCell>
            </TableBodyRow>
          {/each}
          {#if paystubs.length < 1}
            <TableBodyRow>
              <TableBodyCell colspan="5" class="text-center">
                No paystubs found.
              </TableBodyCell>
            </TableBodyRow>
          {/if}
        </TableBody>
      </Table>
    </div>
  </div>
</div>