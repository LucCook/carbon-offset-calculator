<script>
  import { currentYear, userData } from "$lib/stores.js";
  import { config } from "$lib/config.js";
  import Dialog, { Title, Content } from "@smui/dialog";
  import Button, { Group, Label } from "@smui/button";
  import List, { Item, Text } from "@smui/list";
  import IconButton from "@smui/icon-button";
  import Fa from "svelte-fa/src/fa.svelte";
  import _ from "lodash";
  const {update: _update, get: _get, set: _set} = _
  import {
    faRotate,
    faCaretLeft,
    faCaretRight,
  } from "@fortawesome/free-solid-svg-icons";
  import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
  import OffsetTableRow from "$lib/components/offsetTableRow.svelte";
  import { recalculateYear, treeTotal, costTotal, offsetTotal, months } from "$lib/utils";

  let open = false;
  
  const handleReset = () => {
    for (let month in $userData[$currentYear]) {
      $userData[$currentYear][month].trees = 0
    }
    recalculateYear(userData, $userData, $currentYear)
    $userData = $userData
  }

  const handleSpread = () => {
    for (let month of months) {
      _update($userData, `${$currentYear}[${month}].trees`, (n) => n ? n + Math.floor(treesRemaining / 12) : Math.floor(treesRemaining / 12)) 
    }
    for (let i = 0; i < treesRemaining % 12; i++) {
      _update($userData, `${$currentYear}[${months[i]}].trees`, (n) => n ? n + 1 : 1) 
    }
    recalculateYear(userData, $userData, $currentYear)
    $userData = $userData
  }

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
  <div class="year-selector">
    
      <IconButton
        disabled={$currentYear <= $config.min_year}
        on:click={() => {
          currentYear.update((current) => (current -= 1))
          recalculateYear(userData, $userData, $currentYear - 1)  
        }}
        
        class="material-icons"><Fa icon={faCaretLeft} color={$currentYear <= $config.min_year ? "var(--secondary)" : "var(--primary)"}/></IconButton
      >
    
    <Button on:click={() => (open = true)}><Label>{$currentYear}</Label></Button
    >
    <IconButton
      on:click={() => {
        currentYear.update((current) => (current += 1))
        recalculateYear(userData, $userData, $currentYear)  
      }}
      class="material-icons"><Fa icon={faCaretRight} color={"var(--primary)"}/></IconButton
    >
  </div>
  <Group>
    <Button>
      <Label>
        <span class="bold">{treesRemaining}</span> Trees Remaining
      </Label>
    </Button>
    <Button on:click={handleReset}>
      <Label>Reset&nbsp;<Fa icon={faRotate}/></Label>
    </Button>
    <Button on:click={handleSpread}>
      <Label>Spread Evenly</Label>
    </Button>
  </Group>
  
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
        <OffsetTableRow {month} {treesRemaining} />
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
    margin-block: 20px;
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
  .bold {
    font-weight: bold;

  }
</style>
