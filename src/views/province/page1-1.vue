
<template>
    <div class="component-wrap">
        <section class="gauge-wrap"
                 v-for="(sectionItem,sectionIndex) in 2"
                 :key="sectionIndex"
                 style="width:100%;height:48.5%;">
            <div class="chart-title clearfix">
                {{gaugeDatas[sectionItem*2-2].chartDatas.title}}
            </div>
            <div class="chart-wrap">
                <section class="chart-item"
                         v-for="(item,index) in gaugeDatas.slice(sectionItem*2-2,sectionItem*2)"
                         :key="index"
                         style="width:50%">
                    <YwChartGauge :gaugeDatas="item"
                                  v-if="item.show"></YwChartGauge>
                </section>
            </div>
        </section>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import { xMonth, fixedNumber, arrowNumberPercent } from '@/utils/filter.js'

    export default {
        props: ['moduleData'],
        components: {
            YwTitleTab: () => import('@/components/yw-title-tab.vue'),
            YwNumUpDown: () => import('@/components/yw-num-UpDown.vue'),
            YwChartGauge: () => import('@/components/yw-chart-gauge-popover.vue'),
        },
        computed: {
            ...mapState({
                department1: state => state.user.department1,
                department2: state => state.user.department2,
                monthlyTime: state => state.user.monthlyTime,
            }),
        },
        data() {
            return {
                gaugeDatas: [
                    { show: false, id: 'gauge-1', chartOption: 'gauge-option', chartDatas: { title: '计算资源均峰值利用率', name: 'CPU均峰值利用率', changeName: '同比上月份', rate: 0, change: 0, tooltip: '' } },
                    { show: false, id: 'gauge-2', chartOption: 'gauge-option', chartDatas: { title: '计算资源均峰值利用率', name: '内存均峰值利用率', changeName: '同比上月份', rate: 30, change: -10, tooltip: '' } },
                    { show: false, id: 'gauge-3', chartOption: 'gauge-option', chartDatas: { title: '计算资源均值利用率', name: 'CPU均值利用率', changeName: '同比上月份', rate: 0, change: 0, tooltip: '' } },
                    { show: false, id: 'gauge-4', chartOption: 'gauge-option', chartDatas: { title: '计算资源均值利用率', name: '内存均值利用率', changeName: '同比上月份', rate: 30, change: -10, tooltip: '' } },
                ],
            }
        },

        methods: {
            //获得gauge数据
            getGaugeDatas() {
                let circleFlag = `<i style="display:inline-block;vertical-align:middle;width:4px;height:4px;border-radius:100%;background:#fff;margin-right:5px;"></i>`

                let params = {
                    "idcType": '',
                    "month": '2020-05',

                    // "month": this.moduleData.monthlyTime,
                    "deviceType": 'X86服务器'
                };

                this.$axios.post('/v1/kpi/restful/getIdcTypeUserRate', params).then((res) => {
                    this.gaugeDatas.forEach((item, index) => {
                        item.chartDatas.rate = fixedNumber(res.data[index][item.chartDatas.name], 2)
                        item.chartDatas.change = fixedNumber(res.data[index][item.chartDatas.changeName], 2)

                        item.chartDatas.tooltip = '';
                        ['裸金属', '云主机'].forEach((tooltipItem) => {
                            item.chartDatas.tooltip += `<p style="font-size:12px;color:rgba(255,255,255,.8);margin-bottom:5px;">${circleFlag}${tooltipItem}：18.85% ｜ 同比上月 ${arrowNumberPercent(-23.4, 2)}</p>`
                        })
                        this.gaugeDatas[index].show = true
                    })
                });

            },
            //获得数据
            init() {
                this.getGaugeDatas()
            },

        },

        mounted() {
            this.init()
        }
    }
</script>

<style lang="scss" scoped>
    .component-wrap {
        width: 100%;
        height: 100%;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        flex-flow: column;
        .chart-title {
            padding-top: 15px;
            margin-bottom: 15px;
        }
        .gauge-wrap {
            position: relative;
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            &:before {
                content: "";
                position: absolute;
                top: -4px;
                left: -4px;
                display: inline-block;
                width: 15px;
                height: 15px;
                background: url(../../assets/img/arrow-up.png) no-repeat;
            }
            &:after {
                content: "";
                position: absolute;
                bottom: -4px;
                right: -4px;
                display: inline-block;
                width: 15px;
                height: 15px;
                background: url(../../assets/img/arrow-down.png) no-repeat;
            }
            .chart-wrap {
                display: flex;
                justify-content: space-between;
                flex-wrap: nowrap;
                height: calc(100% - 70px);
            }
        }
    }
</style>
