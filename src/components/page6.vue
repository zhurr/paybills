
<template>
  <div class="container clearfix">
    <section class="log-wrap">
      <i class="logo"></i>
      <span class="title">租户IT云资源使用情况</span>
    </section>
    <section class="flag-wrap">信息技术中心-管理信息系统部</section>
    <section class="main-wrap">
      <p>这一年</p>
      <p>您的总消费金额超过<span style="font-size:20px;color:#F54BA6;">28<span style="font-size:16px;">%</span></span>的租户</p>
      <p>消费最多的资源类型是裸金属</p>
      <p>消费最高的月份是十二月份</p>
      <p>平均资源利用率战胜了<span style="font-size:24px;color:#F54BA6;">78<span style="font-size:16px;">%</span></span>的租户</p>
      <p style="margin-top:20px;">2019年，您的关键词：<span class="keyword">佛系赢家</span>
        <!-- <span class="keyword">披荆斩棘</span><span class="keyword">豪门金主</span> -->
      </p>
    </section>
    <section class="picture-wrap"></section>
    <section class="footer-wrap">Copyright©-2019 中国移动IT云 版权所有</section>
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
  left: 25%;
  top: 25%;
  width: 673px;
  height: 400px;
  padding-left: 10px;
  font-size: 16px;
  color: #ffffff;
  letter-spacing: 0;
  line-height: 60px;
  .keyword {
    font-size: 28px;
    color: #4efff6;
    letter-spacing: 0;
    background: -webkit-linear-gradient(left, #4efff6 0%, #25aaf9 100%);

    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-right: 15px;
  }
}
.picture-wrap {
  position: absolute;
  top: 15%;
  right: 10%;
  display: inline-block;
  width: 605px;
  height: 412px;
  background: url(../assets/img/pic_01.png) no-repeat;
}
</style>
