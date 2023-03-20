import _ from "lodash";
const {update: _update, get: _get, set: _set} = _
import { config } from "$lib/config";

let options
config.subscribe((config) => {
    options = config
})

export const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

export const recalculateYear = (store, storeDataObj, year) => {
    for (const month of months) {
        _update(storeDataObj, `${year}[${month}]`, (n) => {
            return n ? {
              trees: 0, 
              ...n, 
              offset: carbonOffsetMonth(storeDataObj, month, year, n.trees), 
              cost: costMonth(storeDataObj, month, year, n.trees)
            } : {
                trees: 0, 
              offset: carbonOffsetMonth(storeDataObj, month, year, 0), 
              cost: costMonth(storeDataObj, month, year, 0)
            }
        })
    }
    store.set(storeDataObj)
  }

export const growingTrees = (dataObj, calcMonth, calcYear) => {
  let totalTrees = 0
  for (let year in dataObj) {
    if (year <= calcYear) {
      for (let month in dataObj[year]) {
        const yearsDiff = calcYear - year;
          const monthsDiff =
            new Date(`1 ${calcMonth} 1990`).getMonth() -
            new Date(`1 ${month} 1990`).getMonth();
          const totalMonthDiff = yearsDiff * 12 + monthsDiff;
          if (totalMonthDiff >= 0 && totalMonthDiff < options.tree_growth_months) {
            totalTrees +=
              dataObj[year][month].trees
          }
      }
    }
  }
  return totalTrees
}

export const grownTrees = (dataObj, calcMonth, calcYear) => {
  let totalTrees = 0
  for (let year in dataObj) {
    if (year <= calcYear) {
      for (let month in dataObj[year]) {
        const yearsDiff = calcYear - year;
          const monthsDiff =
            new Date(`1 ${calcMonth} 1990`).getMonth() -
            new Date(`1 ${month} 1990`).getMonth();
          const totalMonthDiff = yearsDiff * 12 + monthsDiff;
          if (totalMonthDiff >= options.tree_growth_months) {
            totalTrees +=
              dataObj[year][month].trees
          }
      }
    }
  }
  return totalTrees
}

export const carbonOffsetMonth = (dataObj, calcMonth, calcYear, trees) => {
    let totalCarbon = 0;
    if (trees) {
        totalCarbon +=
          Math.round(trees * (1 / options.tree_growth_months) * (1 / 12) * options.tree_offset_max * 100) / 100;
    }
    for (let year in dataObj) {
      if (year <= calcYear) {
        for (let month in dataObj[year]) {
          const yearsDiff = calcYear - year;
          const monthsDiff =
            new Date(`1 ${calcMonth} 1990`).getMonth() -
            new Date(`1 ${month} 1990`).getMonth();
          const totalMonthDiff = yearsDiff * 12 + monthsDiff;
          if (totalMonthDiff > 0 && totalMonthDiff < options.tree_growth_months) {
            totalCarbon +=
              dataObj[year][month].trees *
              ((totalMonthDiff + 1) / options.tree_growth_months) *
              (1 / 12) *
              options.tree_offset_max;
          } else if (totalMonthDiff >= options.tree_growth_months) {
            totalCarbon += dataObj[year][month].trees * (1 / 12) * options.tree_offset_max;
          }
        }
      }
    }
    return totalCarbon
  };

  export const costMonth = (dataObj, calcMonth, calcYear, trees) => {
    let totalMaintenance = 0;
    
    totalMaintenance += options.tree_cost * trees;
    
    for (let year in dataObj) {
      if (year <= calcYear) {
        for (let month in dataObj[year]) {
          const yearsDiff = calcYear - year;
          const monthsDiff =
            new Date(`1 ${calcMonth} 1990`).getMonth() -
            new Date(`1 ${month} 1990`).getMonth();
          const totalMonthDiff = yearsDiff * 12 + monthsDiff;
          if (totalMonthDiff > 0) {
            totalMaintenance += dataObj[year][month].trees * options.tree_cost * (options.maintenance_percent / 100) ;
          }
        }
      }
    }
    return totalMaintenance;
  };

  export const treeTotal = (storeDataObj, year) => {
    let total = 0
      for (let month in storeDataObj[year]) {
        total += storeDataObj[year][month].trees
      }
    return total
  }

  export const treeMonthTotal = (storeDataObj, calcMonth, calcYear) => {
    let total = 0
    for (let year in storeDataObj)
      if (year <= calcYear) {
        for (let month in storeDataObj[year]) {
          const yearsDiff = calcYear - year;
          const monthsDiff =
            new Date(`1 ${calcMonth} 1990`).getMonth() -
            new Date(`1 ${month} 1990`).getMonth();
          const totalMonthDiff = yearsDiff * 12 + monthsDiff;
          if (totalMonthDiff >= 0) {
            total += storeDataObj[year][month].trees
          }   
        }
      }
    return total
  }

  export const grownTreesYearOffsetCalc = (storeDataObj, year) => {
    let totalOffset = 0
    for (const month in storeDataObj[year]) {
      totalOffset += grownTrees(storeDataObj, month, year) * options.tree_offset_max * (1 / 12)
    }
    return totalOffset
  }

  export const offsetTotal = (storeDataObj, year) => {
    let total = 0
      for (let month in storeDataObj[year]) {
        total += storeDataObj[year][month].offset
      }
    
    return Math.round(total * 100) / 100
  }

  export const costTotal = (storeDataObj, year) => {
    let total = 0
    for (let month in storeDataObj[year]) {
        total += storeDataObj[year][month].cost
      }
    
    return Math.round(total * 100) / 100
  }

  export const capitaliseSingleWord = (string) => {
    return `${string[0].toUpperCase()}${string.slice(1)}`;
  }