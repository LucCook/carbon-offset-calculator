<script>
  import { userCountry, currentYear, userData } from "$lib/stores.js";
  import { config } from "$lib/config.js";
  import Dialog, { Title, Content } from "@smui/dialog";
  import Button, { Label } from "@smui/button";
  import List, { Item, Text } from "@smui/list";
  import IconButton from "@smui/icon-button";
  import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
  import OffsetTableRow from "$lib/components/offsetTableRow.svelte";
  import { recalculateYear, treeTotal, costTotal, offsetTotal } from "$lib/utils";

  let open = false;
  
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

  $: treesRemaining = $config["yearly_tree_limit"] - treeTotal($userData, $currentYear);
</script>

<Dialog
  bind:open
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
            open = false;
          }}
        >
          <Text>{item}</Text>
        </Item>
      {/each}
    </List>
  </Content>
</Dialog>
<div class="offset">
  <button on:click={console.log($userData)}>click me!</button>
  <div class="year-selector">
    {#if $currentYear > new Date().getFullYear()}
      <IconButton
        on:click={() => {
          currentYear.update((current) => (current -= 1))
          recalculateYear(userData, $userData, $currentYear - 1)  
        }}
        class="material-icons">remove</IconButton
      >
    {/if}
    <Button on:click={() => (open = true)}><Label>{$currentYear}</Label></Button
    >
    <IconButton
      on:click={() => {
        currentYear.update((current) => (current += 1))
        console.log($currentYear)
        recalculateYear(userData, $userData, $currentYear)  
      }}
      class="material-icons">add</IconButton
    >
  </div>
  <div>Trees remaining: {treesRemaining}</div>
  <DataTable style="min-width: 360px; width: 100%; max-width: 600px;">
    <Head>
      <Row>
        <Cell style="padding-inline: 0"><div class="header">Month</div></Cell>
        <Cell style="padding-inline: 0"
          ><div class="header">Purchased Trees</div></Cell
        >
        <Cell style="padding-inline: 0"
          ><div class="header">
            <span>CO<sub>2</sub></span> &nbsp;Offset
          </div></Cell
        >
        <Cell style="padding-inline: 0"
          ><div class="header">Monthly Cost</div></Cell
        >
      </Row>
      {#each months as month, i}
        <OffsetTableRow {month} {i} {treesRemaining} />
      {/each}
      <Row>
        <Cell><div class="header">Total</div></Cell>
        <Cell><div class="header">{treeTotal($userData, $currentYear)} Tree(s)</div></Cell>
        <Cell><div class="header">{offsetTotal($userData, $currentYear)} Kg</div></Cell>
        <Cell><div class="header">${costTotal($userData, $currentYear)}</div></Cell>
      </Row>
    </Head>
  </DataTable>
</div>

<style>
  .year-selector {
    display: flex;
    align-items: center;
  }
  .offset {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .header {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    box-sizing: border-box;
    margin-inline: 5px;
  }
</style>
