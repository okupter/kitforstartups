import type { User } from '$lib/types/db.model';
import { writable } from 'svelte/store';

const UserStore = writable<User[]>([]);

export default UserStore;