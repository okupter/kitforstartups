<script lang="ts">
	import { createDialog, melt } from '@melt-ui/svelte';
  
  export let clients: any[];
	const {
		elements: { trigger, overlay, content, title, close, portalled },
		states: { open }
	} = createDialog();
</script>

<button use:melt={$trigger}> Open Dialog </button>

<div use:melt={$portalled}>
	{#if $open}
		<div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50" />
		<div
			use:melt={$content}
			class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw]
      max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white
      p-6 shadow-lg"
		>
			<h2 use:melt={$title}>Dialog Title</h2>
			
      <div class="py-5 px-2">
        <h4>Client Name</h4>
        
        <div>
          {#each clients as client}
            <div>{client.name}</div>
          {/each}
        </div>
      </div>
      
			<button use:melt={$close}> Close Dialog </button>
		</div>
	{/if}
</div>
