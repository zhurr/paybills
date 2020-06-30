
<template>
  <div class="container clearfix">
    <section class="log-wrap">
      <logo></logo>
      <span class="title small">
        Agent部署与资源回收 （{{monthlyTime.split('-')[0]}}年{{monthlyTime.split('-')[1]}}月）
      </span>
    </section>
    <department></department>
    <section class="main-wrap main-chart">
      <div class="main">
        <div class="left"
             style="width:49.2%">
          <page5-left :moduleData="moduleData1"></page5-left>
        </div>
        <div class="right"
             style="width:49.2%">
          <page5-right :moduleData="moduleData2"></page5-right>
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
    'page5-left': () => import('./page5-left.vue'),
    'page5-right': () => import('./page5-right.vue'),
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
