<script lang="ts">
	import type { SelectEmployeeNotes } from '$lib/types/db.model';
	import { createLabel, melt, createToolbar, createSeparator } from '@melt-ui/svelte';
  import dayjs from 'dayjs';
	import SubmitButton from './SubmitButton.svelte';
  
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
  
  const formatDate = (date: bigint) => {
    const datejs = dayjs(Number(date));
    
    if (datejs.isValid()) return datejs.format('MM-DD-YYYY');
    
    return '';
  }
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
    
    <div class="flex justify-end w-[100%]">
      <div class="pt-1">
        <SubmitButton text="Add Note" />
      </div>
    </div>
    
    <div use:melt={$horizontal} class="my-3.5 h-[1px] w-full bg-neutral-400" />
    
    <div class="block w-full rounded-md border-1 p-4 5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset max-h-60 overflow-y-scroll">
      {#each notes as note, i}
        <div class="grid grid-cols-10 items-center justify-between gap-1">
          <div class="flex flex-col col-span-9">
            <span class="text-sm font-medium leading-6 text-gray-900">{note.note}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-medium leading-6 text-gray-900">{formatDate(note.created)}</span>
          </div>
        </div>
        {#if i !== notes.length - 1}
          <div use:melt={$horizontal} class="my-3.5 h-[1px] w-full bg-neutral-200" />
        {/if}
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