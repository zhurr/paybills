
<template>
  <!-- 部门 -->
  <section class="flag-wrap">
    {{department1}}<span v-if="department2">-{{department2}}</span>
  </section>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'department',
  components: {

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
</style>
