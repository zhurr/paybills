
<template>
  <div class="container clearfix">
    <section class="log-wrap">
      <i class="logo"></i>
      <span class="title">租户IT云资源使用情况</span>
    </section>
    <section class="flag-wrap">信息技术中心-管理信息系统部</section>
    <section class="main-wrap">
      <p class="title">Hi, 管理信息系统部</p>
      <img src="../assets/img/pic_wenzi.png"
           alt="">
    </section>
    <!--  <section class="footer-wrap">Copyright©-2019 中国移动IT云 版权所有</section> -->
  </div>
</template>

<script>

export default {
  name: 'page1',
  components: {

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
.main-wrap {
  position: absolute;
  top: 30%;
  left: 33%;
  width: 673px;
  height: 300px;
  .title {
    font-size: 20px;
    color: #42cff3;
    letter-spacing: 0;
    margin-bottom: 30px;
  }
}
</style>
