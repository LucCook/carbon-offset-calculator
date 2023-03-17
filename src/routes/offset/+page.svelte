<script>
  import { userTrees, userCountry, currentYear } from "$lib/stores.js";
  import { config } from "$lib/config.js";
  import Dialog, { Title, Content } from "@smui/dialog";
  import Button, { Label } from "@smui/button";
  import List, { Item, Text } from "@smui/list";
  import IconButton from "@smui/icon-button";
  import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';

  let open = false;
  let yearTreeTotal;
  let treeObject

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  userTrees.subscribe((trees) => {
    treeObject = trees
  })
  console.log(new Date("January 1, 2023"))
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
      {#each [...Array(30)].map((_v, i) => 2035 - i) as item}
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
    <IconButton
      on:click={() => currentYear.update((current) => (current -= 1))}
      class="material-icons">remove</IconButton
    >
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
        <Cell style="padding-inline: 0"><div class="header" >Cumulative &nbsp;<span>CO<sub>2</sub></span> &nbsp;(tonnes)</div></Cell>
        <Cell style="padding-inline: 0"><div class="header" >Purchased Trees</div></Cell>
        <Cell style="padding-inline: 0"><div class="header" ><span>CO<sub>2</sub></span> &nbsp;Offset</div></Cell>
      </Row>
      {#each months as month, i}
      
      <Row>
        <Cell style="padding-inline: 0"><div class="cell">{month}</div></Cell>
        <Cell style="padding-inline: 0"><div class="cell">
          {Math.round(($userCountry["2021_co2"] / 12) * (i + 1) * 100) / 100}
        </div>
        </Cell>
        <Cell style="padding-inline: 0">
          <div class="tree-container">
            <IconButton class="material-icons" on:click={() => {
              if ($userTrees[$currentYear] && $userTrees[$currentYear][month.toLowerCase()] && $userTrees[$currentYear][month.toLowerCase()] > 0) {
                treeObject[$currentYear][month.toLowerCase()] -= 1
                userTrees.set(treeObject)
              }
            }}
              size="button"
              >remove</IconButton>
            <div>
              {$userTrees[$currentYear] && $userTrees[$currentYear][month.toLowerCase()] ? $userTrees[$currentYear][month.toLowerCase()] : 0}
            </div>
            <IconButton class="material-icons" on:click={() => {
              if (treesRemaining > 0) {
                if (treeObject[$currentYear]) {
                  if (treeObject[$currentYear][month.toLowerCase()]) {
                    treeObject[$currentYear][month.toLowerCase()] += 1
                  } else {
                    treeObject[$currentYear][month.toLowerCase()] = 1
                  }
                } else {
                  treeObject[$currentYear] = {}
                  treeObject[$currentYear][month.toLowerCase()] = 1
                }
                userTrees.set(treeObject)
              }
            }}
            size="button"
              >add</IconButton>
          </div>
        </Cell>
      </Row>
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
  .tree-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .header {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    box-sizing: border-box;
    margin-inline: 5px;
  }
  .cell {
    display: flex;
    justify-content: center;

  }
</style>
