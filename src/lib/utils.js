import { update as _update, get as _get, set as _set } from "lodash";

const months = [
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

export const carbonOffsetMonth = (dataObj, calcMonth, calcYear, trees) => {
    let totalCarbon = 0;
    if (trees) {
        totalCarbon +=
          Math.round(trees * (1 / 60) * (1 / 12) * 28.5 * 100) / 100;
    }
    for (let year in dataObj) {
      if (year <= calcYear) {
        for (let month in dataObj[year]) {
          const yearsDiff = calcYear - year;
          const monthsDiff =
            new Date(`1 ${calcMonth} 1990`).getMonth() -
            new Date(`1 ${month} 1990`).getMonth();
          const totalMonthDiff = yearsDiff * 12 + monthsDiff;
          if (totalMonthDiff > 0 && totalMonthDiff < 60) {
            totalCarbon +=
              dataObj[year][month].trees *
              ((totalMonthDiff + 1) / 60) *
              (1 / 12) *
              28.5;
          } else if (totalMonthDiff >= 60) {
            totalCarbon += dataObj[year][month].trees * (1 / 12) * 28.5;
          }
        }
      }
    }
    return totalCarbon
  };

  export const costMonth = (dataObj, calcMonth, calcYear, trees) => {
    let totalMaintenance = 0;
    
    totalMaintenance += 120 * trees;
    
    for (let year in dataObj) {
      if (year <= calcYear) {
        for (let month in dataObj[year]) {
          const yearsDiff = calcYear - year;
          const monthsDiff =
            new Date(`1 ${calcMonth} 1990`).getMonth() -
            new Date(`1 ${month} 1990`).getMonth();
          const totalMonthDiff = yearsDiff * 12 + monthsDiff;
          if (totalMonthDiff > 0) {
            totalMaintenance += dataObj[year][month].trees * 1;
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