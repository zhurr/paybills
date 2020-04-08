<template>
  <!-- 业务系统趋势图 -->
  <el-dialog class="yw-dialog"
             v-if="dialogMsg.dialogVisible"
             :append-to-body="true"
             :modal="false"
             width="800px"
             title="租户应用系统利用率趋势"
             :visible.sync="dialogMsg.dialogVisible">
    <span slot="title"
          class="yw-dialog-title">
      利用率趋势：{{dialogMsg.data.bizSystem}}
    </span>
    <div v-if="!emptyData"
         style="width:100%;height:500px;background:#19136E;padding:20px 0 0 20px;">
      <div :id="datas.id"
           style="width: calc(100% - 20px);height: calc(100% - 20px)">正在加载</div>
    </div>
    <!-- 空判断 -->
    <div class="chart-empty-wrap"
         v-if="emptyData"
         style="width:100%;height:300px;">
      <p class="chart-empty">{{emptyData}}</p>
    </div>
    <!-- 空判断 -->
  </el-dialog>

</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import ChartOption from '@/utils/chartOption.js'
import DrawChart from '@/utils/drawCharts.js'
import { fixedNumber } from '@/utils/filter.js'

export default {
  mixins: [DrawChart],
  props: ['dialogMsg'],
  components: {
  },
  computed: {
    ...mapState({
      department1: state => state.user.department1,
      department2: state => state.user.department2,
      monthlyTime: state => state.user.monthlyTime,
    }),
  },
  data () {
    return {
      emptyData: '',
      datas: { id: 'page3-3', chartOption: 'line-option', chartDatas: [] },
    }
  },
  methods: {
    //均峰值
    getMaxDatas () {
      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
        "deviceType": this.dialogMsg.data.activeFilter2,
        "bizSystem": this.dialogMsg.data.bizSystem
      };

      this.$axios.post('/v1/cmdb/index/utilization/max/month', params).then((res) => {
        this.datas.chartDatas = res.data.map((item) => {
          return {
            name: item.statistDate,
            cpu: item.cpuMax,
            memory: item.storeMax,
          }
        });
        this.drawCharts(this.datas);
      });
    },
    //均值
    getAvgDatas () {
      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
        "deviceType": this.dialogMsg.data.activeFilter2,
        "bizSystem": this.dialogMsg.data.bizSystem
      };

      this.$axios.post('/v1/cmdb/index/utilization/avg/month', params).then((res) => {
        this.datas.chartDatas = res.data.map((item) => {
          return {
            name: item.statistDate,
            cpu: item.cpuAvg,
            memory: item.storeAvg,
          }
        });
        this.drawCharts(this.datas);
      });

    },
    getDatas () {
      this.emptyData = '';
      if (this.dialogMsg.data.msg !== "success") {
        this.emptyData = this.dialogMsg.data.msg;
        return false;
      }

      if (this.dialogMsg.data.activeFilter === 'max') {
        this.getMaxDatas();
      } else {
        this.getAvgDatas();
      }
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
        let activeFilterName = '均峰值';
        if (this.dialogMsg.data.activeFilter === 'avg') {
          activeFilterName = '均值';
        }

        let flag = `<span style="display:inline-block;vertical-align:middle;margin-right:3px;width:4px;height:4px;border-radius:100%;background:#fff;"></span>`;
        let cpu = `<span style="margin-left:7px;">CPU${activeFilterName}利用率：${params[0].value}%</span>`;
        let memory = `<span style="margin-left:7px;">内存${activeFilterName}利用率：${params[1].value}%</span>`;
        let text = `${flag}${params[0].name}：<br/>${cpu}<br/>${memory}`;
        return text;
      }

      option.series[0].data = chartDatas.map((item) => {
        return fixedNumber(item.cpu, 2);
      });
      option.series[1].data = chartDatas.map((item) => {
        return fixedNumber(item.memory, 2);
      });

      if (Math.max(...option.series[0].data) > 50 || Math.max(...option.series[1].data) > 50) {
        option.yAxis.max = 100;
      }
      option.xAxis.data = chartDatas.map((item) => {
        return item.name;
      });

      myChart.setOption(option, true);

      //resize自适应
      this.setResizeFun(myChart);
    },
  },
  mounted () {
    this.getDatas();
  }
}

</script>
<style lang="scss" scoped>
</style>
