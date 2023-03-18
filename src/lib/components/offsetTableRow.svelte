<script>
  import { Row, Cell } from "@smui/data-table";
  import IconButton from "@smui/icon-button";
  import { currentYear, userTrees } from "$lib/stores.js";

  export let month;
  export let treesRemaining;

  function capitaliseSingleWord(string) {
    return `${string[0].toUpperCase()}${string.slice(1)}`;
  }

  $: carbonOffsetNewTrees = (calcMonth) => {
    if ($userTrees[$currentYear]) {
      const numberOfTrees = $userTrees[$currentYear][calcMonth];
      if (numberOfTrees) {
        return (
          Math.round(numberOfTrees * (1 / 60) * (1 / 12) * 28.5 * 100) / 100
        );
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  };

  $: carbonOffsetOldTrees = (calcMonth, calcYear) => {
    let totalCarbon = 0;
    for (let year in $userTrees) {
      if (year <= calcYear) {
        console.log(year);
        for (let month in $userTrees[year]) {
          const yearsDiff = calcYear - year;
          const monthsDiff =
            new Date(`1 ${calcMonth} 1990`).getMonth() -
            new Date(`1 ${month} 1990`).getMonth();
          const totalMonthDiff = yearsDiff * 12 + monthsDiff;
          if (totalMonthDiff > 0 && totalMonthDiff < 60) {
            totalCarbon +=
              $userTrees[year][month] *
              ((totalMonthDiff + 1) / 60) *
              (1 / 12) *
              28.5;
          } else if (totalMonthDiff >= 60) {
            totalCarbon += $userTrees[year][month] * (1 / 12) * 28.5;
          }
          console.log(calcMonth + " " + month + " " + totalMonthDiff);
        }
      }
    }
    return Math.round(totalCarbon * 100) / 100;
  };

  $: monthlyTrees = (monthToRetrieve) => {
    if ($userTrees[$currentYear] && $userTrees[$currentYear][monthToRetrieve]) {
      return $userTrees[$currentYear][monthToRetrieve];
    } else {
      return 0;
    }
  };
</script>

<Row>
  <Cell style="padding-inline: 0; width: 25%;"
    ><div class="cell">{capitaliseSingleWord(month)}</div></Cell
  >
  <Cell style="padding-inline: 0; width: 50%;">
    <div class="tree-container">
      <IconButton
        class="material-icons"
        on:click={() => {
          if (monthlyTrees(month) > 0) {
            $userTrees[$currentYear][month] -= 1;
          }
        }}
        size="button">remove</IconButton
      >
      <div>
        {monthlyTrees(month)}
      </div>
      <IconButton
        class="material-icons"
        on:click={() => {
          if (treesRemaining > 0) {
            if ($userTrees[$currentYear]) {
              if ($userTrees[$currentYear][month]) {
                $userTrees[$currentYear][month] += 1;
              } else {
                $userTrees[$currentYear][month] = 1;
              }
            } else {
              $userTrees[$currentYear] = {};
              $userTrees[$currentYear][month] = 1;
            }
            userTrees.set($userTrees);
          }
        }}
        size="button">add</IconButton
      >
    </div>
  </Cell>
  <Cell style="width: 25%;">
    <div class="cell">
      {Math.round(
        (carbonOffsetNewTrees(month) +
          carbonOffsetOldTrees(month, $currentYear)) *
          100
      ) / 100}
      Kg
    </div>
  </Cell>
</Row>

<style>
  .tree-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .cell {
    display: flex;
    width: 100%;
    justify-content: center;
  }
</style>
