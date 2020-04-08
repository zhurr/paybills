
<template>
  <div class="container-component">
    <div class="chart-title clearfix">
      <span>{{monthlyTime.split('-')[0]}}年{{monthlyTime.split('-')[1]}}月资源利用率</span>
      <el-tooltip placement="bottom"
                  popper-class="yw-tooltip">
        <div slot="content">均峰值为：租户下所有资源<br />每个采集点利用率均值，<br />针对采集点在一个月内最大值</div>
        <i class="el-icon-question"></i>
      </el-tooltip>
      <el-radio-group v-model="activeFilter"
                      @change="changeTab"
                      class="yw-radio-button fr">
        <el-radio-button :label="item.label"
                         v-for="(item,index) in filter"
                         :key="index">{{item.name}}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="chart-wrap"
         v-if="!showEmptyDatas.show">
      <section class="chart-item"
               v-for="(item,index) in gaugeDatas"
               :key="index">
        <p class="tip"
           style=" width: 106px;
      height: 32px;line-height: 32px;"
           v-if="item.chartDatas.rate < 20">利用率太低啦～</p>
        <div class="content">
          <p class="chart-percent">{{item.chartDatas.rate}}<span class="chart-percent-cell">%</span></p>
          <p class="chart-change-wrap">
            同比上月份<span class="chart-change-percent">
              <span class="down"
                    v-if="item.chartDatas.change<0"><i class="arrow">↓</i>{{-item.chartDatas.change}}%</span>
              <span class="up"
                    v-else><i class="arrow">↑</i>{{item.chartDatas.change}}%</span>
            </span>
          </p>
          <p class="chart-name">{{item.chartDatas.name}}</p>
        </div>

        <div :id="item.id"
             style="width: 100%;height: 100%;margin:0 auto;">正在加载</div>
      </section>
    </div>
    <!-- 空判断 -->
    <div class="chart-empty-wrap"
         v-if="showEmptyDatas.show"
         style="width: 100%;height: calc(100% - 200px);">
      <p class="chart-empty">{{showEmptyDatas.content}}</p>
    </div>
    <!-- 空判断 -->
    <div class="tip-wrap"
         v-if="tipDate.text">
      <i class="tip-img"></i>
      <span class="tip">{{tipDate.cur}}资源{{tipDate.text}}利用率太低！{{tipDate.next}}继续加油啊～</span>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import ChartOption from '@/utils/chartOption.js'
import DrawChart from '@/utils/drawCharts.js'
import ShowEmptyDatas from '@/utils/showEmptyDatas.js'

