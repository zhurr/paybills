
<template>
  <div class="container-component">
    <div class="chart-title clearfix">
      <span>各月份资源利用率趋势</span>
      <el-tabs class="yw-tabs"
               v-model="activeFilter"
               type="card"
               @tab-click="changeTab">
        <el-tab-pane :label="item.label"
                     v-for="(item,index) in filter"
                     :key="index"
                     :name="item.name"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="chart-wrap">
      <section class="chart-item"
               v-for="(item,index) in rightDatas"
               :key="index">
        <p class="tip"
           v-if="item.chartDatas.rate < 20">利用率太低啦～</p>
        <div :id="item.id"
             style="width:100%;height:100%;">暂无</div>
      </section>
    </div>

  </div>
</template>

<script>
import ChartOption from '../utils/chartOption.js'
import DrawChart from '../utils/drawCharts.js'

export default {
  name: 'page3',
  mixins: [DrawChart],
  components: {

  },
  data () {
    return {
      filter: [{ name: '物理机', label: '物理机' }, { name: '虚拟机', label: '虚拟机' }],
      activeFilter: '物理机',
      rightDatas: [{ id: 'page5-1-1', chartOption: 'gauge-option', chartDatas: [] },
      { id: 'page5-1-2', chartOption: 'gauge-option', chartDatas: [] }],
    }
  },

  methods: {
    getDatas () {

      if (this.activeFilter == '物理机') {
        this.rightDatas[0].chartDatas = {
          name: 'CPU平均资源利用率',
          rate: 3.39 //0%
        };
        this.rightDatas[1].chartDatas = {
          name: '内存平均资源利用率',
          rate: 19.33  //0%
        };
      } else {
        this.rightDatas[0].chartDatas = {
          name: 'CPU平均资源利用率',
          rate: 1.75 //0%
        };
        this.rightDatas[1].chartDatas = {
          name: '内存平均资源利用率',
          rate: 17.47  //0%
        };
      }
      this.drawCharts(this.rightDatas[0]);
      this.drawCharts(this.rightDatas[1]);
    },

    //绘制图表
    drawCharts (subItem) {
      this.$nextTick(() => {

        let myChart = echarts.init(document.getElementById(subItem.id));
        myChart.clear();

        // 数据格式处理
        this.drawGauge(myChart, subItem);

      })

    },
    drawLine (myChart, subItem) {
      //数据格式处理
      let option = JSON.parse(JSON.stringify(ChartOption[subItem.chartOption]));
      let chartDatas = JSON.parse(JSON.stringify(subItem.chartDatas));
      let colors = ChartOption['color-option']['linearColor'];

      option.yAxis.name = '（%）';
      // option.title.show = true;
      // option.title.text = ``;
      // option.title.subtext = '（元）';

      option.series[0] = JSON.parse(JSON.stringify(option.series[0]));
      option.series[1] = JSON.parse(JSON.stringify(option.series[0]));
      option.series[0].name = 'CPU';
      option.series[1].name = '内存';
      option.legend.data = [option.series[0].name, option.series[1].name];
      option.series[0].lineStyle.color.colorStops = colors.blue;
      option.series[1].lineStyle.color.colorStops = colors.lineGreen;
      option.grid.left = 30;
      option.legend.left = 0;

      option.tooltip.formatter = (params) => {

        let flag = `<span style="display:inline-block;vertical-align:middle;margin-right:3px;width:4px;height:4px;border-radius:100%;background:#fff;"></span>`;
        let cpu = `<span style="margin-left:7px;">CPU月平均利用率：${params[0].value}%</span>`;
        let memory = `<span style="margin-left:7px;">内存月平均利用率：${params[1].value}%</span>`;
        let text = `${flag}${params[0].name}：<br/>${cpu}<br/>${memory}`;
        return text;
      }

      option.series[0].data = chartDatas.map((item) => {
        return item.cpu;
      });
      option.series[1].data = chartDatas.map((item) => {
        return item.memory;
      });
      option.xAxis.data = chartDatas.map((item) => {
        return item.name;
      });

      myChart.setOption(option, true);

      //resize自适应
      this.setResizeFun(myChart);
    },
    drawGauge (myChart, subItem) {

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
      option.series[0].detail.formatter = function (param) {
        return '{rate|' +
          chartDatas.rate + '}{rateCell|%\n}{detailName|' + chartDatas.name + '\n}'
      };
      myChart.setOption(option);

      //resize自适应
      this.setResizeFun(myChart);
    },
    changeTab (val) {
      this.getDatas();
    },
  },
  mounted () {
    this.getDatas();
  }
}
</script>

<style lang="scss" scoped>
.container-component {
  width: 100%;
  height: 50%;
  &:after {
    content: "";
    display: inline-block;
    width: calc(100% - 60px);
    height: 0;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.5);
    margin: 0px 0 20px 30px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
  }
  .chart-item {
    position: relative;
    display: inline-block;
    width: 45%;
    height: 200px;
    .tip {
      position: absolute;
      top: 25px;
      right: 40px;
      z-index: 9999;
      width: 106px;
      height: 32px;
      background: url(../assets/img/矩形.png) no-repeat;
      text-align: center;
      line-height: 32px;
    }
  }
}
</style>
