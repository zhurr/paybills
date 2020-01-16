
<template>
  <div class="container-component">
    <div class="chart-title clearfix">
      <span>2019年度资源峰值利用率</span>
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
        <div :id="item.id"
             style="width: 100%;height: 100%;margin:0 auto;">暂无</div>
      </section>
    </div>
    <div class="tip-wrap">
      <i class="tip-img"></i>
      <span class="tip">2019年度资源平均利用率太低！2020年继续加油啊～</span>
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
      rightDatas: [{ id: 'page5-2-1', chartOption: 'gauge-option', chartDatas: [] },
      { id: 'page5-2-2', chartOption: 'gauge-option', chartDatas: [] }],
    }
  },

  methods: {
    getDatas () {

      if (this.activeFilter == '物理机') {
        this.rightDatas[0].chartDatas = {
          name: 'CPU峰值资源利用率',
          rate: 20.69  //0%
        };
        this.rightDatas[1].chartDatas = {
          name: '内存峰值资源利用率',
          rate: 38.00  //0%
        };
      } else {
        this.rightDatas[0].chartDatas = {
          name: 'CPU峰值资源利用率',
          rate: 17.12 //0%
        };
        this.rightDatas[1].chartDatas = {
          name: '内存峰值资源利用率',
          rate: 25.89 //0%
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

      option.series[0].axisLine.lineStyle.color = colors.gaugePurple;
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
  position: relative;
  width: 100%;
  height: 50%;
  .chart-wrap {
    width: 100%;
    height: calc(100% - 80px);
  }
  .chart-item {
    position: relative;
    display: inline-block;
    width: 45%;
    height: 100%;
  }
  .tip-wrap {
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 100%;
    text-align: center;
    .tip-img {
      display: inline-block;
      vertical-align: middle;
      width: 50px;
      height: 66px;
      background: url(../assets/img/ico_tips.png) no-repeat;
    }
    .tip {
      display: inline-block;
      height: 66px;
      line-height: 80px;
      vertical-align: middle;
      margin-left: 5px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}
</style>
