<script>
    import { onMount } from "svelte"
  import { Row, Cell } from "@smui/data-table";
  import IconButton from "@smui/icon-button";
  import Chip, { Set, LeadingIcon, TrailingIcon, Text } from "@smui/chips";
  import { currentYear, userData } from "$lib/stores.js";
  import {recalculateYear, costMonth, carbonOffsetMonth} from "$lib/utils.js"
  import { update as _update, get as _get, set as _set } from "lodash";
  export let month;
  export let treesRemaining;

  $: path = `${$currentYear}[${month}]`;

  $: trees = _get($userData, `${path}.trees`, 0);

  onMount(() => {
    handleTreeChange()
  })

  function capitaliseSingleWord(string) {
    return `${string[0].toUpperCase()}${string.slice(1)}`;
  }
  
  const handleTreeChange = () => {
    _set($userData, `${path}`, {
        trees
    })
    recalculateYear(userData, $userData, $currentYear)
    $userData = {...$userData};
}

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
          if (trees > 4) {
            trees -= 5;
            handleTreeChange()
          } else if (trees > 0) {
            trees = 0;
            handleTreeChange()
          }
        }}
        size="button"><div class="icon-text">- 5</div></IconButton
      >
      <IconButton
        class="material-icons"
        on:click={() => {
          if (trees > 0) {
            trees -= 1;
            handleTreeChange()
          }
        }}
        size="button">remove</IconButton
      >

      <div>
        {trees}
      </div>
      <IconButton
        class="material-icons"
        on:click={() => {
          if (treesRemaining > 0) {
            trees += 1
            handleTreeChange()
          }
        }}
        size="button">add</IconButton
      >
      <IconButton
        class="material-icons"
        on:click={() => {
          if (treesRemaining > 5) {
            trees += 5
            handleTreeChange()
          } else if (treesRemaining > 0) {
            trees += treesRemaining
            handleTreeChange()
          }
        }}
        size="button"><div class="icon-text">+ 5</div></IconButton
      >
    </div>
  </Cell>
  <Cell>
    <div class="cell">
      {Math.round(carbonOffsetMonth($userData, month, $currentYear, trees) * 100) / 100}
      Kg
    </div>
  </Cell>
  <Cell>
    <div class="cell">
      ${costMonth($userData, month, $currentYear, trees)}
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
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon-text {
    font-size: 0.8em;
  }
</style>
