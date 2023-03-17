import { writable } from "svelte/store";

export const darkMode = writable(false);

export const loading = writable(true);

export const userCountry = writable({
  country: "",
  "2020_co2": 0,
  "2021_co2": 0,
  abs_change: 0,
  perc_change: 0,
});

export const userOffset = writable(0);

export const userTrees = writable({
  2023: {
    january: 0,
    february: 0,
    march: 0,
    april: 0,
    may: 0,
    june: 5,
    july: 6,
    august: 0,
    september: 0,
    october: 0,
    november: 0,
    december: 0,
  },
});

export const currentYear = writable(new Date().getFullYear())