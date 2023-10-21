<script lang="ts">
  import { enhance } from '$app/forms';
  import SelectedClientStore from '$lib/stores/client';
  import Icon from '@iconify/svelte';
  import { createDialog, melt, createLabel, createSelect } from '@melt-ui/svelte';
	import { Check, ChevronDown, XSquare } from 'lucide-svelte';
  import type { Unsubscriber } from 'svelte/store';
	import { createToast } from './Toast.svelte';
  
  const {
    elements: { trigger: triggerSelect, menu, option, group, groupLabel, label },
    states: { selectedLabel, open: openSelect, selected },
    helpers: { isSelected },
  } = createSelect({
    forceVisible: true,
    positioning: {
      placement: 'bottom',
      fitViewport: true,
      sameWidth: true,
    },
  });
  
  const {
		elements: { trigger, overlay, content, title, close, portalled },
		states: { open }
	} = createDialog();
  
  const {
    elements: { root, },
  } = createLabel();
</script>

<button use:melt={$trigger} class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex justify-around items-center gap-2">
  <span>Add Employee</span>
</button>

<div use:melt={$portalled}>
  {#if $open}
    <div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50" />
    <div
			use:melt={$content}
			class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw]
      max-w-[40%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white
      p-6 shadow-lg"
		>
      <div class="flex justify-between">
        <h3 use:melt={$title}>Add Employee</h3>
        <button use:melt={$close}>
          <XSquare />
        </button>
      </div>
      
      <form action="?/add" method="post" class="py-5 px-2"
        use:enhance={({ formElement, formData, action, cancel, submitter }) => {
          // `formElement` is this `<form>` element
          // `formData` is its `FormData` object that's about to be submitted
          // `action` is the URL to which the form is posted
          // calling `cancel()` will prevent the submission
          // `submitter` is the `HTMLElement` that caused the form to be submitted
      
          return async ({ result, update }) => {
            console.log(result);
            // `result` is an `ActionResult` object
            // `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
            
            if (!result.data) return;
            
            update();
            createToast({
              type: 'success',
              title: 'Employee added',
              description: 'The employee has been updated successfully.'
            });
            
            open.set(false);
          };
        }}
      >
        <div>
          <div class="grid grid-cols-5 gap-4">
            <div class="pb-2 col-span-2">
              <label use:melt={$root} for="first_name" class="mb-0.5 font-medium text-neutral-900" data-melt-part="root">
                First Name
              </label>
              <input type="text" name="first_name" id="first_name" required class="h-10 w-[100%] rounded-md px-3 py-2 text-neutral-700" />
            </div>
            
            <div class="col-span-3 pb-2">
              <label use:melt={$root} for="last_name" class="mb-0.5 font-medium text-neutral-900" data-melt-part="root">
                Last Name
              </label>
              <input type="text" name="last_name" id="last_name" required class="h-10 w-[100%] rounded-md px-3 py-2 text-neutral-700" />
            </div>
          </div>
          
          <div class="grid grid-cols-5 gap-4">
            <div class="col-span-2 pb-2">
              <label use:melt={$root} for="phone" class="mb-0 5 font-medium text-neutral-900" data-melt-part="root">
                Phone
              </label>
              <input type="text" name="phone" id="phone" class="h-10 w-[100%] rounded-md px-3 py-2 text-neutral-700" required />
            </div>
            
            <div class="col-span-3 pb-2">
              <label use:melt={$root} for="email" class="mb-0 5 font-medium text-neutral-900" data-melt-part="root">
                Email
              </label>
              <input type="text" name="email" id="email" class="h-10 w-[100%] rounded-md px-3 py-2 text-neutral-700" />
            </div>
          </div>
          
          <div class="grid grid-cols-5 gap-4">
            <div class="col-span-4 pb-2">
              <label use:melt={$root} for="address" class="mb-0.5 font-medium text-neutral-900" data-melt-part="root">
                Address
              </label>
              <input type="text" name="address" id="address" required class="h-10 w-[100%] rounded-md px-3 py-2 text-neutral-700" />
            </div>
            
            <div class="pb-2">
              <label use:melt={$root} for="address_2" class="mb-0.5 font-medium text-neutral-900" data-melt-part="root">
                Apt / Unit
              </label>
              <input type="text" name="address_2" id="address_2" class="h-10 w-[100%] rounded-md px-3 py-2 text-neutral-700" />
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-4">
            <div class="flex flex-col items-start justify-center pb-2 col-span-2">
              <label use:melt={$root} for="city" class="mb-0 5 font-medium text-neutral-900" data-melt-part="root">
                City
              </label>
              <input type="text" name="city" id="city" class="h-10 w-[100%] rounded-md px-3 py-2 text-neutral-700" required />
            </div>
            
            <div class="flex flex-col items-start justify-center pb-2">
              <label use:melt={$root} for="state" class="mb-0 5 font-medium text-neutral-900" data-melt-part="root">
                State
              </label>
              <input type="text" name="state" id="state" class="h-10 w-[100%] rounded-md px-3 py-2 text-neutral-700" required />
            </div>
          </div>
          
          <div class="flex flex-col items-start justify-center pb-2">
            <label use:melt={$root} for="zip" class="mb-0 5 font-medium text-neutral-900" data-melt-part="root">
              Zip
            </label>
            <input type="text" name="zip" id="zip" class="h-10 w-[240px] rounded-md px-3 py-2 text-neutral-700" required />
          </div>
        </div>
        
        <div class="flex justify-between">
          <button type="button" use:melt={$close}>
            Cancel
          </button>
          
          <button type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  {/if}
</div>

<style lang="postcss">
  .check {
    position: absolute;
    left: theme(spacing.2);
    top: 50%;
    z-index: theme(zIndex.20);
    translate: 0 calc(-50% + 1px);
    color: theme(colors.magnum.500);
  }
</style>