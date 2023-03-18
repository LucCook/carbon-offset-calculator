<script>
  import { userTrees, userCountry, currentYear } from "$lib/stores.js";
  import { config } from "$lib/config.js";
  import Dialog, { Title, Content } from "@smui/dialog";
  import Button, { Label } from "@smui/button";
  import List, { Item, Text } from "@smui/list";
  import IconButton from "@smui/icon-button";
  import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
  import OffsetTableRow from "$lib/components/offsetTableRow.svelte";

  let open = false;
  let yearTreeTotal;

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

  function capitaliseSingleWord(string) {
    return `${string[0].toUpperCase()}${string.slice(1)}`;
  }

  function getNumberMonthsDiff(monthOne, yearOne, monthTwo, yearTwo) {
    return (
      new Date().getYear() - new Date(`1 ${monthOne} ${yearOne}`).getYear()
    );
  }

  $: if ($userTrees[$currentYear]) {
    yearTreeTotal = $userTrees[$currentYear]
      ? Object.values($userTrees[$currentYear]).reduce((a, b) => a + b)
      : 0;
  } else yearTreeTotal = 0;

  $: treesRemaining =
    $config["yearly_tree_limit"] - (yearTreeTotal ? yearTreeTotal : 0);
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
  <div class="year-selector">
    {#if $currentYear > new Date().getFullYear()}
    <IconButton
      on:click={() => currentYear.update((current) => (current -= 1))}
      class="material-icons">remove</IconButton
    >
    {/if}
    <Button on:click={() => (open = true)}><Label>{$currentYear}</Label></Button
    >
    <IconButton
      on:click={() => currentYear.update((current) => (current += 1))}
      class="material-icons">add</IconButton
    >
  </div>
  <div>Trees remaining: {treesRemaining}</div>
  <DataTable style="min-width: 360px; width: 100%; max-width: 600px;">
    <Head>
      <Row>
        <Cell style="padding-inline: 0"><div class="header">Month</div></Cell>
        <!-- <Cell style="padding-inline: 0"
          ><div class="header">
            Cumulative &nbsp;<span>CO<sub>2</sub></span>
          </div></Cell
        > -->
        <Cell style="padding-inline: 0"
          ><div class="header">Purchased Trees</div></Cell
        >
        <Cell style="padding-inline: 0"
          ><div class="header">
            <span>CO<sub>2</sub></span> &nbsp;Offset
          </div></Cell
        >
      </Row>
      {#each months as month, i}
        <OffsetTableRow month={month} i={i} treesRemaining={treesRemaining}/>
      {/each}
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
