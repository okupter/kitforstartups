<script lang="ts">
	import type { SelectEmployeeNotes } from '$lib/types/db.model';
	import { createLabel, melt, createToolbar, createSeparator } from '@melt-ui/svelte';
  
  export let notes: SelectEmployeeNotes[];

	const {
		elements: { root }
	} = createLabel();

	const {
    elements: { root: horizontal },
  } = createSeparator({
    orientation: 'horizontal',
    decorative: true,
  });
</script>

<form action="">
	<div class="flex flex-col items-start justify-center">
		<label
			for="notes"
			use:melt={$root}
			class="block text-sm font-medium leading-6 text-gray-900"
			data-melt-part="root"
		>
			<span>Notes</span>
		</label>
		<textarea
			name="notes"
			id="notes"
			rows="3"
			class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
		></textarea>
    
    <div use:melt={$horizontal} class="my-3.5 h-[1px] w-full bg-neutral-900" />
    
    <div class="block w-full rounded-md border-1 py-1 5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset">
      {#each notes as note}
        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-col">
            <span class="text-sm font-medium leading-6 text-gray-900">{note.created}</span>
            <span class="text-sm font-medium leading-6 text-gray-900">{note.note}</span>
          </div>
          <div class="flex flex-row items-center justify-center">
            <button type="button" class="p-1.5 text-gray-900 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 8a6 6 0 00-6-6m6 0a6 6 0 01-6 6"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              </svg>
            </button>
            <button type="button" class="p-1.5 text-gray-900 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </button>
          </div>
        </div>
      {/each}
    </div>
	</div>
</form>

<style lang="postcss">
  .item {
    padding: theme('spacing.1');
    border-radius: theme('borderRadius.md');
 
    &:hover {
      background-color: theme('colors.magnum.100');
    }
 
    &[data-state='on'] {
      background-color: theme('colors.magnum.200');
      color: theme('colors.magnum.900');
    }
 
    &:focus {
      @apply ring-2 ring-magnum-400;
    }
  }
 
  .separator {
    width: 1px;
    background-color: theme('colors.neutral.300');
    align-self: stretch;
  }
</style>