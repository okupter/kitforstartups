<script lang="ts">
	import AddUserDialog from '$lib/components/AddUserDialog.svelte';
	import { Card } from '$lib/components';
	import type { User } from '$lib/types/db.model';
	import { toProperCase } from '$lib/utils';
	import { Eye } from 'lucide-svelte';
	import { btn } from '$lib/styles/buttons';
	import ViewUserDialog from '$lib/components/ViewUserDialog.svelte';

  export let data;
  
  let users = [] as User[];
  if (data.users) users = data.users;
  
  console.log(data);
</script>

<p>hi</p>

<AddUserDialog />

<div class="mx-auto max-w-4xl px-4 sm:px-6 pt-8">
  <h3 class="text-3xl tracking-tight font-bold text-gray-900 sm:text-2xl">Users</h3>
</div>

<div class="flex flex-row justify-start gap-2 py-4">
  {#each users as user}
    <Card title={`${user.user_profile.firstName} ${user.user_profile.lastName}`}>
      <svelte:fragment slot="description">
        <div>Email: {user.auth_user.email}</div>
        <div>Email Verified: {user.auth_user.emailVerified ? 'Verified' : 'Not Verified'}</div>
        <div>Role: {toProperCase(user.user_profile.role)}</div>
      </svelte:fragment>
      
      <svelte:fragment slot="button">
        <ViewUserDialog user={user} />
      </svelte:fragment>
    </Card>
  {/each}
</div>