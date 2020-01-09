
<template>
  <div class="container clearfix">
    <section class="log-wrap">
      <i class="logo"></i>
      <span class="title">租户IT云资源使用情况</span>
      <span class="date">截至2019年12月底</span>
    </section>
    <section class="flag-wrap">信息技术中心-管理信息系统部</section>
    <section class="main-wrap main-chart">
      <div class="main">
        <div class="left">
          <page5_1 />
          <div class="split"></div>
          <page5_2 />
        </div>
        <div class="right">
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
          <div :id="rightDatas.id"
               style="width: 90%;height: 80%;margin:0 auto;">暂无</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ChartOption from '../utils/chartOption.js'
import DrawChart from '../utils/drawCharts.js'

export default {
  name: 'page5',
  mixins: [DrawChart],
  components: {
    page5_1: () => import('./page5-1.vue'),
    page5_2: () => import('./page5-2.vue'),
  },
  data () {
    return {
      filter: [{ name: '物理机', label: '物理机' }, { name: '虚拟机', label: '虚拟机' }],
      activeFilter: '物理机',
      rightDatas: { id: 'page5-3', chartOption: 'line-option', chartDatas: [] },
    }
  },

  methods: {
    getDatas () {

      if (this.activeFilter == '物理机') {
        this.rightDatas.chartDatas = [
          {
            name: '2019.07',
            cpu: 3.65,
            memory: 19.01
          },
          {
            name: '2019.08',
            cpu: 3.12,
            memory: 18.93
          },
          {
            name: '2019.09',
            cpu: 4.06,
            memory: 19.89
          },
          {
            name: '2019.10',
            cpu: 3.33,
            memory: 19.54
          },
          {
            name: '2019.11',
            cpu: 2.78,
            memory: 19.12
          },
          {
            name: '2019.12',
            cpu: 3.40,
            memory: 19.47
          },
        ];
      } else {
        this.rightDatas.chartDatas = [
          {
            name: '2019.07',
            cpu: 1.32,
            memory: 17.14
          },
          {
            name: '2019.08',
            cpu: 2.13,
            memory: 18.32
          },
          {
            name: '2019.09',
            cpu: 1.54,
            memory: 17.03
          },
          {
            name: '2019.10',
            cpu: 1.87,
            memory: 17.25
          },
          {
            name: '2019.11',
            cpu: 1.68,
            memory: 17.66
          },
          {
            name: '2019.12',
            cpu: 1.95,
            memory: 17.41
          },
        ];
      }
      this.drawCharts(this.rightDatas);
    },

    //绘制图表
    drawCharts (subItem) {
      this.$nextTick(() => {

        let myChart = echarts.init(document.getElementById(subItem.id));
        myChart.clear();

        // 数据格式处理
        switch (subItem.chartOption) {
          case 'pie-option':
            this.drawPie(myChart, subItem);
            break;
          case 'line-option':
            this.drawLine(myChart, subItem);
            break;
        }

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
      option.yAxis.min = 0;
      option.yAxis.max = 50;
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
.left {
  position: relative;
  .split {
    position: absolute;
    top: 48%;
    left: 30px;
    display: inline-block;
    width: calc(100% - 60px);
    height: 0;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.5);
  }
}
.right {
  background: rgba(24, 19, 109, 0.95);
}
</style>
