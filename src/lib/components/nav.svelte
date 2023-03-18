<script>
    import Tab, { Icon, Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import { page } from '$app/stores'
    let tabs = [
    {
      icon: 'co2',
      label: 'Footprint',
      href: '/footprint'
    },
    {
      icon: 'forest',
      label: 'Offset',
      href: '/offset'
    },
    {
      icon: 'assessment',
      label: 'Report',
      href: '/report'
    },
  ];
  $: active = tabs[tabs.map((tab) => tab.href).indexOf($page.route.id)]
  
</script>

<div class="nav">

  <TabBar {tabs} let:tab bind:active>
    <Tab {tab} href={tab.href}>
      <Icon class="material-icons">{tab.icon}</Icon>
      <Label>{tab.label}</Label>
    </Tab>
  </TabBar>
</div>


<style>
  .nav {
    margin-inline: 2px;
    
    overflow: hidden;
  }
</style>