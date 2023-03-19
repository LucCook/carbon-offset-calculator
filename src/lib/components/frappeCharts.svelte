<script>
    import Chart from 'svelte-frappe-charts';
    import {
    months,
    treeMonthTotal,
    capitaliseSingleWord
  } from "$lib/utils.js";
    import {userData, currentYear} from '$lib/stores.js'
  
    $: monthData = Object.values($userData[$currentYear])
    $: treeValues = monthData.map((month, i) => treeMonthTotal($userData, months[i], $currentYear))
    $: offsetValues = monthData.map((month, i) => $userData[$currentYear][months[i]].offset.toFixed(2))

    $: data = {
      labels: months.map((month) => capitaliseSingleWord(month)),
      datasets: [
        {
        name: "Trees",
          values: treeValues
        },
        {
        name: "CO2 Offset (Kg)",
          values: offsetValues
        }
      ]
    };

  </script>
  
  <Chart data={data} type="line" colors={["#ff3e00", "#4caf50"]}/>