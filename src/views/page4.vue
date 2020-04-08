
<template>
  <div class="container clearfix">
    <section class="log-wrap">
      <logo></logo>
      <span class="title small">
        {{monthlyTime.split('-')[0]}}年{{monthlyTime.split('-')[1]}}月应用系统性能通报
      </span>
    </section>
    <department></department>
    <section class="main-wrap main-chart">
      <div class="main">
        <div class="left"
             style="width:100%;">
          <div class="chart-title clearfix">
            <span>低利用率应用系统占比统计</span>
            <p class="total-wrap fr">应用系统总数<span class="num">{{bizSysTotal}}</span> <span class="cell">个</span></p>
          </div>
          <!-- 内容 -->
          <div style="width:100%;height:100%"
               v-if="!showEmptyDatas.show">
            <!-- 图表 -->
            <div class="chart-wrap">
              <section class="chart-item"
                       :class="{active:item.active}"
                       style="width:24%;height:100%;"
                       @click="clickChart(item,index)"
                       v-for="(item,index) in chartDatas"
                       :key="index">
                <div :id="item.id"
                     class="chart-box">正在加载</div>
                <div class="chart-desc">
                  <p class="chart-type">{{item.typeObj.name}}</p>
                  <p class="chart-percent">{{item.typeObj.desc}}的应用系统</p>
                  <p class="chart-num">共<span style="color:#FFCC3F">{{item.typeObj.count}}</span>个</p>
                </div>
              </section>
            </div>
            <!-- 图表 -->
            <!-- 表格 -->
            <div class="table-wrap">
              <YwTable :tableTitles="tableTitles"
                       :option="{'active':true}"
                       @sortTable="sortTable"
                       :tableDatas="tableDatas"></YwTable>
              <div class="table-cover"
                   @click="clickTableCover()"
                   v-if="showTableCover"></div>
            </div>
            <!-- 表格 -->
          </div>
          <!-- 内容 -->
          <!-- 空判断 -->
          <div class="chart-empty-wrap"
               v-if="showEmptyDatas.show"
               style="width: 100%;height: calc(100% - 200px);">
            <p class="chart-empty">{{showEmptyDatas.content}}</p>
          </div>
          <!-- 空判断 -->
        </div>
      </div>
    </section>
    <section class="btn-wrap">
      <el-button type="primary"
                 @click="exportAll()"
                 style="margin-right:20px"
                 class="yw-btn-blue-gradient">导出全量数据</el-button>
      <el-button type="primary"
                 @click="exportLow()"
                 class="yw-btn-blue">导出低利用率通报数据</el-button>
      <!-- <el-button type="primary"
                 v-if="activeModule.typeObj.type !=='云存储'"
                 @click="exportLow()"
                 class="yw-btn-blue">导出低利用率通报数据</el-button> -->
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import ChartOption from '@/utils/chartOption.js'
import DrawChart from '@/utils/drawCharts.js'
import ShowEmptyDatas from '@/utils/showEmptyDatas.js'
import QueryObject from '@/utils/queryObject.js'
import { divisionNumber, fixedNumber } from '@/utils/filter.js'

