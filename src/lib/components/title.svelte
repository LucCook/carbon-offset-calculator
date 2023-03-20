<script>
  import { darkMode, loading } from "$lib/stores.js";
  import Switch from "@smui/switch";
  import Fa from "svelte-fa/src/fa.svelte";
  import { faSun, faMoon, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
  import IconButton from '@smui/icon-button';
  export let darkStyles;
  export let lightStyles;
  import Dialog, { Title, Content, Actions } from "@smui/dialog";
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Button, { Label, Icon} from "@smui/button";
  import { config } from "$lib/config"
  

  // Listens for changes to darkMode and replaces unneeded style sheet with dark / light mode stylesheet
  $: if ($darkMode === true && $loading === false) {
    document.getElementById("light-mode")?.remove();
    document.getElementsByTagName("head")[0].append(darkStyles);
  } else if ($darkMode === false && $loading === false) {
    document.getElementById("dark-mode")?.remove();
    document.getElementsByTagName("head")[0].append(lightStyles);
  }

  let open = false
  let tree_cost =  $config.tree_cost
  let maintenance_percent =  $config.maintenance_percent
  let tree_offset_max = $config.tree_offset_max
  let tree_growth_months = $config.tree_growth_months
  let yearly_tree_limit = $config.yearly_tree_limit

  const handleApply = () => {
    $config = {...$config, tree_cost, maintenance_percent, tree_offset_max, tree_growth_months, yearly_tree_limit}
  }
  console.log(isNaN("a123"))
</script>

<Dialog
  bind:open
  aria-labelledby="list-title"
  aria-describedby="list-content"
>
  <Title id="list-title">Config</Title>
  <Content id="list-content">
    <Textfield bind:value={tree_cost} label="Tree Cost ($)" invalid={isNaN(tree_cost) || tree_cost < 0}>
      <HelperText slot="helper">Upfront cost of purchasing a single tree (minimum $1)</HelperText>
    </Textfield>
    <Textfield bind:value={maintenance_percent} label="Maintenance cost percent" invalid={isNaN(maintenance_percent) || maintenance_percent < 0}>
      <HelperText slot="helper">Annual maintenance of a single tree as a percentage of upfront cost</HelperText>
      <Icon class="material-icons" slot="trailingIcon">%</Icon>
    </Textfield>
    <Textfield bind:value={tree_offset_max} label="Max Annual Tree CO2 Offset (Kg)" invalid={isNaN(tree_offset_max) || tree_offset_max <= 0}>
      <HelperText slot="helper">Maximum amount of CO<sub>2</sub> offset by a tree in a single year</HelperText>
      <Icon class="material-icons" slot="trailingIcon">co2</Icon>
    </Textfield>
    <Textfield bind:value={tree_growth_months} label="Tree Growth Months" invalid={isNaN(tree_growth_months) || tree_growth_months < 1}>
      <HelperText slot="helper">Number of months for a tree to reach full growth</HelperText>
      <Icon class="material-icons" slot="trailingIcon"><Fa icon={faCalendarDays}/></Icon>
    </Textfield>
    <Textfield bind:value={yearly_tree_limit} label="Yearly Tree Purchase Limit" invalid={isNaN(yearly_tree_limit) || yearly_tree_limit < 1}>
      <HelperText slot="helper">Maximum number of trees an individual can purchase per calendar year</HelperText>
      <Icon class="material-icons" slot="trailingIcon">forest</Icon>
    </Textfield>
   
      <Button on:click={() => {handleApply(); open = false}}>
        <Label>Apply Changes</Label>
      </Button>
      <Button on:click={() => (open = false)}>
        <Label>Cancel</Label>
      </Button>
   
  </Content>
</Dialog>
<div class="title">
  <h2>Carbon Offset Calculator</h2>
  <div class="item">

    <IconButton size="large" class="material-icons" style={"color: white"} on:click={() => open=true}>settings</IconButton>
  </div>
  <label for="dark-mode-toggle" class="switch-container">
    <div class="icon">
      <Fa color="#fff" size="1x" icon={faSun} />
    </div>
    <Switch
      bind:checked={$darkMode}
      color="secondary"
      icons={false}
      id="dark-mode-toggle"
    />
    <div class="icon">
      <Fa color="#fff" size="1x" icon={faMoon} />
    </div>
  </label>
</div>

<style>
  .title {
    display: flex;
    background-color: var(--primary);
    color: var(--white);
    padding-inline: 10px;
    align-items: center;
  }
  .item {
    margin-left: auto;
  }
  .switch-container {
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
</style>
