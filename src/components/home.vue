
<template>
  <div class="container clearfix">
    <el-carousel class="yw-carousel"
                 height="1080px"
                 direction="vertical"
                 :autoplay="false">
      <el-carousel-item v-for="item in 3"
                        :key="item">
        <component :is="activePage+item"></component>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>

export default {
  name: 'home',
  components: {
    page1: () => import('./page1'),
    page2: () => import('./page2'),
    page3: () => import('./page3'),
  },
  data () {
    return {
      activePage: 'page'
    }
  },

  methods: {

  },
  mounted () {

  }
}
</script>

<style lang="scss">
.container {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/img/img_bg.png) no-repeat;

  // background-size: cover;
  .log-wrap {
    display: inline-block;
    margin: 20px 0 0 20px;

    .logo {
      display: inline-block;
      vertical-align: middle;
      width: 197px;
      height: 32px;
      background: url(../assets/img/logo.png) no-repeat;
    }

    .title {
      margin-left: 15px;
      font-size: 20px;
      color: #42cff3;
      letter-spacing: 0;
      background: -webkit-linear-gradient(left, #59e2ff 0%, #2c1ef0 100%);

      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .date {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
      letter-spacing: 0;
      margin-left: 15px;
    }
  }

  .flag-wrap {
    position: absolute;
    top: 20px;
    right: 30px;
    font-size: 14px;
    color: #ffffff;
    letter-spacing: 0;
  }
  .footer-wrap {
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 20px;
    opacity: 0.5;
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #ffffff;
    letter-spacing: 0;
  }
}
</style>
