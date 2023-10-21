<script lang="ts">
	import AddUserDialog from '$lib/components/AddUserDialog.svelte';
	import { Card } from '$lib/components';
	import { toProperCase } from '$lib/utils';
	import ViewUserDialog from '$lib/components/ViewUserDialog.svelte';
	import UserStore from '$lib/stores/user.js';

  export let data;
  
  if (data.users) UserStore.set(data.users);
</script>

<AddUserDialog />

<div class="max-w-4xl pt-8">
  <h3 class="text-3xl tracking-tight font-bold text-gray-900 sm:text-2xl">Users</h3>
</div>

<div class="flex flex-row justify-start gap-2 py-4">
  {#each $UserStore as user}
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