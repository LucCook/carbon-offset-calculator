<script>
  import { Row, Cell } from "@smui/data-table";

  
  import Button, { Group, Label, Icon} from "@smui/button";
  import IconButton from "@smui/icon-button";
  import { currentYear, userData } from "$lib/stores.js";
  import { recalculateYear, capitaliseSingleWord } from "$lib/utils.js";
  import { update as _update, get as _get, set as _set } from "lodash";
  import Dialog, { Title, Content } from "@smui/dialog";
  import List, { Item, Text } from "@smui/list";
  export let month;
  export let treesRemaining;

  $: path = `${$currentYear}[${month}]`;

  $: trees = _get($userData, `${path}.trees`, 0);

  const handleTreeChange = () => {
    _set($userData, `${path}`, {
      trees,
    });
    recalculateYear(userData, $userData, $currentYear);
  };

  let open = false
</script>
<Dialog
  bind:open
  selection
  aria-labelledby="list-title"
  aria-describedby="list-content"
>
  <Title id="list-title">Add Trees</Title>
  <Content id="list-content">
    <List>
      {#each [...Array(treesRemaining + trees + 1)].map((v, i) => i) as item}
        <Item
          on:click={() => {
            trees = item;
            handleTreeChange();
            open = false;
            
          }}
          
        >
          <Text style={trees === item ? "color: var(--primary);" : ""}>{item}</Text>
        </Item>
      {/each}
    </List>
  </Content>
</Dialog>
<Row>
  <Cell style="padding-inline: 0; width: 25%;"
    ><div class="cell">{capitaliseSingleWord(month)}</div></Cell
  >
  <Cell style="padding-inline: 0; width: 25%;">
    <div class="tree-container">
      <Button
        class="material-icons"
        on:click={() => {
          if (trees > 0) {
            trees -= 1;
            handleTreeChange();
          }
        }}
        size="button"><Icon class="material-icons" style="margin-inline: 0">remove</Icon></Button
      >

      <!-- <div
        style={trees > 0
          ? "color: var(--primary); padding: 10px; border-radius: 10px; height: 40px; width: 40px; text-align: center; box-sizing: border-box; font-weight: bold"
          : "height: 40px; width: 40px; text-align: center;  box-sizing: border-box; padding: 10px;"}
      >
        {trees}
      </div> -->
      <Button on:click={() => (open = true)}><Label style={trees ? 'color: var(--primary)' : 'color: var(--opposite)'}><p class="shadow">{trees}</p></Label></Button
        >
      <Button
        class="material-icons"
        on:click={() => {
          if (treesRemaining > 0) {
            trees += 1;
            handleTreeChange();
          }
        }}
        size="button"><Icon class="material-icons" style="margin-inline: 0">add</Icon></Button
      >
    </div>
  </Cell>
  <Cell style="padding-inline: 0; width: 25%;">
    <div class="cell">
      {(_get($userData, `${path}.offset`, 0)).toFixed(2)} Kg
    </div>
  </Cell>
  <Cell style="padding-inline: 0; width: 25%;">
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
  .bold {
    font-weight: bold;
    font-size: 1.3em;
  }
  .icon {
    display: flex;
    justify-content: center;
    margin-inline: auto;
  }
  .shadow {
    text-shadow: 0 0 5px var(--background);
    font-weight: bold;
  }
</style>
