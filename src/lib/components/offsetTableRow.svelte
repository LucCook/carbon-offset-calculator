<script>
  import { Row, Cell } from "@smui/data-table";
  import IconButton from "@smui/icon-button";
  import Chip, { Set, LeadingIcon, TrailingIcon, Text } from "@smui/chips";
  import Button, {Group, Label} from "@smui/button"
  
  import { currentYear, userData } from "$lib/stores.js";
  import {recalculateYear, capitaliseSingleWord} from "$lib/utils.js"
  import { update as _update, get as _get, set as _set } from "lodash";
  export let month;
  export let treesRemaining;

  $: path = `${$currentYear}[${month}]`;

  $: trees = _get($userData, `${path}.trees`, 0);
  
  const handleTreeChange = () => {
    _set($userData, `${path}`, {
        trees
    })
    recalculateYear(userData, $userData, $currentYear)
}

</script>

<Row>
  <Cell style="padding-inline: 0; width: 25%;"
    ><div class="cell">{capitaliseSingleWord(month)}</div></Cell
  >
  <Cell style="padding-inline: 0; width: 50%;">
    <div class="tree-container">
        

        
        <Button variant="outlined" mini on:click={() => {
            if (trees > 4) {
              trees -= 5;
              handleTreeChange()
            } else if (trees > 0) {
              trees = 0;
              handleTreeChange()
            }
          }}
        >
            <span class="bold">- 5</span>
          </Button>
          <Button variant="outlined" mini on:click={() => {
            if (trees > 0) {
              trees -= 1;
              handleTreeChange()
            }
          }}>
            <span class="bold">- 1</span>
          </Button>
          <Button variant="outlined" color={ trees ? "primary" : "secondary"} mini >
            <span class="bold">{trees}</span>
          </Button>
          <Button variant="outlined"  mini on:click={() => {
            if (treesRemaining > 0) {
              trees += 1
              handleTreeChange()
            }
          }}>
            <span class="bold">+ 1</span>
          </Button>
          <Button variant="outlined"  mini on:click={() => {
            if (treesRemaining > 5) {
              trees += 5
              handleTreeChange()
            } else if (treesRemaining > 0) {
              trees += treesRemaining
              handleTreeChange()
            }
          }}>
            <span class="bold">+ 5</span>
          </Button>
        
            
        
      <!-- <IconButton
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
      > -->
    </div>
  </Cell>
  <Cell style="padding-inline: 0; width: 50%;">
    <div class="cell">
        {Math.round(_get($userData, `${path}.offset`, 0) * 100) / 100} Kg
    </div>
  </Cell>
  <Cell style="padding-inline: 0; width: 50%;">
    <div class="cell">
        ${_get($userData, `${path}.cost`, 0)}
    </div>
  </Cell>
</Row>

<style>
  .tree-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
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
  .bold {
    font-weight: bold;
    font-size: 1.3em;
  }
  
</style>
