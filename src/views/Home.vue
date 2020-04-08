
<template>
  <div class="home"
       style="position:relative;width:100%;height:100%;">
    <!-- 时间筛选 -->
    <div class="yw-select-wrap"
         v-if="this.swiper.activeIndex===0">
      <el-select class="yw-select"
                 v-model="date.activeDate"
                 clearable
                 filterable
                 @change="changeDate"
                 popper-class="yw-select-options"
                 placeholder="请选择">
        <el-option v-for="(item,index) in date.options"
                   :key="index"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
    </div>
    <!-- 时间筛选 -->
    <swiper :options="swiperOption"
            ref="mySwiper"
            style="width:100%;height:100%;">
      <swiper-slide v-for="item in 4"
                    class="swiper-no-swiping"
                    :key="item">
        <template v-if="resetComponent">
          <component :is="activePage+item"
                     :key="activePage+item"></component>
        </template>
      </swiper-slide>
      <div class="swiper-pagination"
           slot="pagination"></div>
    </swiper>
    <section class="swiper-tip"
             v-show="showSwiperArrow"
             @click="slideNext()">
      <p class="tip-text">滑动查看下一页</p>
      <i class="tip-img"
         style="width: 38px;height: 31px;"></i>
    </section>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import updateComponent from '@/utils/updateComponent.js'
import { getUrlKey, xMonth } from '@/utils/filter.js'

export default {
  name: 'home',
  mixins: [updateComponent],
  components: {
    swiper,
    swiperSlide,
    page1: () => import('@/views/page1.vue'),
    page2: () => import('@/views/page2.vue'),
    page3: () => import('@/views/page3.vue'),
    page4: () => import('@/views/page4.vue'),
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
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        noSwiping: true,
        // on: {
        //   slideChangeTransitionStart: () => {
        //     //如果从第一页滑动
        //     if (this.swiper.previousIndex < 1) {
        //       //更新组件
        //       this.updateComponent();
        //     }
        //   }
        // },
      },

      //日期
      date: {
        activeDate: '',
        options: []
      },
    }
  },
  computed: {
    //是否展示切换箭头
    showSwiperArrow () {
      let show = true;
      if (this.swiper.activeIndex == 3) {
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
    //获得日期信息
    getDate () {
      this.date.options = [];
      for (let i = 1; i < 13; i++) {
        let month1 = xMonth(-i, '-');
        let month2 = xMonth(-i, '年', '月');
        if (month1.split('-')[1] == '11' && month1.split('-')[0] == '2019') {
          break;
        }
        this.date.options.push({
          value: month1,
          label: month2
        });
      }
      // this.date.activeDate = this.date.options[0].value;
      this.date.activeDate = '2020-02';
      this.$store.commit('setUser', { monthlyTime: this.date.activeDate });
    },
    //切换日期
    changeDate (val) {
      this.$store.commit('setUser', { monthlyTime: val });
      //更新组件
      this.updateComponent();
    },

  },
  created () {
    this.getDate();
    let department1 = getUrlKey('department1');
    let department2 = getUrlKey('department2');
    if (department2 === 'null') {
      department2 = null;
    }
    this.$store.commit('setUser', { department1: department1, department2: department2 });
  },
  mounted () {
    this.swiper = this.$refs.mySwiper.swiper;
  }
}
</script>

<style lang="stylus" lang="scss" scoped>
.yw-select-wrap {
  position: absolute;
  left: 50%;
  width: 300px;
  top: 50%;
  z-index: 999;
  margin-left: -230px;
  .yw-select {
    width: 100%;
  }
}
</style>
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
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0;
    padding: 20px 30px 0 30px;
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