export default {
  name: 'page4',
  mixins: [DrawChart, ShowEmptyDatas, QueryObject],
  components: {
    department: () => import('@/components/department.vue'),
    logo: () => import('../components/logo.vue'),
    PageTitle: () => import('../components/page-title.vue'),
    YwTable: () => import('@/components/yw-table.vue'),
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
      //应用系统总数
      bizSysTotal: 0,
      //第几个模块选中
      activeModule: {
        typeObj: { name: '物理机CPU及内存', type: '物理机', desc: '峰值利用率低于30%', moduleFlag: 0 }
      },
      showTableCover: true,
      tableTitles: [],
      tableDatas: [],
      chartDatas: [{ id: 'page4-1-1', chartOption: 'pie-option', chartDatas: [], typeObj: { count: 0, name: '物理机CPU及内存', type: '物理机', desc: '峰值利用率低于30%', moduleFlag: 0 }, active: true },
      { id: 'page4-1-2', chartOption: 'pie-option', chartDatas: [], typeObj: { count: 0, name: '虚拟机CPU', type: '虚拟机', desc: '峰值利用率低于30%', moduleFlag: 1 }, active: false },
      { id: 'page4-1-3', chartOption: 'pie-option', chartDatas: [], typeObj: { count: 0, name: '虚拟机内存', type: '虚拟机', desc: '峰值利用率低于30%', moduleFlag: 2 }, active: false },
      { id: 'page4-1-4', chartOption: 'pie-option', chartDatas: [], typeObj: { count: 0, name: '云存储', type: '云存储', desc: '资源利用率低于40%', moduleFlag: 3 }, active: false }]
    }
  },

  methods: {
    //表格排序
    sortTable (datas) {
      this.tableDatas = datas;
    },
    //表格遮罩是否展示
    clickTableCover () {
      this.showTableCover = false;
    },
    //图表点击
    clickChart (item, index) {
      this.activeModule.typeObj = item.typeObj;
      this.showTableCover = true;
      this.getTableDatas();
      this.chartDatas.forEach((item) => {
        item.active = false;
      });
      item.active = true;

    },
    //获得系统总数
    getTotalDatas () {
      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
      };

      return this.$axios.post('/v1/cmdb/index/getBizSystemTotal', params).then((res) => {
        return res.data.count;
      });
    },
    //物理机
    getWulijiDatas () {
      this.chartDatas[0].chartDatas = [
        {
          name: '占比',
          value: 0
        },
        {
          name: '',
          value: 100 - 0
        }
      ];

      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
      };

      this.$axios.post('/v1/cmdb/index/bisSystem/pmCount', params).then((res) => {
        let value = divisionNumber((Number(res.data.account) || 0) * 100, Number(this.bizSysTotal), 2);
        this.chartDatas[0].chartDatas[0].value = value;
        this.chartDatas[0].chartDatas[1].value = 100 - value;
        this.chartDatas[0].typeObj.count = res.data.listCount;
        this.drawCharts(this.chartDatas[0]);
      });
    },
    //虚拟机
    getXunijiDatas (hardwareType = 'CPU') {
      this.chartDatas[1].chartDatas = [
        {
          name: '占比',
          value: 0
        },
        {
          name: '',
          value: 100 - 0
        }
      ];
      this.chartDatas[2].chartDatas = [
        {
          name: '占比',
          value: 0
        },
        {
          name: '',
          value: 100 - 0
        }
      ];
      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
        "hardwareType": hardwareType
      };

      this.$axios.post('/v1/cmdb/index/bisSystem/vmCount', params).then((res) => {
        let value = divisionNumber(Number(res.data.account || 0) * 100, this.bizSysTotal, 2);
        if (hardwareType === 'CPU') {
          this.chartDatas[1].chartDatas[0].value = value;
          this.chartDatas[1].chartDatas[1].value = 100 - value;
          this.chartDatas[1].typeObj.count = res.data.listCount;
          this.drawCharts(this.chartDatas[1]);
        } else {
          this.chartDatas[2].chartDatas[0].value = value;
          this.chartDatas[2].chartDatas[1].value = 100 - value;
          this.chartDatas[2].typeObj.count = res.data.listCount;
          this.drawCharts(this.chartDatas[2]);
        }

      });
    },
    //存储
    getStoreDatas () {
      this.chartDatas[3].chartDatas = [
        {
          name: '占比',
          value: 0
        },
        {
          name: '',
          value: 100 - 0
        }
      ];

      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
      };

      this.$axios.post('/v1/cmdb/index/bisSystem/storeCount', params).then((res) => {
        let value = divisionNumber(Number(res.data.account || 0) * 100, this.bizSysTotal, 2);
        this.chartDatas[3].chartDatas[0].value = value;
        this.chartDatas[3].chartDatas[1].value = 100 - value;
        this.chartDatas[3].typeObj.count = res.data.listCount;
        this.drawCharts(this.chartDatas[3]);
      });
    },

    //表格
    getTableDatas () {

      this.tableTitles = [
        { name: 'bizSystem', title: `应用系统 (${this.activeModule.typeObj.name}${this.activeModule.typeObj.desc})`, style: {} },
        { name: 'resourcePool', title: `所属资源池`, style: {} },
        { name: 'cpuMax', title: `${this.activeModule.typeObj.type}CPU峰值利用率`, style: { sortable: true, align: 'right', width: 200, 'text-link': true } },
        { name: 'storeMax', title: `${this.activeModule.typeObj.type}内存峰值利用率`, style: { sortable: true, align: 'right', width: 200, 'text-link': true } },
      ];

      if (this.activeModule.typeObj.type === '云存储') {
        this.tableTitles = [
          { name: 'bizSystem', title: `应用系统 (${this.activeModule.typeObj.name}${this.activeModule.typeObj.desc})`, style: {} },
          { name: 'resourcePool', title: `所属资源池`, style: {} },
          { name: 'cloudStore', title: `存储利用率`, style: { sortable: true, align: 'right', width: 200, 'text-link': true } },
        ];
        this.getStoreTableDatas();
      } else {
        this.getWuxuTableDatas();
      }
    },

    //获得物理机、虚拟机表格数据
    getWuxuTableDatas () {
      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
        "deviceType": this.activeModule.typeObj.type,
        "moduleFlag": this.activeModule.typeObj.moduleFlag + 1
      };

      this.$axios.post('/v1/cmdb/index/bisSystem/list/cal', params).then((res) => {
        this.tableDatas = res.data;
      });
    },

    //获得存储表格数据
    getStoreTableDatas () {
      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
      };

      this.$axios.post('/v1/cmdb/index/bisSystem/list/store', params).then((res) => {
        this.tableDatas = res.data;
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
        }

      })

    },
    drawPie (myChart, subItem) {
      // 数据格式处理(扇叶放大效果【2个series重叠】)
      let option = JSON.parse(JSON.stringify(ChartOption[subItem.chartOption]))
      let chartDatas = JSON.parse(JSON.stringify(subItem.chartDatas))
      let colorSource = ChartOption['color-option']['linearColor']
      let colors = [colorSource.pieYellow, colorSource.pieBlueDark];

      option.series[0] = JSON.parse(JSON.stringify(option.series[0]));
      option.series[1] = JSON.parse(JSON.stringify(option.series[0]));

      option.title.show = true
      option.title.text = `占比 ${chartDatas[0].value}%`
      option.title.subtext = ''
      option.title.x = '50%'
      option.title.y = '45%'
      option.legend.show = false;
      option.tooltip.show = false;
      option.series[0].name = '';
      option.series[0].label.show = false;
      option.series[0].itemStyle.color = function (item) {
        let colors = ['transparent', '#391FCE'];
        return colors[item.dataIndex];
      }
      option.series[0].data = chartDatas;

      option.series[1].name = '';
      option.series[1].label.show = false;
      option.series[1].radius = ['55%', '85%'];
      option.series[1].itemStyle.color = function (item) {
        let colors = ['#FFCC3F', 'transparent'];
        return colors[item.dataIndex]
      }
      option.series[1].data = chartDatas;


      myChart.setOption(option)

      // resize自适应
      this.setResizeFun(myChart)
    },
    //导出全量数据
    exportAll () {
      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime
      };
      let excelName = this.department1;
      if (this.department2) {
        excelName = `${this.department1}-${this.department2}`;
      }
      this.$axios.post('/v1/cmdb/index/export/all', params, { responseType: 'blob' }).then((res) => {
        this.exportFiles({
          data: res.data,
          fileType: 'application/vnd.ms-excel',
          fileName: excelName
        });
      });
    },
    //导出低利用率
    exportLow () {
      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
        // "deviceType": this.activeModule.typeObj.type,
        // "moduleFlag": this.activeModule.typeObj.moduleFlag + 1
      };
      let excelName = this.department1;
      if (this.department2) {
        excelName = `${this.department1}-${this.department2}`;
      }
      this.$axios.post('/v1/cmdb/index/export/part', params, { responseType: 'blob' }).then((res) => {
        this.exportFiles({
          data: res.data,
          fileType: 'application/vnd.ms-excel',
          fileName: excelName
        });
      });

    },
    async getDatas () {
      this.bizSysTotal = await this.getTotalDatas();
      this.getWulijiDatas();
      this.getXunijiDatas('CPU');
      this.getXunijiDatas('内存');
      this.getStoreDatas();
      this.getTableDatas();
    }
  },
  mounted () {
    this.getDatas();
  }
}
</script>

