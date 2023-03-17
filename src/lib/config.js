import { writable } from "svelte/store";

export const config = writable({
    tree_cost: 120,
    maintenance_percent: 10,
    yearly_tree_limit: 55,
})