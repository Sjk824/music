<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header';
  import Tab from 'components/Tab/Tab';

  export default {
    components: {
      MHeader,
      Tab
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #app
    height 100%
    width 100%
</style>
