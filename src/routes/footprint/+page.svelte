<script>
  // Special SvelteKit declaration to fetch data from server file
  export let data;
  const { countries } = data;

  // Svelte Store Imports
  import { userCountry, userOffset } from "$lib/stores.js";

  // Svelte Material UI Imports
  import Autocomplete from "@smui-extra/autocomplete";
  import IconButton from "@smui/icon-button";
  import Switch from "@smui/switch";

  let country = $userCountry["country"] || "";
  let co2 = $userCountry["2021_co2"] || 0;
  let valueToDisplay = 0;
  let toggleCalculator = true;

  $: calculatedCo2 = toggleCalculator ? (co2 * 1000 - $userOffset) / 1000 : co2;
  // Adjusts displayed value smoothly when selecting country
  $: if (valueToDisplay * 1000 !== calculatedCo2 * 1000) {
    setTimeout(() => {
      valueToDisplay += (calculatedCo2 - valueToDisplay) / 30;
    }, 3);
  }

  $: if (countries.filter((obj) => obj.country === country)[0]) {
    userCountry.set(countries.filter((obj) => obj.country === country)[0]);
    co2 = $userCountry["2021_co2"];
  }
</script>

<div class="footprint">
  <div class="input-region">
    <Autocomplete
      options={countries.map((obj) => obj.country)}
      bind:value={country}
      label="Country / Region"
    />
    <IconButton on:click={() => (country = "")} class="material-icons"
      >clear</IconButton
    >
</div>
{#if $userOffset}
<div class="switch-container">
    <label for="toggle-calculator">Include offsetted CO<sub>2</sub></label>
    <Switch id="toggle-calculator" bind:checked={toggleCalculator}/>
</div>
{/if}
  <div>
    <h1>Your estimated carbon footprint</h1>
    <h2>{Math.round(valueToDisplay * 1000)} Kg CO<sub>2</sub></h2>
    <h2>{Math.round((valueToDisplay / 1.964) * 1000)}m<sup>3</sup></h2>
    <p>(Volume calculated for sea level @ 15 degrees celsius)</p>
    <h2>{Math.ceil((valueToDisplay * 1000) / 28.5)} Fully Grown Trees</h2>
  </div>
</div>

<style>
  .footprint {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  p {
    margin-top: 0;
  }
  .switch-container {
    margin-top: 20px
  }
  
</style>
