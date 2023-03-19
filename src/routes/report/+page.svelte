<script>
    import {userData, currentMonth, currentYear} from "$lib/stores.js"
    import {months, carbonOffsetMonth, offsetTotal, recalculateYear} from "$lib/utils.js"
    import Button, { Group, Label } from "@smui/button";
    import Switch from "@smui/switch";
    import Dialog, { Title, Content } from "@smui/dialog";
    import List, { Item, Text } from "@smui/list";
    import CircularProgress from '@smui/circular-progress';

    import {capitaliseSingleWord} from "$lib/utils.js"

    let yearReport = false
    $: month = months[$currentMonth]
    let openYear = false
    let openMonth = false

    let growingTrees
    let grownTrees
    
    $: yearlyFootprint = $userData.profile.footprint
    $: yearlyOffset = offsetTotal($userData, $currentYear)

    $: monthlyFootprint = yearlyFootprint/12
    $: monthlyOffset = carbonOffsetMonth($userData, month, $currentYear, 0)

    $: recalculateYear(userData, $userData, $currentYear)

    $: console.log(monthlyOffset)
    $: console.log(month + $currentYear)

    $: percentageToNetZero = yearReport ? yearlyOffset / yearlyFootprint : monthlyOffset / monthlyFootprint
    $: percentageCircle = percentageToNetZero > 0 ? percentageToNetZero - parseInt(percentageToNetZero) : percentageToNetZero
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
            recalculateYear(userData, $userData, item)
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
<label for="report-mode-toggle" class="switch-container">
    <div>
        Monthly
    </div>
    <Switch
      bind:checked={yearReport}
      color="primary"
      icons={false}
      id="report-mode-toggle"
    />
    <div>
        Yearly
    </div>
  </label>
  <Group>
    {#if yearReport === false}
    <Button on:click={() => (openMonth = true)}><Label>{month}</Label></Button>
    {/if}
    <Button on:click={() => (openYear = true)}><Label>{$currentYear}</Label></Button>
  </Group>
  <div style="display: flex; justify-content: space-between;">
    <CircularProgress class={percentageToNetZero >= 1 ? "my-colored-circle" : ""} style="min-height: 80px; min-width: 80px; margin-left: 20px;" progress={percentageCircle}/>
    <h2 style="margin-inline: 10px">{Math.round(percentageToNetZero * 1000) / 10}% of carbon offsetted this {yearReport ? "year" : "month"}</h2>
  </div>
</div>

<style>
    .report {
        display: flex;
        padding: 20px;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .switch-container {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  </style>