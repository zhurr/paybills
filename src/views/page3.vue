
<template>
  <div class="container clearfix">
    <section class="log-wrap">
      <logo></logo>
      <span class="title small">
        {{monthlyTime.split('-')[0]}}年{{monthlyTime.split('-')[1]}}月IT云资源均峰值利用率
      </span>
    </section>
    <department></department>
    <section class="main-wrap main-chart">
      <div class="main">
        <div class="left"
             style="width:33.5%">
          <page3_1></page3_1>
        </div>
        <div class="right"
             style="width:65%">
          <page3_2 style="width:100%;height:50%"></page3_2>
          <page3_3 style="width:100%;height:50%"></page3_3>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    page3_1: () => import('./page3-1.vue'),
    page3_2: () => import('./page3-2.vue'),
    page3_3: () => import('./page3-3.vue'),
    department: () => import('../components/department.vue'),
    logo: () => import('../components/logo.vue'),
    PageTitle: () => import('../components/page-title.vue'),
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

    }
  },

  methods: {

  },
  mounted () {

  }
}
</script>

<style lang="scss" scoped>
.left {
  background: rgba(24, 19, 109, 0.95);
  .split {
    position: absolute;
    top: 50%;
    left: 30px;
    display: inline-block;
    width: calc(100% - 60px);
    height: 0;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.5);
  }
}
.right {
  background: rgba(24, 19, 109, 0.95);
}
</style>
