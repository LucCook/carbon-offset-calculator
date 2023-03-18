<script>

    import { onMount } from "svelte";
    import { darkMode, loading, userData } from "$lib/stores.js"
    import { config } from "$lib/config";
    import Title from "$lib/components/title.svelte";
    import Footer from "$lib/components/footer.svelte";
    import Nav from "$lib/components/nav.svelte";

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
</script>

<div class="layout">
    <Title darkStyles={darkStyles} lightStyles={lightStyles}/>
    <Nav />
    <slot />
    <Footer />
</div>


<style>
    :global(*) {
        font-family: roboto;
    }
    :root {
        --white: #fff
    }
    .layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
</style>