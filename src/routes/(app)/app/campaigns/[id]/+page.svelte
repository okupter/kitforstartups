<script lang="ts">
	import dayjs from 'dayjs';
	import shop from '$lib/assets/shop-2-svgrepo-com.svg';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	export let data;

	const { campaign } = data;

	const formatDate = (date: any) => {
		return dayjs(date).format('MMMM D, YYYY');
	};
</script>

<!-- component -->
<div class="flex flex-col bg-background-100 shadow-md rounded-xl py-10">
  <div class="container mx-4">
    <div class="max-w-3xl w-full mx-auto grid gap-1 grid-cols-1">
      <h3 class="text-text-900">{campaign?.name}</h3>
      <p class="text-accent-700">Last Updated: {formatDate(campaign?.updated)}</p>
    </div>
  </div>
  
  <!-- dark theme -->
	<div class="container m-4">
    
		<form action="?/update" method="post"
      class="max-w-3xl w-full mx-auto grid gap-4 grid-cols-2 pt-8"
      use:enhance={({ formElement, formData, action, cancel, submitter }) => {
        
        return async ({ result, update }) => {
          console.log(result);
        }
      }}
    >
      
      <div class="form-control max-w-xs">
        <label for="name">Name</label>
        <input type="text" name="name" id="name" value={campaign?.name} required />
      </div>
      
      <div class="form-control max-w-xs">
        <label for="active">Enabled</label>
        <input type="checkbox" name="active" checked={campaign?.active} id="active" /> 
      </div>
      
      <div class="form-control max-w-lg col-span-2">
        <label for="url">URL</label>
        <input type="text" name="url" id="url" value={campaign?.url} />
      </div>
      
      <div class="form-control col-span-2">
        <label for="description">Description</label>
        <textarea name="description" id="description" rows="3" value={campaign?.description}></textarea>
      </div>
      
      <div class="flex flex-row justify-end col-span-2">
        <SubmitButton text="Save" />
      </div>
      
    </form>
	</div>
</div>
