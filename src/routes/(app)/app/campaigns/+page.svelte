<script lang="ts">
  import { page } from '$app/stores';
  export let data;
  
  const campaigns = data.campaigns?.map(campaign => ({
    ...campaign,
    created: Number(campaign.created),
    updated: Number(campaign.updated),
  }));
</script>

<p>
  {JSON.stringify(campaigns)}
</p>