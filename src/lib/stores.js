import { writable } from "svelte/store";

export const darkMode = writable(false)

export const loading = writable(true)

export const userCountry = writable({
    country: "",
    "2020_co2": 0,
    "2021_co2": 0,
    abs_change: 0,
    perc_change: 0
  })

export const userOffset = writable(0)