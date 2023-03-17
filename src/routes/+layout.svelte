<script>

    import { onMount } from "svelte";
    import {darkMode, loading} from "$lib/stores.js"
    import Switch from '@smui/switch';

    let darkStyles
    let lightStyles
    
    /* 
    Setting initial value for dark mode toggle based on user device preferences
    Configuring dark and light style variables for injecting into DOM when value of dark mode toggle changes
     */
    onMount(() => {
        darkMode.set(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        darkStyles =  document.createElement('link')
        darkStyles.id='dark-mode'
        darkStyles.href='/smui-dark.css'
        darkStyles.type = 'text/css'
        darkStyles.rel = 'stylesheet'
        lightStyles =  document.createElement('link')
        lightStyles.id='light-mode'
        lightStyles.href='/smui.css'
        lightStyles.type = 'text/css'
        lightStyles.rel = 'stylesheet'
        loading.set(false)
    })

    $: if ($darkMode === true && $loading === false) {
        document.getElementById('light-mode')?.remove()
        document.getElementsByTagName('head')[0].append(darkStyles)
    } else if($darkMode === false && $loading === false) {
        document.getElementById('dark-mode')?.remove()
        document.getElementsByTagName('head')[0].append(lightStyles)
    }

</script>

<Switch bind:checked={$darkMode} color="secondary" icons={false} id="dark-mode-toggle"/>
<slot />


<style>
    :global(*) {
        font-family: roboto;
    }
    :root {
        --white: #fff
    }

</style>