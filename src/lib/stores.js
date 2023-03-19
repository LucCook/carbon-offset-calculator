import { writable } from "svelte/store";

import { carbonOffsetMonth, costMonth } from "$lib/utils";

export const darkMode = writable(false);

export const loading = writable(true);

export const userCountry = writable({
  country: "World",
  "2020_co2": 0,
  "2021_co2": 0,
  abs_change: 0,
  perc_change: 0,
});

export const userOffset = writable(0)

export const userData = writable({
  profile: {
    country: "World",
    footprint: 4690 
  }
})

let userDataObj
userData.subscribe((data) => {
  userDataObj = data
})



export const currentYear = writable(new Date().getFullYear())
export const currentMonth = writable(new Date().getMonth())