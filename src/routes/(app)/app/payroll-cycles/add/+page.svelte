<script lang="ts">
  import { Label, Input, Helper, Breadcrumb, BreadcrumbItem, Button } from 'flowbite-svelte';
  import dayjs from 'dayjs';
	import { ArrowRightIcon } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { createToast } from '$lib/components/Toast.svelte';
  
  const startDate = dayjs().format('YYYY-MM-DD')
  const endDate = dayjs(startDate).add(1, 'week').format('YYYY-MM-DD');
</script>

<form action="?/add" method="post" class="container max-w-3xl p-4"
  use:enhance={({ formElement, formData, action, cancel, submitter }) => {
    
    return async ({ result, update }) => {
      if (!result) return;
      console.log(result);
      
      createToast({
        title: 'Success!',
        description: 'Payroll cycle created successfully!',
        type: 'success',
      });
      goto('/app/payroll-cycles/' + result.id);
    }
  }}
>
  <div class="pb-8">
    <h4>New Payroll Cycle</h4>
    <p>
      This will create a new payroll cycle for all employees. You can edit the
      payroll cycle after it's created.
    </p>
  </div>
  
  <div class="pb-4">
    <Breadcrumb>
      <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
      <BreadcrumbItem href="/app/payroll-cycles">Payroll Cycles</BreadcrumbItem>
      <BreadcrumbItem>New Payroll Cycle</BreadcrumbItem>
    </Breadcrumb>
  </div>
  
  <div class="grid grid-cols-2 gap-4">
    <div class="mb-6">
      <Label class="block mb-2">Start Date</Label>
      <Input type="date" name="startDate" value={startDate} required />
    </div>
    
    <div class="mb-6">
      <Label class="block mb-2">End Date</Label>
      <Input type="date" name="endDate" value={endDate} required />
    </div>
    
    <div class="mb-6">
      <Label class="block mb-2">Pay Date</Label>
      <Input type="date" name="payDate" required />
      <Helper class="mt-2">
        When will the employees receive their pay?
      </Helper>
    </div>
  </div>
  
  <div class="flex justify-end">
    <Button class="bg-primary-600 dark:bg-primary-300 dark:hover:bg-primary-400" type="submit">
      Next <ArrowRightIcon class="w-4 h-4 ml-2" />
    </Button>
  </div>
</form>