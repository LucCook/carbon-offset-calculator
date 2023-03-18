import { writable } from "svelte/store";

export const config = writable({
    tree_cost: 120,
    tree_offset_max: 28.5,
    tree_growth_months: 60,
    maintenance_percent: 10,
    yearly_tree_limit: 55,
    min_year: 2023,
    max_year: 2035
})