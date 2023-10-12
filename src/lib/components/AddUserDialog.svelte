<script lang="ts">
  import { enhance } from '$app/forms';
  import SelectedClientStore from '$lib/stores/client';
  import Icon from '@iconify/svelte';
  import { createDialog, melt, createLabel, createSelect } from '@melt-ui/svelte';
	import { Check, ChevronDown, XSquare } from 'lucide-svelte';
  import type { Unsubscriber } from 'svelte/store';
  
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
  
  const options = [
    { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'manager' },
    { label: 'User', value: 'user' },
  ];
</script>

<button use:melt={$trigger} class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex justify-around items-center gap-2">
  <span>Add User</span>
</button>

<div use:melt={$portalled}>
  {#if $open}
    <div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50" />
    <div
			use:melt={$content}
			class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw]
      max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white
      p-6 shadow-lg"
		>
      <div class="flex justify-between">
        <h3 use:melt={$title}>Add User</h3>
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
          };
        }}
      >
        <div class="flex flex-col items-start justify-center">
          <div class="flex flex-col items-start justify-center pb-2">
            <label use:melt={$root} for="first_name" class="mb-0.5 font-medium text-neutral-900" data-melt-part="root">
              First Name
            </label>
            <input type="text" name="first_name" id="first_name" required class="h-10 w-[240px] rounded-md px-3 py-2 text-neutral-700" />
          </div>
          
          <div class="flex flex-col items-start justify-center pb-2">
            <label use:melt={$root} for="last_name" class="mb-0.5 font-medium text-neutral-900" data-melt-part="root">
              Last Name
            </label>
            <input type="text" name="last_name" id="last_name" required class="h-10 w-[240px] rounded-md px-3 py-2 text-neutral-700" />
          </div>
          
          <div class="flex flex-col items-start justify-center pb-2">
            <label use:melt={$root} for="email" class="mb-0.5 font-medium text-neutral-900" data-melt-part="root">
              Email
            </label>
            <input type="email" name="email" id="email" required class="h-10 w-[240px] rounded-md px-3 py-2 text-neutral-700" />
          </div>
          
          <div class="pb-2">
            <button 
              use:melt={$triggerSelect} 
              class="flex h-10 min-w-[220px] items-center justify-between rounded-lg bg-white px-3 py-2 shadow transition-opacity hover:opacity-90"
              on:m-keydown={(e) => {
                e.preventDefault(); // Cancel default builder behabiour
                e.detail.originalEvent.preventDefault(); // Cancel page scroll
           
                const { key } = e.detail.originalEvent;
           
                if (!['ArrowDown', 'ArrowUp', 'Space', 'Enter'].includes(key)) return;
           
                const index = options.findIndex(x => x.label === `${$selectedLabel}`);
           
                if (key === 'ArrowDown') {
                  const nextIndex = index + 1;
                  const nextOption = options[nextIndex] || options[0];
                  selected.set(nextOption);
                } else if (key === 'ArrowUp') {
                  const prevIndex = index - 1;
                  const prevOption = options[prevIndex] || options[options.length - 1];
                  selected.set(prevOption);
                } else {
                  open.set(true);
                }
              }}
            >
              <span>{$selectedLabel || 'Select a Role'}</span>
              <ChevronDown class="square-5" />
            </button>
            
            {#if $openSelect}
              <div class="z-10 flex max-h-[300px] flex-col overflow-y-auto rounded-lg bg-white p-1 shadow focus:!ring-0"
                use:melt={$menu}
              >
                {#each options as item}
                <div
                  class="relative cursor-pointer rounded-lg py-1 pl-8 pr-4 text-neutral-800
                  focus:z-10 focus:text-neutral-700
                data-[highlighted]:bg-magnum-50 data-[selected]:bg-neutral-100
                data-[highlighted]:text-neutral-900 data-[selected]:text-neutral-900"
                  use:melt={$option(item)}
                  on:m-click={(e) => {
                    e.preventDefault();
                    
                    selected.set(item);
                    openSelect.set(false);
                  }}
                >
                  <div class="check {$isSelected(item) ? 'block' : 'hidden'}">
                    <Check class="square-4" />
                  </div>
    
                  {item.label}
                </div>
                {/each}
              </div>
            {/if}
          </div>
          
          <div class="flex flex-col items-start justify-center pb-2">
            <label for="client_id"
              use:melt={$root}
              class="mb-0.5 font-medium text-neutral-900"
              data-melt-part="root"
            >Client</label>
            <input type="text" name="client_id" id="client_id" readonly
              placeholder={$SelectedClientStore}
              value={$SelectedClientStore}
              class="h-10 w-[240px] rounded-md px-3 py-2 text-neutral-700" />
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