<style lang="scss" scoped>
.left {
  background: rgba(24, 19, 109, 0.95);
  .chart-title {
    .total-wrap {
      font-size: 16px;
      color: #ffffff;
      .num {
        font-size: 28px;
        color: #ffffff;
        margin-left: 20px;
        margin-right: 2px;
      }
      .cell {
        font-size: 16px;
        color: #ffffff;
      }
    }
  }
  .chart-wrap {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    width: 100%;
    height: 390px;
    padding: 20px 30px 0px 30px;
    .chart-item {
      position: relative;
      background: rgba(255, 255, 255, 0.05);
      border: 4px solid transparent;
      cursor: pointer;
      .chart-box {
        width: 100%;
        height: calc(100% - 120px);
        margin: 0 auto;
      }

      .chart-desc {
        position: absolute;
        bottom: 10px;
        display: inline-block;
        width: 100%;
        height: 100px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        .chart-num {
          font-size: 16px;
        }
        .chart-type {
          margin-bottom: 10px;
        }
        .chart-percent {
          margin-bottom: 20px;
        }
      }

      &.active {
        border: 4px solid #0d7ef4;
        &:after,
        &:before {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border: 16px solid transparent;
          border-top-color: #0d7ef4;
          left: 50%;
          margin-left: -16px;
          bottom: -32px;
        }
        &:after {
          border-top-color: #261f76;
          bottom: -26px;
        }
      }
    }
  }
  .table-wrap {
    position: relative;
    padding: 20px 30px;
    height: calc(100% - 440px);
  }
}
.btn-wrap {
  margin-top: 20px;
  text-align: center;
}
</style>
