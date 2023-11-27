<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Button, GradientButton, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Tooltip } from 'flowbite-svelte';
  import { ArrowRightOutline, CheckCircleOutline, PlusOutline, RedoOutline, ThumbsUpSolid } from 'flowbite-svelte-icons';
	import { enhance } from '$app/forms';
	import type { SelectPayrollCycle } from '$lib/types/db.model';
	import { createToast } from '$lib/components/Toast.svelte';
	import { writable } from 'svelte/store';
	import type { PaystubWith } from '$lib/types/paystbus.model';
	import { formatCurrency, formatDate } from '$lib/utils';
  
  export let data;
  let { cycleAndPaystubs: { paystubs, cycle } } = data;
  const paystubs$ = writable(paystubs);
  let isEditing = true;
  
  const detachPayrollCycle = async (paystub: PaystubWith) => {
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
    
    paystub.payrollCycle = null as unknown as SelectPayrollCycle;
    paystub.payrollCycleId = null;
    paystubs = [...paystubs.map(p => p.id == paystub.id ? {...paystub} : p)] as PaystubWith[]
    paystubs$.set(paystubs);
    
    createToast({
      title: 'Removed',
      description: 'Paystub removed from payroll cycle.',
      type: 'success',
    });
  }
  
  const stopEditing = () => {
    isEditing = false;
    paystubs$.set(paystubs.filter(p => p.payrollCycleId == cycle.id));
  }
  
  const goBack = () => {
    isEditing = true;
    paystubs$.set(paystubs);
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
          <div class="flex flex-row gap-6 text-sm justify-between">
            <div class="flex flex-row gap-6">
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
            
            <div class="flex flex-row justify-center gap-4">
              {#if isEditing}
                <GradientButton color="cyanToBlue" on:click={stopEditing} class="self-start">
                  Ready to Review <ArrowRightOutline class="w-3.5 h-3.5 ml-2" />
                </GradientButton>
              {:else}
                <Button outline color="red" class="self-start" on:click={goBack}>
                  Go back! <RedoOutline class="w-3.5 h-3.5 ml-2" />
                </Button>
                
                <form method="post" action="?/toggle-payroll-cycle-close" use:enhance={({ formData, cancel }) => {
                  
                  
                  return async ({ result, update }) => {
                    if (result.status != 200) return;
                    
                    cycle.isClosed = !!cycle.isClosed ? 0 : 1;
                    
                    createToast({
                      title: '',
                      description: 'Paystub added to payroll cycle.',
                      type: 'success',
                    });
                    
                    update();
                  }
                }}>
                  <input type="hidden" name="id" value={cycle?.id} />
                  <input type="hidden" name="isClosed" value={cycle?.isClosed} />
                  {#if !cycle?.isClosed}
                    <Button type="submit" outline color="dark" class="self-start" id="close-button">
                      Close <CheckCircleOutline class="w-3.5 h-3.5 ml-2" />
                    </Button>
                    <Tooltip arrow={false} triggeredBy="#close-button">
                      Closes the payroll cycle and prevents any further changes.
                    </Tooltip>
                  {:else}
                    <Button type="submit" outline class="self-start" id="reopen-button">
                      Re-open <RedoOutline class="w-3.5 h-3.5 ml-2" />
                    </Button>
                    <Tooltip arrow={false} triggeredBy="#reopen-button">
                      Re-opens the payroll cycle and allows changes to be made.
                    </Tooltip>
                  {/if}
                </form>
                
                <Button outline color="green" class="self-start" href="/app/payroll-cycles">
                  Looks good <ThumbsUpSolid class="w-3.5 h-3.5 ml-2" />
                </Button>
              {/if}
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
          {#each $paystubs$ as item (item.id)}
            <TableBodyRow>
              <TableBodyCell>{item.employee.firstName} {item.employee.lastName}</TableBodyCell>
              <TableBodyCell>{item.campaign.name}</TableBodyCell>
              <TableBodyCell>{formatCurrency(item.netPay)}</TableBodyCell>
              <TableBodyCell>
                {#if item.payrollCycleId}
                  {formatDate(item.payrollCycle?.paymentDate)}
                {:else}
                  <span class="italic text-neutral-400">Unassigned</span>
                {/if}
              </TableBodyCell>
              <TableBodyCell>
                <div class="flex justify-around">
                  {#if isEditing}
                    <form action="?/attach-payroll-cycle" method="post"
                      use:enhance={({ formData, cancel }) => {
                        
                        return async ({ result, update }) => {
                          if (result.status != 200 || !result.data) return;
                          
                          item.payrollCycle = cycle;
                          item.payrollCycleId = `${cycle?.id}`;
                          paystubs = [...paystubs.map(p => {
                            if (p.id == item.id) {
                              p = item;
                            }
                            
                            return p;
                          })];
                          paystubs$.set(paystubs);
                          
                          createToast({
                            title: '',
                            description: 'Paystub added to payroll cycle.',
                            type: 'success',
                          });
                          
                          update();
                        }
                      }}
                    >
                      <input type="hidden" name="paystubId" value={item?.id} />
                      <input type="hidden" name="payrollCycleId" value={cycle?.id} />
                      {#if !item.payrollCycleId}
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
                  {/if}
                </div>
              </TableBodyCell>
            </TableBodyRow>
          {/each}
          {#if $paystubs$.length < 1}
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