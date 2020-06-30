<template>
    <!-- 仪表盘(刻度、弹出窗)【使用的页面：省级资源池运营月报】 -->
    <section class="yw-chart-gauge">
        <div class="chart-border"></div>
        <div class="content">
            <p class="chart-percent">{{gaugeDatas.chartDatas.rate}}<span class="chart-percent-cell">%</span></p>
            <p class="chart-change-wrap">
                同比上月份<span class="chart-change-percent">
                    <span class="down"
                          v-if="gaugeDatas.chartDatas.change<0"><i class="arrow">↓</i>{{-gaugeDatas.chartDatas.change}}%</span>
                    <span class="up"
                          v-else><i class="arrow">↑</i>{{gaugeDatas.chartDatas.change}}%</span>
                </span>
            </p>

            <el-popover placement="bottom"
                        trigger="hover"
                        popper-class="yw-popover-blue">
                <div v-html="gaugeDatas.chartDatas.tooltip"></div>
                <p class="chart-name"
                   slot="reference">{{gaugeDatas.chartDatas.name}} <i class="el-icon-arrow-down"></i></p>
            </el-popover>
        </div>
        <!-- 图表 -->
        <div :ref="gaugeDatas.id"
             class="chart-box">正在加载</div>
        <!-- 图表 -->
    </section>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import ChartOption from '@/utils/chartOption.js'
    import DrawChart from '@/utils/drawCharts.js'
    import { fixedNumber, divisionNumber } from '@/utils/filter.js'
    export default {
        mixins: [DrawChart],
        props: ['gaugeDatas'],
        data() {
            return {

            }
        },

        methods: {
            //绘制图表
            drawCharts(subItem) {
                this.$nextTick(() => {
                    let myChart = echarts.init(this.$refs[subItem.id]);
                    myChart.clear();

                    // 数据格式处理
                    this.drawGauge(myChart, subItem);

                })

            },

            drawGauge(myChart, subItem) {
                //数据格式处理
                let option = JSON.parse(JSON.stringify(ChartOption[subItem.chartOption]));
                let chartDatas = JSON.parse(JSON.stringify(subItem.chartDatas));
                let colors = ChartOption['color-option']['linearColor'];
                option.series[0] = JSON.parse(JSON.stringify(option.series[0]));
                option.series[0].name = chartDatas.name;

                option.series[0].axisLine.lineStyle.color = colors.gaugeRed;
                option.series[0].axisLine.lineStyle.color[0][0] = chartDatas.rate / 100;
                option.series[0].data[0].name = '';
                option.series[0].data[0].value = chartDatas.rate;
                option.series[0].radius = '95%'
                // option.series[0].startAngle = 225
                // option.series[0].endAngle = -45

                myChart.setOption(option);

                //resize自适应
                this.setResizeFun(myChart);
            },
        },
        mounted() {
            this.drawCharts(this.gaugeDatas);
        }

    }
</script>
<style lang="scss" scoped>
    .yw-chart-gauge {
        position: relative;
        width: 50%;
        height: 100%;
        margin: auto;

        .chart-border {
            position: absolute;
            top: -7px;
            left: -7px;
            width: calc(100% + 14px);
            height: calc(100% + 10px);
            background: url("~@/assets/img/gauge-border.png") no-repeat;
            background-position: center top;
            background-size: contain;
        }
        .chart-box {
            width: 100%;
            height: 220px;
            margin: 0 auto;
        }
        .content {
            position: absolute;
            left: 0;
            top: 70px;
            width: 100%;
            // height: 100%;
            text-align: center;
            z-index: 99;
            .chart-percent {
                font-size: 22px;
                color: #ffffff;
                margin-bottom: 15px;
                .chart-percent-cell {
                    font-size: 16px;
                }
            }
            .chart-change-wrap {
                font-size: 12px;
                color: #574fb6;
                margin-bottom: 25px;
                .chart-change-percent {
                    border-radius: 12px;
                    color: #fff;
                    margin-left: 5px;
                    .down {
                        background: #ff5136;
                        border-radius: 12px;
                        padding: 3px 5px;
                    }
                    .up {
                        background: #0dbe9c;
                        border-radius: 12px;
                        padding: 3px 5px;
                    }
                }
            }
            .chart-name {
                font-size: 14px;
                cursor: pointer;
                &:hover {
                    .el-icon-arrow-down {
                        transform: rotate(180deg);
                    }
                }
            }
        }
    }
</style>
