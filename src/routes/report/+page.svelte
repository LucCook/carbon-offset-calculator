<script>
  import { userData, currentMonth, currentYear } from "$lib/stores.js";
  import { get as _get } from "lodash";
  import Fa from "svelte-fa/src/fa.svelte";
  import {
    faMoneyBills,
    faCaretLeft,
    faCaretRight,
  } from "@fortawesome/free-solid-svg-icons";
  import { Icon } from "@smui/tab";

  import {
    months,
    carbonOffsetMonth,
    offsetTotal,
    recalculateYear,
    growingTrees,
    grownTrees,
    treeTotal,
    costTotal,
  } from "$lib/utils.js";
  import Button, { Group, Label } from "@smui/button";
  import IconButton from "@smui/icon-button";
  import Switch from "@smui/switch";
  import Dialog, { Title, Content } from "@smui/dialog";
  import List, { Item, Text } from "@smui/list";
  import CircularProgress from "@smui/circular-progress";

  import { capitaliseSingleWord } from "$lib/utils.js";
  import { config } from "$lib/config";
  import FrappeCharts from "$lib/components/frappeCharts.svelte";

  let yearReport = true;
  $: month = months[$currentMonth];
  let openYear = false;
  let openMonth = false;

  $: newTreesMonth = _get($userData, `${$currentYear}[${month}].trees`, 0);
  $: newTreesMonthCost = newTreesMonth * 120;
  $: growingTreesMonth = growingTrees($userData, month, $currentYear);
  $: growingTreesMonthOffset =
    monthlyOffset - grownTreesMonth * 28.5 * (1 / 12);
  $: grownTreesMonth = grownTrees($userData, month, $currentYear);
  $: grownTreesMonthOffset = (grownTreesMonth * 28.5 * (1 / 12)).toFixed(2);

  $: newTreesYear = treeTotal($userData, $currentYear);
  $: newTreesYearCost = newTreesMonth * 120;
  $: growingTreesYear = growingTrees($userData, "december", $currentYear);
  $: growingTreesYearOffset = yearlyOffset - grownTreesYear * 28.5;
  $: grownTreesYear = grownTrees($userData, "december", $currentYear);
  $: grownTreesYearOffset = (grownTreesYear * 28.5).toFixed(2);

  $: yearlyFootprint = $userData.profile.footprint;
  $: yearlyOffset = offsetTotal($userData, $currentYear);
  $: yearlyCost = costTotal($userData, $currentYear);

  $: monthlyFootprint = yearlyFootprint / 12;
  $: monthlyOffset = carbonOffsetMonth(
    $userData,
    month,
    $currentYear,
    newTreesMonth
  );
  $: monthlyCost = _get($userData, `${$currentYear}[${month}].cost`, 0);

  $: recalculateYear(userData, $userData, $currentYear);

  $: percentageToNetZero = yearReport
    ? yearlyOffset / yearlyFootprint
    : monthlyOffset / monthlyFootprint;
  $: percentageCircle =
    percentageToNetZero > 0
      ? percentageToNetZero - parseInt(percentageToNetZero)
      : percentageToNetZero;

  const animateNumber = async (displayNumber, sourceValue) => {
    let displayRounded = Math.round(displayNumber * 10000) / 10000;
    const sourceRounded = Math.round(sourceValue * 10000) / 10000;
    return await new Promise((resolve) => setTimeout(resolve, 10)).then(() => {
      if (displayRounded !== sourceRounded) {
        displayRounded += (sourceRounded - displayRounded) / 10;
      }
      return displayRounded;
    });
  };

  const handleNext = () => {
    if (yearReport) {
      currentYear.update((year) => year + 1);
      recalculateYear(userData, $userData, $currentYear);
    } else {
      if ($currentMonth !== 11) {
        currentMonth.update((month) => month + 1);
      } else {
        currentYear.update((year) => year + 1);
        currentMonth.set(0);
      }
    }
  };

  const handlePrevious = () => {
    if (yearReport) {
      if ($currentYear > $config.min_year) currentYear.update((year) => year - 1);
    } else {
      if ($currentMonth !== 0) {
        currentMonth.update((month) => month - 1);
      } else if ($currentYear > $config.min_year) {
        currentYear.update((year) => year - 1);
        currentMonth.set(11);
      }
    }
  }

  let offSetToDisplay = 0;
  $: animateNumber(
    offSetToDisplay,
    yearReport ? yearlyOffset : monthlyOffset
  ).then((value) => {
    offSetToDisplay = value;
  });
  let footprintToDisplay = 0;
  $: animateNumber(
    footprintToDisplay,
    yearReport ? yearlyFootprint : monthlyFootprint
  ).then((value) => {
    footprintToDisplay = value;
  });
  let growingTreesToDisplay = 0;
  $: animateNumber(
    growingTreesToDisplay,
    yearReport ? growingTreesYear : growingTreesMonth
  ).then((value) => {
    growingTreesToDisplay = value;
  });
  let grownTreesToDisplay = 0;
  $: animateNumber(
    grownTreesToDisplay,
    yearReport ? grownTreesYear : grownTreesMonth
  ).then((value) => {
    grownTreesToDisplay = value;
  });
  let growingTreesOffsetToDisplay = 0;
  $: animateNumber(
    growingTreesOffsetToDisplay,
    yearReport ? growingTreesYearOffset : growingTreesMonthOffset
  ).then((value) => {
    growingTreesOffsetToDisplay = value;
  });
  let grownTreesOffsetToDisplay = 0;
  $: animateNumber(
    grownTreesOffsetToDisplay,
    yearReport ? grownTreesYearOffset : grownTreesMonthOffset
  ).then((value) => {
    grownTreesOffsetToDisplay = value;
  });
  let costToDisplay = 0;
  $: animateNumber(costToDisplay, yearReport ? yearlyCost : monthlyCost).then(
    (value) => {
      costToDisplay = value;
    }
  );
  let newTreesToDisplay = 0;
  $: animateNumber(
    newTreesToDisplay,
    yearReport ? newTreesYear : newTreesMonth
  ).then((value) => {
    newTreesToDisplay = value;
  });
