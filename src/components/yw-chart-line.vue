<template>
    <!-- 趋势线图 -->
    <!-- <div class="yw-chart-line"
         :id="lineDatas.id"
         style="width: 100%;height: 100%;">
    </div> -->
    <div class="yw-chart-line"
         :ref="lineDatas.id"
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
        props: ['lineDatas'],
        data() {
            return {

            }
        },

        methods: {
            //绘制图表
            drawCharts(subItem) {
                this.$nextTick(() => {

                    // let myChart = echarts.init(document.getElementById(subItem.id));
                    let myChart = echarts.init(this.$refs[subItem.id]);
                    myChart.clear();

                    // 数据格式处理
                    this.drawLine(myChart, subItem);

                })

            },

            drawLine(myChart, subItem) {
                //数据格式处理
                let option = JSON.parse(JSON.stringify(ChartOption[subItem.chartOption]));
                let chartDatas = JSON.parse(JSON.stringify(subItem.chartDatas));
                let colors = ChartOption['color-option']['linearColor'];
                let colorsList = [colors.blue, colors.lineGreen];

                option.legend.data = [];
                this.lineDatas.details.seriesName.forEach((item, index) => {
                    option.series[index] = JSON.parse(JSON.stringify(option.series[0]));
                    option.series[index].name = this.lineDatas.details.seriesName[index].name;
                    let countIndex = index % (colorsList.length);
                    option.series[index].lineStyle.color.colorStops = colorsList[countIndex];
                    option.legend.data.push(option.series[index].name);
                })

                option.yAxis.name = '（%）';
                option.grid.left = 30;
                option.legend.left = 0;

                option.tooltip.formatter = (params) => {
                    let desc = ''
                    if (this.lineDatas.details.valueType) {
                        desc = this.lineDatas.details.valueType.name
                    }

                    let flag = `<span style="display:inline-block;vertical-align:middle;margin-right:3px;width:4px;height:4px;border-radius:100%;background:#fff;"></span>`;
                    let text = `${flag}${params[0] ? params[0].name : 0}：`;

                    params.forEach((item) => {
                        let nameItem = `<span style="margin-left:7px;">${item.seriesName}${desc}：${item.value ? item.value : 0}%</span>`;
                        text += `<br/>${nameItem}`;
                    });
                    return text;
                }

                let maxLlist = [];
                this.lineDatas.details.seriesName.forEach((item, index) => {
                    option.series[index].data = chartDatas.map((item) => {
                        return fixedNumber(item[this.lineDatas.details.seriesName[index].yLabel] || 0, 2);
                    });
                    maxLlist.push(Math.max(...option.series[index].data))
                })

                option.xAxis.data = chartDatas.map((item) => {
                    return item[this.lineDatas.details.seriesName[0].xLabel];
                });

                //最大值设置
                let maxValue = Math.max(...maxLlist)
                if (maxValue > 50) {
                    option.yAxis.max = 100;
                } else {
                    option.yAxis.max = 50;
                }

                //无数据时
                if (!chartDatas || chartDatas.length < 1) {
                    this.lineDatas.details.seriesName.forEach((item, index) => {
                        option.series[index].data = ['0.00']
                    })

                    option.xAxis.data = ['暂无数据']
                }

                myChart.setOption(option, true);

                //resize自适应
                this.setResizeFun(myChart);
            },
        },
        mounted() {
            this.drawCharts(this.lineDatas);
        }

    }
</script>

<style lang="scss" scoped>
</style>
