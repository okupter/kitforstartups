import { writable, type Writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'
import type { SelectSaleOverride } from '$lib/types/db.model';

export type Context<T> = Writable<T>;
export type EmployeeOptions = { name: string, value: string };

export const setEmployeeOptions = (options: EmployeeOptions[]) => {
  const emps = writable<EmployeeOptions[]>(options);
  setContext('employeeOptions', emps);
}

export const getEmployeeOptions = () => {
  return getContext<Context<EmployeeOptions[]>>('employeeOptions');
}

export const setSelectedEmployee = (employeeId: string) => {
  const emp = writable<string>(employeeId);
  setContext('selectedEmployee', emp);
}

export const getSelectedEmployee = () => {
  return getContext<Context<string>>('selectedEmployee');
}

export const setManualOverrides = (overrides: SelectSaleOverride[]) => {
  const ovr = writable<SelectSaleOverride[]>(overrides);
  setContext('pendingOverrides', ovr);
}

export const getManualOverrides = () => {
  return getContext<Context<SelectSaleOverride[]>>('pendingOverrides');
}