<template>
    <!-- 圆环图 -->
    <section class="yw-chart-pie">
        <div class="content"
             v-if="pieDatas.details">
            <p class="chart-total">{{pieDatas.details.total}}<span class="cell">({{pieDatas.details.cell}})</span></p>
        </div>
        <!-- 图表 -->
        <div :ref="pieDatas.id"
             style="width: 100%;height: 100%;">
        </div>
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
        props: ['pieDatas'],
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
                    this.drawPie(myChart, subItem);

                })

            },
            drawPie(myChart, subItem) {
                // 数据格式处理
                let option = JSON.parse(JSON.stringify(ChartOption[subItem.chartOption]))
                let chartDatas = JSON.parse(JSON.stringify(subItem.chartDatas))
                let colorSource = ChartOption['color-option']['linearColor']
                let colors = [colorSource.pieBlue, colorSource.piePurple, colorSource.pieGreen];

                option.title.show = true
                option.title.text = ''
                option.title.subtext = ``
                option.series[0].labelLine.show = false
                option.series[0].center = ['70%', '50%'];
                option.series[0] = JSON.parse(JSON.stringify(option.series[0]));
                option.legend.top = (this.pieDatas.details && this.pieDatas.details.legend && this.pieDatas.details.legend.top) ? this.pieDatas.details.legend.top : 'middle'
                // option.legend.data = ['裸金属', '云主机', '存储'];
                option.legend.data = this.pieDatas.chartDatas.map((item) => {
                    return item.name
                });

                option.legend.formatter = (params) => {
                    let value = chartDatas.find(value => value.name == params).value;
                    let text = `${params}${'  '}${value}${this.pieDatas.details.cell}`;
                    // let colors = [colorSource.pieBlue[0].color, colorSource.piePurple[0].color, colorSource.pieGreen[0].color];
                    // let flag = `<span style="display:inline-block;vertical-align:middle;margin-right:3px;width:5px;height:5px;border-radius:100%;background:${colors[params.dataIndex]};"></span>`;
                    // let value = `<span style="margin-left:8px;">${params.percent}%，${params.value}元</span>`
                    // let text = `${flag}${params.name}消费：<br/>${value}`;
                    // return text;
                    return text;
                }

                option.tooltip.formatter = (params) => {
                    let flag = `<span style="display:inline-block;vertical-align:middle;margin-right:3px;width:5px;height:5px;border-radius:100%;background:${this.pieDatas.details.pieColors[params.dataIndex]};"></span>`;
                    let value = `<span style="margin-left:8px;">${params.percent}%，${params.value}${this.pieDatas.details.cell}</span>`
                    let text = `${flag}${params.name}：<br/>${value}`;
                    return text;
                }

                option.series[0].data = chartDatas.map((item, index) => {
                    let colorIndex = (index) % (this.pieDatas.details.pieColors.length);
                    return {
                        name: item.name,
                        value: item.value,
                        label: {
                            show: false,
                            color: this.pieDatas.details.pieColors[colorIndex],
                            formatter: function (params) {
                                let text = `${params.percent}%\n${params.value}元`;
                                return text;

                            }
                        },
                        labelLine: {
                            show: false
                        },
                        itemStyle: {
                            color: this.pieDatas.details.pieColors[colorIndex]
                        }

                    }
                })

                //无数据时
                if (!option.series[0].data || option.series[0].data.length < 1) {
                    option.series[0].data = [{
                        name: '暂无数据',
                        value: [0],
                        label: {
                            show: false,
                            color: '#fff',
                            formatter: function (params) {
                                let text = `${params.percent}%\n${params.value}元`;
                                return text;

                            }
                        },
                        labelLine: {
                            show: false
                        },
                        itemStyle: {
                            color: '#17154F'
                        }
                    }]
                }

                myChart.setOption(option)

                // resize自适应
                this.setResizeFun(myChart)
            },
        },
        mounted() {
            this.drawCharts(this.pieDatas);
        }

    }
</script>

<style lang="scss" scoped>
    .yw-chart-pie {
        position: relative;
        width: 100%;
        height: 100%;
        margin: auto;
        .content {
            position: absolute;
            left: 20%;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
            text-align: center;
            .chart-total {
                font-size: 16px;
                .cell {
                    font-size: 12px;
                }
            }
        }
    }
</style>