export default {
  name: 'page3',
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
      //提示日期
      tipDate: {
        text: '',
        cur: '',
        next: ''
      },
      filter: [{ name: '物理机', label: '物理机' }, { name: '虚拟机', label: '虚拟机' }],
      activeFilter: '物理机',
      gaugeDatas: [{ id: 'page3-1-1', chartOption: 'gauge-option', chartDatas: { name: 'CPU均峰值利用率', rate: 0, change: 0 } },
      { id: 'page3-1-2', chartOption: 'gauge-option', chartDatas: { name: 'CPU均值利用率', rate: 0, change: 0 } },
      { id: 'page3-1-3', chartOption: 'gauge-option', chartDatas: { name: '内存均峰值利用率', rate: 0, change: 0 } },
      { id: 'page3-1-4', chartOption: 'gauge-option', chartDatas: { name: '内存均值利用率', rate: 0, change: 0 } }],
    }
  },

  methods: {
    //获得提示日期
    getTipDate () {
      this.gaugeDatas.some((item, index) => {
        if (item.chartDatas.rate < 20) {
          if (index % 2 == 0) {
            this.tipDate.text = '均峰值';
          } else {
            this.tipDate.text = '均值';
          }

          return true;
        }
      });
      let curDate = Number(this.monthlyTime.split('-')[1]);
      if (curDate < 12) {
        this.tipDate.cur = curDate + '月份';
        this.tipDate.next = curDate + 1 + '月份';
      } else {
        this.tipDate.cur = curDate + '月份';
        this.tipDate.next = '下一年';
      }

    },

    //判断采集情况
    isEmpty () {
      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
        "deviceType": this.activeFilter,
        "tableType": "max",
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
    //峰值
    getMaxDatas () {
      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
        "deviceType": this.activeFilter
      };

      this.$axios.post('/v1/cmdb/index/utilization/monthContrast/max', params).then((res) => {
        this.gaugeDatas[0].chartDatas.rate = Number(res.data.current.cpuMax || 0).toFixed(2);
        this.gaugeDatas[0].chartDatas.change = (Number(res.data.current.cpuMax || 0) - Number(res.data.previous.cpuMax || 0)).toFixed(2);
        this.gaugeDatas[2].chartDatas.rate = Number(res.data.current.storeMax || 0).toFixed(2);
        this.gaugeDatas[2].chartDatas.change = (Number(res.data.current.storeMax || 0) - Number(res.data.previous.storeMax || 0)).toFixed(2);
        this.drawCharts(this.gaugeDatas[0]);
        this.drawCharts(this.gaugeDatas[2]);
        this.getTipDate();
      });
    },
    //均值
    getAvgDatas () {
      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
        "deviceType": this.activeFilter
      };

      this.$axios.post('/v1/cmdb/index/utilization/monthContrast/avg', params).then((res) => {
        this.gaugeDatas[1].chartDatas.rate = Number(res.data.current.cpuAvg || 0).toFixed(2);
        this.gaugeDatas[1].chartDatas.change = (Number(res.data.current.cpuAvg || 0) - Number(res.data.previous.cpuAvg || 0)).toFixed(2);
        this.gaugeDatas[3].chartDatas.rate = Number(res.data.current.storeAvg || 0).toFixed(2);
        this.gaugeDatas[3].chartDatas.change = (Number(res.data.current.storeAvg || 0) - Number(res.data.previous.storeAvg || 0)).toFixed(2);
        this.drawCharts(this.gaugeDatas[1]);
        this.drawCharts(this.gaugeDatas[3]);
        this.getTipDate();
      });
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
      // option.series[0].detail.formatter = function (param) {
      //   let change = 0;
      //   let changeStyle = 'changeNum';
      //   if (chartDatas.change >= 0) {
      //     change = ` ↑ ${chartDatas.change}%`;
      //     changeStyle = 'changeNum';
      //   } else {
      //     change = ` ↓ ${-chartDatas.change}%`;
      //     changeStyle = 'changeNumDown';
      //   }



      //   return '{rate|' +
      //     chartDatas.rate + '}{rateCell|%\n}{changeName|同比上月份}{' + changeStyle + '|' +
      //     change + '}\n{detailName|' + chartDatas.name + '\n}'
      // };
      myChart.setOption(option);

      //resize自适应
      this.setResizeFun(myChart);
    },
    getDatas () {
      this.getMaxDatas();
      this.getAvgDatas();
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
.container-component {
  position: relative;
  width: 100%;
  height: 100%;

  .chart-wrap {
    width: 100%;
    height: calc(100% - 200px);
    margin-top: 30px;
  }
  .chart-item {
    position: relative;
    display: inline-block;
    width: 45%;
    height: 50%;
    .tip {
      position: absolute;
      top: 15%;
      left: 60%;
      z-index: 9999;
      background: url(../assets/img/矩形.png) no-repeat;
      background-size: contain;
      text-align: center;
      font-size: 12px;
    }
    .content {
      position: absolute;
      left: 0;
      top: 80px;
      width: 100%;
      height: 100%;
      text-align: center;
      z-index: 99;
    }
    .chart-percent {
      font-size: 24px;
      color: #ffffff;
      margin-bottom: 15px;
      .chart-percent-cell {
        font-size: 16px;
      }
    }
    .chart-change-wrap {
      font-size: 12px;
      color: #574fb6;
      margin-bottom: 15px;
      .chart-change-percent {
        // padding: 3px 5px;
        // background: #0dbe9c;
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
        .arrow {
          font-weight: 600;
          display: inline-block;
          vertical-align: text-top;
          margin-top: -4px;
          font-size: 14px;
        }
      }
    }
    .chart-name {
      font-size: 14px;
    }
  }
  .tip-wrap {
    position: absolute;
    bottom: 30px;
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
