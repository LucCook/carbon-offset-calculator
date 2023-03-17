<script>
  import { darkMode, loading } from "$lib/stores.js";
  import Switch from "@smui/switch";
  import Fa from "svelte-fa/src/fa.svelte";
  import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
  export let darkStyles;
  export let lightStyles;

  // Listens for changes to darkMode and replaces unneeded style sheet with dark / light mode stylesheet
  $: if ($darkMode === true && $loading === false) {
    document.getElementById("light-mode")?.remove();
    document.getElementsByTagName("head")[0].append(darkStyles);
  } else if ($darkMode === false && $loading === false) {
    document.getElementById("dark-mode")?.remove();
    document.getElementsByTagName("head")[0].append(lightStyles);
  }
</script>

<div class="title">
  <h2>Carbon Offset Calculator</h2>
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
  }
  .switch-container {
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-left: auto;
  }
</style>
