<script lang="ts">
	import dayjs from 'dayjs';
	import shop from '$lib/assets/shop-2-svgrepo-com.svg';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { createToast } from '$lib/components/Toast.svelte';

	const formatDate = (date: any) => {
		return dayjs(date).format('MMMM D, YYYY');
	};
</script>

<div class="pb-4">
  <Breadcrumb aria-label="Breadcrumb">
    <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
    <BreadcrumbItem href="/app/campaigns">Campaigns</BreadcrumbItem>
    <BreadcrumbItem>Add</BreadcrumbItem>
  </Breadcrumb>
</div>

<!-- component -->
<div class="flex flex-col bg-background-100 shadow-md rounded-xl py-10">
  <div class="container mx-4">
    <div class="max-w-3xl w-full mx-auto grid gap-1 grid-cols-1">
      <h3 class="text-text-900">Add Campaign</h3>
      <!-- <p class="text-accent-700">Last Updated: {formatDate(campaign?.updated)}</p> -->
    </div>
  </div>
  
  <!-- dark theme -->
	<div class="container m-4">
    
		<form action="?/save" method="post"
      class="max-w-3xl w-full mx-auto grid gap-4 grid-cols-2 pt-8"
      use:enhance={({ formElement, formData, action, cancel, submitter }) => {
        
        return async ({ result, update }) => {
          if (!result) return;
          
          createToast({
            title: 'Success!',
            description: 'Campaign saved successfully!',
            type: 'success',
          });
        }
      }}
    >
      
      <div class="form-control max-w-xs">
        <label for="name">Name</label>
        <input type="text" name="name" id="name" required />
      </div>
      
      <div class="form-control max-w-xs">
        <label for="active">Enabled</label>
        <input type="checkbox" name="active" id="active" checked={true} /> 
      </div>
      
      <div class="form-control max-w-lg col-span-2">
        <label for="url">URL</label>
        <input type="text" name="url" id="url" />
      </div>
      
      <div class="form-control col-span-2">
        <label for="description">Description</label>
        <textarea name="description" id="description" rows="3"></textarea>
      </div>
      
      <div class="flex flex-row justify-end col-span-2">
        <SubmitButton text="Save" />
      </div>
      
    </form>
	</div>
</div>
