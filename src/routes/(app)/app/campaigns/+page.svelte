<script lang="ts">
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import type { SelectCampaign } from '$lib/types/db.model.js';
	import { writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation'
	
	export let data;

	// const campaigns = data.campaigns?.map((campaign) => ({
	// 	...campaign,
	// 	created: Number(campaign.created),
	// 	updated: Number(campaign.updated)
	// }));
  const { campaigns: rawCampaigns } = data;
  const allCampaigns = (rawCampaigns || []) as unknown as SelectCampaign[];
  
  const campaigns = writable(allCampaigns);
  
  const searchOnBlur = (event: any) => {
    const value = event.target.value;
    
    campaigns.set(allCampaigns.filter((campaign: any) => campaign.name.toLowerCase().includes(value.toLowerCase())));
  }
  
  const {
    elements: { menu, item, trigger, arrow },
    states: { open, },
  } = createDropdownMenu({
    // forceVisible: true, 
    // loop: true,
  })
</script>

<section class="px-4 mx-auto container">
	<div class="sm:flex sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-x-3">
				<h2 class="text-lg font-medium text-neutral-800 dark:text-neutral-50">Campaigns</h2>
				<span
					class="px-3 py-1 text-xs text-indigo-600 bg-indigo-100 rounded-full dark:bg-gray-800 dark:text-indigo-200"
				>
					{$campaigns?.length} Campaigns
				</span>
			</div>

			<p class="mt-1 text-sm text-neutral-500 dark:text-neutral-50">
				These are the currently active campaigns
			</p>
		</div>

		<div class="flex items-center mt-3 gap-x-3">
			<button
				class="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-indigo-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:bg-indigo-600"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-5 h-5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>

				<span>Add campaign</span>
			</button>
		</div>
	</div>

	<div class="mt-6 md:flex md:items-center md:justify-between">
		<div
			class="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700"
		>
			<button
				class="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300"
			>
				View all
			</button>

			<button
				class="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
			>
				Active
			</button>

			<button
				class="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
			>
				Inactive
			</button>
		</div>

		<div class="relative flex items-center mt-4 md:mt-0">
			<span class="absolute">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
					/>
				</svg>
			</span>

			<input
        on:blur={searchOnBlur}
				type="text"
				placeholder="Search"
				class="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
			/>
		</div>
	</div>

	<div class="flex flex-col mt-6">
		<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
				<div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
					<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
						<thead class="bg-gray-50 dark:bg-gray-800">
							<tr>
								<th
									scope="col"
									class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
								>
									<button class="flex items-center gap-x-3 focus:outline-none">
										<span>Campaign</span>

										<svg
											class="h-3"
											viewBox="0 0 10 11"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z"
												fill="currentColor"
												stroke="currentColor"
												stroke-width="0.1"
											/>
											<path
												d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z"
												fill="currentColor"
												stroke="currentColor"
												stroke-width="0.1"
											/>
											<path
												d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z"
												fill="currentColor"
												stroke="currentColor"
												stroke-width="0.3"
											/>
										</svg>
									</button>
								</th>

								<th
									scope="col"
									class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
								>
									Status
								</th>

								<th
									scope="col"
									class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
								>
									Description
								</th>

								<!-- <th
									scope="col"
									class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
									>Users</th
								>

								<th
									scope="col"
									class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
									>License use</th
								> -->

								<th scope="col" class="relative py-3.5 px-4">
									<span class="sr-only">Edit</span>
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              {#each $campaigns as campaign}
                <tr>
                  <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                    <div>
                      <h2 class="font-medium text-gray-800 dark:text-white">{ campaign.name }</h2>
                      <p class="text-sm font-normal text-gray-600 dark:text-gray-400">
                        { campaign.url }
                      </p>
                    </div>
                  </td>
                  <td class="px-12 py-4 text-sm font-medium whitespace-nowrap">
                    <div
                      class="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 dark:bg-gray-800"
                    >
                      { campaign.active ? 'Active' : 'Inactive' }
                    </div>
                  </td>
                  <td class="px-4 py-4 text-sm whitespace-nowrap">
                    <div>
                      <p class="text-gray-500 dark:text-gray-400">
                        { campaign.description ? campaign.description : 'No description' }
                      </p>
                      <!-- <h4 class="text-gray-700 dark:text-gray-200">Content curating app</h4>
                      <p class="text-gray-500 dark:text-gray-400">
                        Brings all your news into one place
                      </p> -->
                    </div>
                  </td>
                  <!-- <td class="px-4 py-4 text-sm whitespace-nowrap">
                    <div class="flex items-center">
                      <img
                        class="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
                        alt=""
                      />
                      <img
                        class="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0"
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
                        alt=""
                      />
                      <img
                        class="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0"
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1256&q=80"
                        alt=""
                      />
                      <img
                        class="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0"
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
                        alt=""
                      />
                      <p
                        class="flex items-center justify-center w-6 h-6 -mx-1 text-xs text-blue-600 bg-blue-100 border-2 border-white rounded-full"
                      >
                        +4
                      </p>
                    </div>
                  </td>

                  <td class="px-4 py-4 text-sm whitespace-nowrap">
                    <div class="w-48 h-1.5 bg-blue-200 overflow-hidden rounded-full">
                      <div class="bg-blue-500 w-2/3 h-1.5"></div>
                    </div>
                  </td> -->

                  <td class="px-4 py-4 text-sm whitespace-nowrap">
                    <button
                      type="button"
                      class="trigger"
                      use:melt={$trigger}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                        />
                      </svg>
                    </button>
                    {#if $open}
                      <div use:melt={$menu} class="menu" transition:fly={{ duration: 150, y: -10 }}>
                        <div use:melt={$item} class="item"
													on:m-pointerdown={e => {
														e.preventDefault();
														goto(`/app/campaigns/${campaign.id}`)
													}}
												>Edit</div>
                        <div class="item" use:melt={$item}>
                          { campaign.active ? 'Disable' : 'Enable' }
                        </div>
                      </div>
                    {/if}
                  </td>
                </tr>   
              {/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="postcss">
  .menu {
    @apply z-10 flex max-h-[300px] min-w-[220px] flex-col shadow-lg;
    @apply rounded-md bg-white p-1 shadow-neutral-900/30 lg:max-h-none dark:bg-neutral-800;
    @apply ring-0 !important;
  }
  .subMenu {
    @apply min-w-[220px] shadow-md shadow-neutral-900/30;
  }
  .item {
    @apply relative h-6 min-h-[24px] select-none rounded-sm pl-6 pr-1;
    @apply z-20 text-neutral-900 outline-none dark:text-neutral-50;
    @apply data-[highlighted]:bg-neutral-200 data-[highlighted]:text-neutral-900 dark:data-[highlighted]:bg-neutral-800 dark:data-[highlighted]:text-neutral-50;
    @apply data-[disabled]:text-neutral-300 dark:data-[disabled]:text-neutral-600;
    @apply flex items-center text-sm leading-none;
    @apply ring-0 !important;
  }
  .trigger {
    @apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-neutral-800;
    @apply text-neutral-900 transition-colors hover:bg-white/90 dark:text-neutral-200 dark:hover:bg-neutral-700;
    @apply data-[highlighted]:ring-neutral-400 data-[highlighted]:ring-offset-2 dark:data-[highlighted]:ring-neutral-600 !important;
    @apply p-0 text-sm font-medium  data-[highlighted]:outline-none;
  }
  .check {
    @apply absolute left-2 top-1/2 text-neutral-500;
    translate: 0 calc(-50% + 1px);
  }
 
  .dot {
    @apply h-[4.75px] w-[4.75px] rounded-full bg-neutral-900;
  }
 
  .separator {
    @apply m-[5px] h-[1px] bg-neutral-200;
  }
 
  .rightSlot {
    @apply ml-auto pl-5;
  }
 
  .icon {
    @apply h-[13px] w-[13px];
  }
  .check {
    @apply absolute left-0 inline-flex w-6 items-center justify-center;
  }
  .text {
    @apply pl-6 text-xs leading-6 text-neutral-600;
  }
</style>