<script lang="ts">
	import type { Employee } from '$lib/types/db.model';
	import { createAvatar, melt } from '@melt-ui/svelte';
	import { AppWindow } from 'lucide-svelte';
  import { page } from '$app/stores';
	import { onMount } from 'svelte';

	// A blank source to demonstrate the fallback
	const {
		elements: { image, fallback }
	} = createAvatar({
		src: ''
	});

	export let employee: Employee;
  
  const initials = `${employee?.employee?.firstName[0]}${employee?.employee?.lastName[0]}`;
  let windowUrl = '';
  onMount(() => windowUrl = window.location.href + '/');
</script>

<div
	class="flex flex-col items-start rounded-[10px] border-[1px] border-gray-200 w-[300px] p-4 bg-indigo-400 bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none"
>
	<div class="relative flex h-32 w-full justify-center rounded-xl bg-cover">
		<img
			src="https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/banner.ef572d78f29b0fee0a09.png"
			class="absolute flex h-32 w-full justify-center rounded-xl bg-cover"
      alt=""
		/>
		<div
			class="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-indigo-500 dark:!border-navy-700"
		>
			<img
				use:melt={$image}
				class="h-full w-full rounded-full"
				src="https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/avatar11.1060b63041fdffa5f8ef.png"
				alt=""
			/>
			<span use:melt={$fallback} class="text-3xl font-medium dark:text-white">{initials}</span>
		</div>
	</div>
	<div class="w-[100%] mt-16 flex flex-col justify-center items-center">
		<h4 class="text-xl font-bold text-navy-700 dark:text-white">
			{employee?.employee?.firstName}
			{employee?.employee?.lastName}
		</h4>
		<p class="text-base font-normal text-gray-600">{employee?.employee_profile?.email}</p>
	</div>
	<div class="w-[100%] px-2 mt-6 mb-3 flex justify-end gap-14 md:!gap-14">
    <a href={windowUrl + employee?.employee?.id}>
      <AppWindow />
    </a>
		<!-- <div class="flex flex-col items-center justify-center">
			<p class="text-2xl font-bold text-navy-700 dark:text-white">17</p>
			<p class="text-sm font-normal text-gray-600">Posts</p>
		</div>
		<div class="flex flex-col items-center justify-center">
			<p class="text-2xl font-bold text-navy-700 dark:text-white">9.7K</p>
			<p class="text-sm font-normal text-gray-600">Followers</p>
		</div>
		<div class="flex flex-col items-center justify-center">
			<p class="text-2xl font-bold text-navy-700 dark:text-white">434</p>
			<p class="text-sm font-normal text-gray-600">Following</p>
		</div> -->
	</div>
</div>
