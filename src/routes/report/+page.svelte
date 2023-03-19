<script>
  import { userData, currentMonth, currentYear } from "$lib/stores.js";
  import {get as _get} from "lodash"
  import Fa from "svelte-fa/src/fa.svelte";
  import { faMoneyBills } from "@fortawesome/free-solid-svg-icons";
  import Tab, { Icon } from "@smui/tab";

  import {
    months,
    carbonOffsetMonth,
    offsetTotal,
    recalculateYear,
    growingTrees,
    grownTrees,
    treeTotal,
    costTotal
  } from "$lib/utils.js";
  import Button, { Group, Label } from "@smui/button";
  import Switch from "@smui/switch";
  import Dialog, { Title, Content } from "@smui/dialog";
  import List, { Item, Text } from "@smui/list";
  import CircularProgress from "@smui/circular-progress";

  import { capitaliseSingleWord } from "$lib/utils.js";

  let yearReport = false;
  $: month = months[$currentMonth];
  let openYear = false;
  let openMonth = false;

  $: newTreesMonth = _get($userData, `${currentYear}[${month}].trees`, 0)
  $: growingTreesMonth = growingTrees($userData, month, $currentYear);
  $: grownTreesMonth = grownTrees($userData, month, $currentYear);

  $: newTreesYear = treeTotal($userData, $currentYear)
  $: growingTreesYear = growingTrees($userData, "december", $currentYear);
  $: grownTreesYear = grownTrees($userData, "december", $currentYear);

  $: yearlyFootprint = $userData.profile.footprint;
  $: yearlyOffset = offsetTotal($userData, $currentYear);
  $: yearlyCost = costTotal($userData, $currentYear)

  $: monthlyFootprint = yearlyFootprint / 12;
  $: monthlyOffset = carbonOffsetMonth($userData, month, $currentYear, 0);
  $: monthlyCost = _get($userData, `${currentYear}[${month}].cost`, 0)

  $: recalculateYear(userData, $userData, $currentYear);

  $: percentageToNetZero = yearReport
    ? yearlyOffset / yearlyFootprint
    : monthlyOffset / monthlyFootprint;
  $: percentageCircle =
    percentageToNetZero > 0
      ? percentageToNetZero - parseInt(percentageToNetZero)
      : percentageToNetZero;
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
    <Group style="margin-top: 30px">
      {#if yearReport === false}
        <Button on:click={() => (openMonth = true)}
          ><Label>{month}</Label></Button
        >
      {/if}
      <Button on:click={() => (openYear = true)}
        ><Label>{$currentYear}</Label></Button
      >
    </Group>
  </div>
  <div class="content">
    <div class="item left">
      <Icon class="material-icons" style="margin-right: 25px; font-size: 3rem"
        >co2</Icon
      >
      <h2>
        {Math.round(yearReport ? yearlyOffset * 100 : monthlyOffset * 100) /
          100} Kg of CO<sub>2</sub> offset, from a footprint of {Math.round(
          yearReport ? yearlyFootprint * 100 : monthlyFootprint * 100
        ) / 100}&nbsp;Kg
      </h2>
    </div>
    <div class="item right">
      <h2>
        {yearReport ? growingTreesYear : growingTreesMonth} Growing Trees, offsetting
        {yearReport
          ? Math.round(yearlyOffset * 100 - grownTreesYear * 28.5 * 100) / 100
          : Math.round(monthlyOffset * 100 - grownTreesMonth * 28.5 * 100) /
            100} Kg of CO<sub>2</sub>
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
        {yearReport ? grownTreesYear : grownTreesMonth} Fully Grown Trees, offsetting
        {28.5 * yearReport ? grownTreesYear : grownTreesMonth} Kg of CO<sub
          >2</sub
        >
      </h2>
    </div>
    <div class="item right">
        <h2>
            {#if yearReport}
            ${yearlyCost + ' yearly'} cost, of which ${newTreesYear * 120} is upfront purchases and ${yearlyCost - newTreesYear * 120} is maintenance expenses
            {:else}
            ${monthlyCost + ' monthly'} cost, of which ${newTreesMonth * 120} is upfront purchases and ${monthlyCost - newTreesMonth * 120} is maintenance expenses
            {/if}
          
        </h2>
        
        <Fa icon={faMoneyBills} size=2.5x style="margin-left: 25px;"/>
      </div>
    <div style="display: flex; justify-content: space-between;" class="progress-circle">
      <CircularProgress
        class={percentageToNetZero >= 1 ? "my-colored-circle" : ""}
        style="min-height: 80px; min-width: 80px;"
        progress={percentageCircle}
      />
      <h2 style="margin-inline: 10px">
        {Math.round(percentageToNetZero * 1000) / 10}% of CO<sub>2</sub> offset this {yearReport
          ? "year"
          : "month"}
      </h2>
    </div>
  </div>
</div>

<style>
  .report {
    display: flex;
    padding: 20px;
    max-width: 600px;
    margin-inline: auto;
    justify-content: center;
    align-items: flex-start;
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
    margin-inline: auto;
    margin-top: 20px;
  }
</style>
