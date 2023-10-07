import { writable } from 'svelte/store';


const SelectedClientStore = writable<string>();

export default SelectedClientStore;