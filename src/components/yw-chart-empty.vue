<template>
  <!-- 图表空判断 -->
  <div class="chart-empty-wrap"
       v-if="showEmptyDatas.show"
       style="width: 100%;height: 100%">
    <p class="chart-empty">{{showEmptyDatas.content}}</p>
  </div>

</template>
<script>
export default {
  props: ['showEmptyDatas'],
  data () {
    return {

    }
  },

  methods: {

  },
  mounted () {

  }

}
</script>
<style lang="scss" scoped>
</style>
