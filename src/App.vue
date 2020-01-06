<template>
  <div id="app">
    <home />
  </div>
</template>

<script>
import home from './components/home.vue'

export default {
  name: 'app',
  components: {
    home
  }
}
</script>

<style lang="scss">
@import "assets/css/global.scss";
</style>
