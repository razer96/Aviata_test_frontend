<template>
  <div id="app">
    <AviaTable/>
  </div>
</template>

<script>
import AviaTable from '@/components/AviaTable.vue'
export default {
  name: 'app',
  components: {
    AviaTable
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Open Sans';
  width: 100%;
}
</style>
