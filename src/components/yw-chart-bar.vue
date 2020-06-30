<template>
    <!-- 柱状图 -->
    <div class="yw-chart-bar"
         :ref="barDatas.id"
         style="width: 100%;height: 100%;">
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import ChartOption from '@/utils/chartOption.js'
    import DrawChart from '@/utils/drawCharts.js'
    import { fixedNumber, divisionNumber } from '@/utils/filter.js'
    export default {
        mixins: [DrawChart],
        props: ['barDatas'],
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
                    this.drawBar(myChart, subItem);

                })

            },

            drawBar(myChart, subItem) {

                let option = JSON.parse(JSON.stringify(ChartOption[subItem.chartOption]))
                let chartDatas = JSON.parse(JSON.stringify(subItem.chartDatas))
                let colors = ChartOption['color-option']['linearColor']

                this.barDatas.details.seriesName.forEach((item, index) => {
                    option.series[index] = JSON.parse(JSON.stringify(option.series[0]));
                    option.series[index].itemStyle.color.colorStops = colors.barBlue;
                    option.xAxis[index].name = item.xLabelName;
                    option.series[index].label.formatter = (params) => {
                        return params.value;
                    }
                })

                option.legend.data = [''];
                option.title.show = true
                option.title.text = '';
                option.title.subtext = '';

                option.tooltip.formatter = (params) => {
                    let flag = `<span style="display:inline-block;vertical-align:middle;margin-right:3px;width:4px;height:4px;border-radius:100%;background:#fff;"></span>`;
                    let text = `${flag}${params[0].name}${this.barDatas.details.seriesName[0].yLabelName}：<br/><span style="margin-left:7px;">${params[0].value}个</span>`;
                    return text;
                }

                this.barDatas.details.seriesName.forEach((barItem, index) => {
                    option.series[index].data = chartDatas.map((item) => {
                        return item[barItem.xLabel]
                    })
                    option.yAxis[index].data = chartDatas.map((item) => {
                        return item[barItem.yLabel]
                    })
                })

                if (!chartDatas || (chartDatas && chartDatas.length < 1)) {
                    this.barDatas.details.seriesName.forEach((item, index) => {
                        option.series[index].data = ['']
                        option.yAxis[index].data = ['暂无数据']
                    })

                }


                myChart.setOption(option)

                // resize自适应
                this.setResizeFun(myChart)
            },
        },
        mounted() {
            this.drawCharts(this.barDatas);
        }

    }
</script>

<style lang="scss" scoped>
</style>
