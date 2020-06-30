
<template>
  <div class="container clearfix">
    <section class="log-wrap">
      <logo></logo>
      <span class="title small">
        租户资源利用率（{{monthlyTime.split('-')[0]}}年{{monthlyTime.split('-')[1]}}月）
      </span>
    </section>
    <department></department>
    <section class="main-wrap main-chart">
      <div class="main">
        <div class="left"
             style="width:49.2%">
          <page4-left :moduleData="moduleData1"></page4-left>
        </div>
        <div class="right"
             style="width:49.2%">
          <page4-right :moduleData="moduleData2"></page4-right>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    department: () => import('@/components/department.vue'),
    logo: () => import('@/components/logo.vue'),
    'page4-left': () => import('./page4-left.vue'),
    'page4-right': () => import('./page4-right.vue'),
  },
  computed: {
    ...mapState({
      department1: state => state.user.department1,
      department2: state => state.user.department2,
      monthlyTime: state => state.user.monthlyTime,
    }),
  },
  data () {
    return {
      moduleData1: {
        type: '计算资源',
      },
      moduleData2: {
        type: '存储资源',
      },

    }
  },

  methods: {
    getDatas () {

    },
    changeTab (val) {

    },
  },
  mounted () {
    this.getDatas();
  }
}
</script>

<style lang="scss" scoped>
.left {
  background: rgba(24, 19, 109, 0.95);
}
.right {
  background: rgba(24, 19, 109, 0.95);
}
</style>