</script>

<div class="report">
  <Dialog
    bind:open={openYear}
    selection
    aria-labelledby="list-title"
    aria-describedby="list-content"
  >
    <Title id="list-title">Select Year</Title>
    <Content id="list-content">
      <List>
        {#each [...Array(11)].map((_v, i) => new Date().getFullYear() + i) as item}
          <Item
            on:click={() => {
              currentYear.set(item);
              recalculateYear(userData, $userData, item);
              openYear = false;
            }}
          >
            <Text>{item}</Text>
          </Item>
        {/each}
      </List>
    </Content>
  </Dialog>
  <Dialog
    bind:open={openMonth}
    selection
    aria-labelledby="list-title"
    aria-describedby="list-content"
  >
    <Title id="list-title">Select Month</Title>
    <Content id="list-content">
      <List>
        {#each months as item, i}
          <Item
            on:click={() => {
              currentMonth.set(i);
              openMonth = false;
            }}
          >
            <Text>{capitaliseSingleWord(item)}</Text>
          </Item>
        {/each}
      </List>
    </Content>
  </Dialog>
  <div class="controls">
    <label for="report-mode-toggle" class="switch-container">
      <div>Monthly</div>
      <Switch
        bind:checked={yearReport}
        color="primary"
        icons={false}
        id="report-mode-toggle"
      />
      <div>Yearly</div>
    </label>
    <Group style="margin-top: 30px; display: flex; align-items: center;">
      <IconButton class="material-icons" on:click={handlePrevious}
      disabled={yearReport ? $currentYear <= $config.min_year : $currentYear <= $config.min_year && month === months[0]}><Fa icon={faCaretLeft} color={$currentYear <= $config.min_year && (yearReport || month === months[0]) ? "var(--secondary)" : "var(--primary)"} /></IconButton
      >
      {#if yearReport === false}
        <Button on:click={() => (openMonth = true)}
          ><Label>{month}</Label></Button
        >
      {/if}
      <Button on:click={() => (openYear = true)}
        ><Label>{$currentYear}</Label></Button
      >
      <IconButton class="material-icons" on:click={handleNext}
        ><Fa icon={faCaretRight} color={"var(--primary)"} /></IconButton
      >
    </Group>
  </div>
  <div class="content">
    <div class="item left">
      <Icon class="material-icons" style="margin-right: 25px; font-size: 3rem"
        >co2</Icon
      >
      <h2>
        {offSetToDisplay.toFixed(2)} Kg of CO<sub>2</sub> offset, from a
        footprint of {footprintToDisplay.toFixed(0)}&nbsp;Kg
      </h2>
    </div>
    <div class="item right">
      <h2>
        {growingTreesToDisplay.toFixed(0)} Growing Trees, offsetting
        {growingTreesOffsetToDisplay.toFixed(2)}&nbsp;Kg of CO<sub>2</sub>
      </h2>
      <Icon class="material-icons" style="margin-left: 25px; font-size: 3rem"
        >park</Icon
      >
    </div>
    <div class="item left">
      <Icon class="material-icons" style="margin-right: 25px; font-size: 3rem"
        >forest</Icon
      >
      <h2>
        {grownTreesToDisplay.toFixed(0)} Fully Grown Trees, offsetting
        {grownTreesOffsetToDisplay.toFixed(2)}&nbsp;Kg of CO<sub>2</sub>
      </h2>
    </div>
    <div class="item right">
      <h2>
        ${costToDisplay.toFixed(0)}
        {yearReport ? "yearly" : "monthly"} cost, of which ${newTreesToDisplay.toFixed(
          0
        ) * 120} is upfront purchases and ${costToDisplay.toFixed(0) -
          newTreesToDisplay.toFixed(0) * 120} is maintenance expenses
      </h2>

      <Fa icon={faMoneyBills} size="2.5x" style="margin-left: 25px;" />
    </div>
    <div class="progress-circle">
      <CircularProgress
        class={percentageToNetZero >= 1
          ? "my-colored-circle-complete"
          : "my-colored-circle"}
        style="min-height: 80px; min-width: 80px;"
        progress={percentageCircle}
      />
      <h2 class="label">
        {(percentageToNetZero * 100).toFixed(2)}% of CO<sub>2</sub> offset
        this {yearReport ? "year" : "month"}
      </h2>
    </div>
  </div>
  <FrappeCharts />
</div>

<style>
  .report {
    display: flex;
    padding: 20px;
    max-width: 600px;
    margin-inline: auto;
    justify-content: center;
    flex-direction: column;
  }
  .controls {
    display: flex;
    flex-direction: column;
    margin-inline: auto;
    align-items: center;
  }
  .switch-container {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .content {
    padding-inline: 20px;
    display: flex;
    flex-direction: column;
  }
  .item {
    display: flex;
    align-items: center;
    margin-block: 5%;
  }
  .right {
    margin-left: 15%;
  }
  .left {
    margin-right: 15%;
  }
  .progress-circle {
    max-width: 650px;
    margin-inline: 20px;
    margin-top: 20px;
    display: flex;
  }
  .label {
    margin-inline: 10px;
    padding-block: 10px;
  }
</style>
