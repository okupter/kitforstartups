<script lang="ts">
	import { createLabel, melt, createToolbar } from '@melt-ui/svelte';

	const {
		elements: { root }
	} = createLabel();

	const {
		elements: { root: toolbarRoot, button, link, separator },
		builders: { createToolbarGroup }
	} = createToolbar();
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
		<div
			use:melt={$root}
			class="flex min-w-max items-center gap-4 rounded-md bg-white px-3 py-3 text-neutral-700 shadow-sm lg:w-[35rem]"
		>
			<!-- <div class="flex items-center gap-1" use:melt={$fontGroup}>
				<button class="item" aria-label="bold" use:melt={$fontItem('bold')}>
					<Bold class="square-5" />
				</button>
				<button class="item" aria-label="italic" use:melt={$fontItem('italic')}>
					<Italic class="square-5" />
				</button>
				<button class="item" aria-label="strikethrough" use:melt={$fontItem('strikethrough')}>
					<Strikethrough class="square-5" />
				</button>
			</div>
			<div class="separator" use:melt={$separator} />
			<div class="flex items-center gap-1" use:melt={$alignGroup}>
				<button class="item" aria-label="align left" use:melt={$alignItem('left')}>
					<AlignLeft class="square-5" />
				</button>
				<button class="item" aria-label="align center" use:melt={$alignItem('center')}>
					<AlignCenter class="square-5" />
				</button>
				<button class="item" aria-label="align-right" use:melt={$alignItem('right')}>
					<AlignRight class="square-5" />
				</button>
			</div>
			<div class="separator" use:melt={$separator} /> -->
			<a href="/" class="link nowrap flex-shrink-0" use:melt={$link}> Edited 2 hours ago </a>
			<button
				class="ml-auto rounded-md bg-magnum-600 px-3 py-1 font-medium text-magnum-100 hover:opacity-75 active:opacity-50"
				use:melt={$button}>Save</button
			>
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