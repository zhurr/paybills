
<template>
  <div>
    <div class="chart-title clearfix">
      <el-tabs class="yw-tabs overall"
               v-model="activeFilter"
               type="card"
               @tab-click="changeTab">
        <el-tab-pane :label="item.name"
                     v-for="(item,index) in filter"
                     :key="index"
                     :name="item.label"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="clearfix">
      <el-radio-group v-model="activeFilter2"
                      @change="changeTab"
                      class="yw-radio-button fr"
                      style="margin-right:30px">
        <el-radio-button :label="item.label"
                         v-for="(item,index) in filter2"
                         :key="index">{{item.name}}</el-radio-button>
      </el-radio-group>
    </div>
    <!-- 空判断 -->
    <div class="chart-empty-wrap ssss"
         v-if="showEmptyDatas.show"
         style="width: 100%;height: calc(100% - 60px);">
      <p class="chart-empty">{{showEmptyDatas.content}}</p>
    </div>
    <!-- 空判断 -->
    <div style="width: 100%;height: calc(100% - 60px);padding:0 20px;"
         v-if="!(showEmptyDatas.show)">
      <div :id="rightDatas.id"
           style="width: 100%;height: 100%;">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import ChartOption from '@/utils/chartOption.js'
import DrawChart from '@/utils/drawCharts.js'
import ShowEmptyDatas from '@/utils/showEmptyDatas.js'
import { fixedNumber } from '@/utils/filter.js'

export default {
  mixins: [DrawChart, ShowEmptyDatas],
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
      filter: [{ name: '月度利用率均峰值趋势', label: 'max' }, { name: '月度利用率均值趋势', label: 'avg' }],
      activeFilter: 'max',
      filter2: [{ name: '物理机', label: '物理机' }, { name: '虚拟机', label: '虚拟机' }],
      activeFilter2: '物理机',
      rightDatas: { id: 'page3-2', chartOption: 'line-option', chartDatas: [] },
    }
  },

  methods: {
    //判断采集情况
    isEmpty () {
      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
        "deviceType": this.activeFilter2,
        "tableType": this.activeFilter,
      };

      this.$axios.post('/v1/cmdb/index/judge/status', params).then((res) => {
        if (res.data && res.data.flag) {
          this.changeEmptyDatas(false, res.data.msg);
          this.getDatas();
        } else {
          this.changeEmptyDatas(true, res.data.msg);
        }
      }).catch((error) => {
        this.changeEmptyDatas(true, '数据服务器崩溃了,请联系管理员！');
      });
    },
    //均峰值
    getMaxDatas () {
      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
        "deviceType": this.activeFilter2
      };

      this.$axios.post('/v1/cmdb/index/utilization/max/month', params).then((res) => {
        this.rightDatas.chartDatas = res.data.map((item) => {
          return {
            name: item.statistDate,
            cpu: item.cpuMax,
            memory: item.storeMax,
          }
        });
        this.drawCharts(this.rightDatas);
      });
    },
    //均值
    getAvgDatas () {
      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
        "deviceType": this.activeFilter2
      };

      this.$axios.post('/v1/cmdb/index/utilization/avg/month', params).then((res) => {
        this.rightDatas.chartDatas = res.data.map((item) => {
          return {
            name: item.statistDate,
            cpu: item.cpuAvg,
            memory: item.storeAvg,
          }
        });
        this.drawCharts(this.rightDatas);
      });
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
        if (this.activeFilter === 'avg') {
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
        // let name = item.name.split('-');
        // return `${name[1]}.${name[2]}`;
        return item.name;
      });

      myChart.setOption(option, true);

      //resize自适应
      this.setResizeFun(myChart);
    },
    getDatas () {
      if (this.activeFilter === 'max') {
        this.getMaxDatas();
      } else {
        this.getAvgDatas();
      }

    },
    changeTab (val) {
      // this.getDatas();
      this.isEmpty();
    },
  },
  mounted () {
    this.isEmpty();
  }
}
</script>

<style lang="scss" scoped>
</style>
