<script lang="ts">
  import { page } from '$app/stores';
	import EmployeeNotes from '$lib/components/EmployeeNotes.svelte';
	import MaskInput from '$lib/components/MaskInput.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import type { EmployeeWithNotes } from '$lib/types/db.model.js';
	export let data;
  
  // how you read the id param from the url 
  
  let { ee, campaigns } = data;
  const { employeeProfile: profile, employeeCodes: codes, ...employee } = (ee || { employeeProfile: null }) as EmployeeWithNotes;
  
  campaigns = campaigns || [];
  
  const getCodeForCampaign = (campaignId: string) => {
    const code = codes?.find(c => c.campaignId === campaignId);
    return code?.employeeCode || '';
  }
</script>

<form action="?/save" method="post">
  <div class="space-y-12 bg-background-100 border-gray-100 border dark:border-gray-800 shadow-lg rounded-2xl p-6">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-gray-900 dark:text-gray-50">Profile</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-100">This information is private and used for employee management purposes.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <!-- <div class="sm:col-span-4">
          <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
          <div class="mt-2">
            <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-600 sm:max-w-md">
              <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span>
              <input type="text" name="username" id="username" autocomplete="username" class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="janesmith">
            </div>
          </div>
        </div> -->

        <div class="col-span-full">
          <EmployeeNotes notes={employee?.employeeNotes} employeeId={$page.params.id} />
          <!-- <p class="mt-3 text-sm leading-6 text-gray-600">Critical information about the employee.</p> -->
        </div>

        <!-- <div class="col-span-full">
          <label for="photo" class="block text-sm font-medium leading-6 text-gray-900">Photo</label>
          <div class="mt-2 flex items-center gap-x-3">
            <svg class="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
            </svg>
            <button type="button" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Change</button>
          </div>
        </div>

        <div class="col-span-full">
          <label for="cover-photo" class="block text-sm font-medium leading-6 text-gray-900">Cover photo</label>
          <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
              </svg>
              <div class="mt-4 flex text-sm leading-6 text-gray-600">
                <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-900 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-500">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only">
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div> -->
      </div>
    </div>

    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-gray-900 dark:text-gray-50">Personal Information</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-100">Use a permanent address where you can receive mail.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-3">
          <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50">First name</label>
          <div class="mt-2">
            <input type="text" name="first-name" id="first-name"
              value={employee?.firstName}
              autocomplete="given-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-200 sm:text-sm sm:leading-6 dark:bg-neutral-700"
              required  
            >
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="last-name" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50">Last name</label>
          <div class="mt-2">
            <input type="text" name="last-name" id="last-name" 
              value={employee?.lastName}
              autocomplete="family-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-200 sm:text-sm sm:leading-6 dark:bg-neutral-700"
              required  
            >
          </div>
        </div>

        <div class="sm:col-span-4">
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50">Email address</label>
          <div class="mt-2">
            <input id="email" name="email" type="email" 
              value={profile?.email}
              autocomplete="email" class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-200 sm:text-sm sm:leading-6 dark:bg-neutral-700"
              required 
            />
          </div>
        </div>
        
        <div class="sm:col-span-3">
          <label for="phone" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50">Phone number</label>
          <div class="mt-2">
            <MaskInput alwaysShowMask mask={'1-000-000-0000'} size={20} showMask maskChar="_" 
              value={profile?.phone}
              id="phone" name="phone" type="phone"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-200 sm:text-sm sm:leading-6 dark:bg-neutral-700"
              required
            />
            <!-- <input id="phone" name="phone" type="phone" 
              value={profile?.phone}
              autocomplete="phone" class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-200 sm:text-sm sm:leading-6"> -->
          </div>
        </div>
        
        <div class="sm:col-span-3">
          <label for="phone2" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50">Secondary phone</label>
          <div class="mt-2">
            <MaskInput id="phone2" name="phone2" type="phone2" 
              alwaysShowMask mask={'1-000-000-0000'} size={20} showMask maskChar="_" 
              value={profile?.phone2 || ''}
              autocomplete="phone2" class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-200 sm:text-sm sm:leading-6 dark:bg-neutral-700" />
          </div>
        </div>

        <!-- <div class="sm:col-span-3">
          <label for="country" class="block text-sm font-medium leading-6 text-gray-900">Country</label>
          <div class="mt-2">
            <select id="country" name="country" autocomplete="country-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:max-w-xs sm:text-sm sm:leading-6">
              <option>United States</option>
              <option>Canada</option>
              <option>Mexico</option>
            </select>
          </div>
        </div> -->

        <div class="col-span-full">
          <label for="street-address" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50">Street address</label>
          <div class="mt-2">
            <input type="text" name="street-address" id="street-address" 
              value={profile?.address}
              autocomplete="street-address" class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-200 sm:text-sm sm:leading-6 dark:bg-neutral-700">
          </div>
        </div>

        <div class="sm:col-span-2 sm:col-start-1">
          <label for="city" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50">City</label>
          <div class="mt-2">
            <input type="text" name="city" id="city" 
              value={profile?.city}
              autocomplete="address-level2" class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-200 sm:text-sm sm:leading-6 dark:bg-neutral-700">
          </div>
        </div>

        <div class="sm:col-span-2">
          <label for="region" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50">State / Province</label>
          <div class="mt-2">
            <input type="text" name="region" id="region" 
              value={profile?.state}
              autocomplete="address-level1" class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-200 sm:text-sm sm:leading-6 dark:bg-neutral-700">
          </div>
        </div>

        <div class="sm:col-span-2">
          <label for="postal-code" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50">ZIP / Postal code</label>
          <div class="mt-2">
            <input type="text" name="postal-code" id="postal-code" 
              value={profile?.zip}
              autocomplete="postal-code" class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-200 sm:text-sm sm:leading-6 dark:bg-neutral-700">
          </div>
        </div>
      </div>
    </div>
    
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-gray-900 dark:text-gray-50">Sales Codes</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-100">
        Sales codes are used to track sales and commissions. 
        <br>
        <span class="text-xs text-gray-400 dark:text-gray-50">*Sales codes are not required.</span>
      </p>
      
      {#if campaigns?.length}
        <div class="flex mt-10 sm:gap-1 md:gap-6">
          {#each campaigns as campaign}
            <!-- content here -->
            <fieldset>
              <legend class="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50">{campaign?.name}</legend>
              <div class="space-y-6">
                <div class="relative flex gap-x-3">
                  <div class="flex items-center">
                    <input name={'code_campaign_' + campaign?.id} type="text" 
                      value={getCodeForCampaign(campaign?.id)}
                      class="rounded border-gray-300 text-900 focus:ring-primary-600 dark:border-gray-100 dark:text-100 dark:focus:ring-primary-200 max-w-[120px] dark:bg-neutral-700">
                  </div>
                </div>
              </div>
            </fieldset>
          {/each}
        </div>
      {/if}
    </div>

    <!-- <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600">We'll always let you know about important changes, but you pick what else you want to hear about.</p>

      <div class="mt-10 space-y-10">
        <fieldset>
          <legend class="text-sm font-semibold leading-6 text-gray-900">By Email</legend>
          <div class="mt-6 space-y-6">
            <div class="relative flex gap-x-3">
              <div class="flex h-6 items-center">
                <input id="comments" name="comments" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-900 focus:ring-primary-600">
              </div>
              <div class="text-sm leading-6">
                <label for="comments" class="font-medium text-gray-900">Comments</label>
                <p class="text-gray-500">Get notified when someones posts a comment on a posting.</p>
              </div>
            </div>
            <div class="relative flex gap-x-3">
              <div class="flex h-6 items-center">
                <input id="candidates" name="candidates" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-900 focus:ring-primary-600">
              </div>
              <div class="text-sm leading-6">
                <label for="candidates" class="font-medium text-gray-900">Candidates</label>
                <p class="text-gray-500">Get notified when a candidate applies for a job.</p>
              </div>
            </div>
            <div class="relative flex gap-x-3">
              <div class="flex h-6 items-center">
                <input id="offers" name="offers" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-900 focus:ring-primary-600">
              </div>
              <div class="text-sm leading-6">
                <label for="offers" class="font-medium text-gray-900">Offers</label>
                <p class="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend class="text-sm font-semibold leading-6 text-gray-900">Push Notifications</legend>
          <p class="mt-1 text-sm leading-6 text-gray-600">These are delivered via SMS to your mobile phone.</p>
          <div class="mt-6 space-y-6">
            <div class="flex items-center gap-x-3">
              <input id="push-everything" name="push-notifications" type="radio" class="h-4 w-4 border-gray-300 text-900 focus:ring-primary-600">
              <label for="push-everything" class="block text-sm font-medium leading-6 text-gray-900">Everything</label>
            </div>
            <div class="flex items-center gap-x-3">
              <input id="push-email" name="push-notifications" type="radio" class="h-4 w-4 border-gray-300 text-900 focus:ring-primary-600">
              <label for="push-email" class="block text-sm font-medium leading-6 text-gray-900">Same as email</label>
            </div>
            <div class="flex items-center gap-x-3">
              <input id="push-nothing" name="push-notifications" type="radio" class="h-4 w-4 border-gray-300 text-900 focus:ring-primary-600">
              <label for="push-nothing" class="block text-sm font-medium leading-6 text-gray-900">No push notifications</label>
            </div>
          </div>
        </fieldset>
      </div>
    </div> -->
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button type="button" class="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50">Cancel</button>
      <SubmitButton text="Save" />
      <!-- <button type="submit" class="rounded-md bg-primary-600 dark:bg-primary-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 dark:hover:bg-primary-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-200">Save</button> -->
    </div>
  </div>
</form>