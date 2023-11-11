<script lang="ts">
  import { enhance } from '$app/forms';
	import SelectedClientStore from '$lib/stores/client';
  import Icon from '@iconify/svelte';
	import { createDialog, melt, createSelect } from '@melt-ui/svelte';
  import { Check, ChevronDown, XSquare } from 'lucide-svelte';
	import { onDestroy } from 'svelte';
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
  
  export let selectedClientId: string;
  export let clients: App.Client[];
  let selectedClient: App.Client;
  let unsubs = [] as Unsubscriber[];

  unsubs.push(SelectedClientStore.subscribe(clientId => {
    selectedClientId = clientId;
    selectedClient = clients.find(x => x.id === selectedClientId) as App.Client;
  }));
  
	const {
		elements: { trigger, overlay, content, title, close, portalled },
		states: { open }
	} = createDialog();
  
  const options = {
    clients: [...clients.map(x => x.name)],
  }
  
  unsubs.push(selected.subscribe(async value => {
    const clientName = value?.value;
    if (!clientName) return;
    const newClient = clients.find(x => x.name === clientName);
    if (!newClient) return;
    
    const res = await fetch('/api/clients', {
      method: 'post',
      body: JSON.stringify({ id: newClient.id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    try {
      const data = await res.json();
      
      SelectedClientStore.set(data.clientId);
    } catch (err) {
      console.error(err);
    }
  }));
  
  onDestroy(() => unsubs.forEach(fn => fn()));
</script>

<button use:melt={$trigger} class="rounded-md bg-primary-600 text-text-50 dark:text-text-900 px-3.5 py-2.5 text-sm font-semibold 
  shadow-sm hover:bg-primary-700 dark:bg-primary-300 dark:hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
  focus-visible:outline-primary-600 flex justify-around items-center gap-2">
  <span>{selectedClient?.name.toLowerCase()}</span>
  <Icon icon="tabler:select" />
</button>

<div use:melt={$portalled}>
	{#if $open}
		<div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50" />
		<div
			use:melt={$content}
			class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw]
      max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-background-50 dark:bg-background-200
      p-6 shadow-lg"
		>
			<div class="flex justify-between">
        <h5 use:melt={$title}>Active Clients</h5>
        <button use:melt={$close}>
          <XSquare />
        </button>
      </div>
			
      <div class="py-5 px-2">
        <div class="flex gap-2 pb-3">
          <p class="font-bold">Currently Selected:</p>
          <span>{selectedClient?.name}</span>
        </div>
        
        <div class="flex flex-col gap-1">
          <!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
          <label class="block" use:melt={$label}>Change Client</label>
          <button
            class="flex h-10 min-w-[220px] items-center justify-between rounded-lg px-3 py-2 shadow transition-opacity hover:opacity-90 bg-background-50 dark:bg-background-300"
            use:melt={$triggerSelect}
            on:m-keydown={(e) => {
              e.preventDefault(); // Cancel default builder behabiour
              e.detail.originalEvent.preventDefault(); // Cancel page scroll
         
              const { key } = e.detail.originalEvent;
         
              if (!['ArrowDown', 'ArrowUp', 'Space', 'Enter'].includes(key)) return;
         
              const allOptions = Object.values(options).flat();
              const index = allOptions.indexOf(`${$selectedLabel}`);
         
              if (key === 'ArrowDown') {
                const nextIndex = index + 1;
                const nextOption = allOptions[nextIndex] || allOptions[0];
                selected.set({ value: nextOption, label: nextOption });
              } else if (key === 'ArrowUp') {
                const prevIndex = index - 1;
                const prevOption =
                  allOptions[prevIndex] || allOptions[allOptions.length - 1];
                selected.set({ value: prevOption, label: prevOption });
              } else {
                open.set(true);
              }
            }}
            aria-label="Client"
          >
            {$selectedLabel || 'Select a client'}
            <ChevronDown class="square-5" />
          </button>
          {#if $openSelect}
            <div
              class="z-10 flex max-h-[300px] flex-col
            overflow-y-auto rounded-lg bg-background-50 dark:bg-background-300 p-1
            shadow focus:!ring-0"
              use:melt={$menu}
            >
              {#each Object.entries(options) as [key, arr]}
                {#each arr as item}
                  <div
                    class="relative cursor-pointer rounded-lg py-1 pl-8 pr-4 text-text-900
                    focus:z-10 focus:text-text-800
                  data-[highlighted]:bg-accent-500
                  data-[highlighted]:text-text-50 data-[selected]:text-text-800"
                    use:melt={$option({ value: item, label: item })}
                    on:m-click={(e) => {
                      e.preventDefault();
                      
                      selected.set({ value: item, label: item });
                      open.set(false);
                    }}
                  >
                    <div class="check {$isSelected(item) ? 'block' : 'hidden'}">
                      <Check class="square-4" />
                    </div>
      
                    {item}
                  </div>
                {/each}
              {/each}
            </div>
          {/if}
        </div>
      </div>
      
			<div class="flex justify-end">
        <button use:melt={$close}>Close</button>
      </div>
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
    color: theme(colors.primary.500);
  }
</style>