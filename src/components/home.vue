
<template>
  <div class="home"
       style="width:100%;height:100%;">
    <!-- <el-carousel class="yw-carousel"
                 arrow="always"
                 height="1080px"
                 direction="vertical"
                 :autoplay="false">
      <el-carousel-item v-for="item in 6"
                        :key="item">
        <component :is="activePage+item"></component>
      </el-carousel-item>
    </el-carousel> -->
    <swiper :options="swiperOption"
            ref="mySwiper"
            style="width:100%;height:100%;">
      <swiper-slide v-for="item in 3"
                    class="swiper-no-swiping"
                    :key="item">
        <component :is="activePage+item"></component>
      </swiper-slide>
      <div class="swiper-pagination"
           slot="pagination"></div>
    </swiper>
    <section class="swiper-tip"
             v-show="showSwiperArrow"
             @click="slideNext()">
      <p class="tip-text">滑动查看下一页</p>
      <i class="tip-img"></i>
    </section>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'home',
  components: {
    swiper,
    swiperSlide,
    page1: () => import('./page1.vue'),
    page2: () => import('./page2.vue'),
    page3: () => import('./page5.vue'),
    // page4: () => import('./page4.vue'),
    // page5: () => import('./page5.vue'),
    // page6: () => import('./page6.vue'),

  },
  data () {
    return {
      swiper: {},//swiper对象
      activePage: 'page',
      swiperOption: {
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 30,
        mousewheel: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        noSwiping: true,
      }
    }
  },
  computed: {
    //是否展示切换箭头
    showSwiperArrow () {
      let show = true;
      if (this.swiper.activeIndex == 5) {
        show = false;
      } else {
        show = true;
      }
      return show;
    }
  },

  methods: {
    //swiper滑动上一页
    slidePrev () {
      this.swiper.slidePrev();
    },
    //swiper滑动下一页
    slideNext () {
      this.swiper.slideNext();
    },
  },
  mounted () {
    this.swiper = this.$refs.mySwiper.swiper;
  }
}
</script>

<style lang="scss">
.container {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/img/img_bg.png) no-repeat;
  background-size: cover;
  background-position: center center;
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
      display: inline-block;
      vertical-align: middle;
      margin-left: 15px;
      font-size: 20px;
      color: #42cff3;
      letter-spacing: 0;
      background: -webkit-linear-gradient(left, #59e2ff 0%, #2c1ef0 100%);

      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      &.small {
        font-size: 16px;
      }
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
    font-style: normal;
    font-size: 12px;
    color: #ffffff;
    letter-spacing: 0;
  }
  .chart-title {
    width: 100%;
    font-size: 18px;
    color: #ffffff;
    letter-spacing: 0;
    padding: 20px 0 0 20px;
  }
}

.home {
  position: relative;
  width: 100%;
  height: 100%;
  .swiper-tip {
    position: absolute;
    bottom: 20px;
    left: 50%;
    width: 120px;
    margin-left: -60px;
    text-align: center;
    cursor: pointer;
    z-index: 999;
    .tip-img {
      display: inline-block;
      width: 38px;
      height: 31px;
      background: url(../assets/img/jiantou.png) no-repeat;
      transform: rotate(180deg);
    }
    .tip-text {
      font-size: 14px;
      color: #7a64c1;
      margin-bottom: 5px;
      animation: fadeInDown 2s infinite;
    }
  }
  .swiper-container-vertical {
    .swiper-pagination {
      &.swiper-pagination-bullets {
        right: 30px;
        margin-top: -60px;
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #7663b7;
          opacity: 1;
          &.swiper-pagination-bullet-active {
            background: #fff;
          }
        }
      }
    }
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translate3d(0, -50%, 0);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}
</style>
