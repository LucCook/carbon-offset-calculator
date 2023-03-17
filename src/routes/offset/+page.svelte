<script>
  import { userTrees, currentYear } from "$lib/stores.js";
  import { config } from "$lib/config.js";
  import Dialog, { Title, Content } from "@smui/dialog";
  import Button, { Label } from "@smui/button";
  import List, { Item, Text } from "@smui/list";
  import IconButton from "@smui/icon-button";

  let open = false;

  let yearTreeTotal;

  $: if ($userTrees[$currentYear]) {
    yearTreeTotal = $userTrees[$currentYear]
      ? Object.values($userTrees[$currentYear]).reduce((a, b) => a + b)
      : 0;
  } else yearTreeTotal = 0;

  $: treesRemaining =
    $config["yearly_tree_limit"] - (yearTreeTotal ? yearTreeTotal : 0);
</script>

<div class="offset">
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
</div>

<style>
  .year-selector {
    display: flex;
    align-items: center;
  }
</style>
