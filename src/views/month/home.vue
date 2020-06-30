
<template>
    <div class="home"
         style="position:relative;width:100%;height:100%;">
        <!-- 时间筛选 -->
        <div class="yw-select-wrap"
             v-if="this.swiper.activeIndex===0">
            <el-select class="yw-select"
                       v-model="date.activeDate"
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
            <swiper-slide v-for="item in 5"
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
            page1: () => import('./page1.vue'),
            page2: () => import('./page2.vue'),
            page3: () => import('./page3.vue'),
            page4: () => import('./page4.vue'),
            page5: () => import('./page5.vue'),
        },
        data() {
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
            showSwiperArrow() {
                let show = true;
                if (this.swiper.activeIndex == 4) {
                    show = false;
                } else {
                    show = true;
                }
                return show;
            }
        },

        methods: {
            //swiper滑动上一页
            slidePrev() {
                this.swiper.slidePrev();
            },
            //swiper滑动下一页
            slideNext() {
                this.swiper.slideNext();
            },
            //获得日期信息
            getDate() {
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
                this.date.activeDate = this.date.options[0].value;
                // this.date.activeDate = '2020-02';
                this.$store.commit('setUser', { monthlyTime: this.date.activeDate });
            },
            //切换日期
            changeDate(val) {
                this.$store.commit('setUser', { monthlyTime: val });
                //更新组件
                this.updateComponent();
            },

        },
        created() {
            this.getDate();
            let department1 = getUrlKey('department1');
            let department2 = getUrlKey('department2');
            if (department2 === 'null') {
                department2 = null;
            }
            this.$store.commit('setUser', { department1: department1, department2: department2 });
        },
        mounted() {
            this.swiper = this.$refs.mySwiper.swiper;
        }
    }
</script>

<style lang="scss" scoped>
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