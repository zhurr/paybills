
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
    <div class="table-wrap">
      <YwTable :tableTitles="tableTitles"
               v-if="!showEmptyDatas.show"
               :tableDatas="tableDatas"
               :option="{'highlight-current-row':true,'enClick':true}"
               @sortTable="sortTable"
               @clickTableRow="clickTableRow"></YwTable>
      <!-- 空判断 -->
      <div class="chart-empty-wrap"
           v-if="showEmptyDatas.show"
           style="width: 100%;height: calc(100% - 30px);">
        <p class="chart-empty">{{showEmptyDatas.content}}</p>
      </div>
      <!-- 空判断 -->
    </div>

    <!-- dialog -->
    <DialogChart :dialogMsg="dialogChart"
                 @closeDialog="closeDialog"
                 v-if="dialogChart.dialogVisible"></DialogChart>
    <!-- dialog -->
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import ChartOption from '@/utils/chartOption.js'
import DrawChart from '@/utils/drawCharts.js'
import ShowEmptyDatas from '@/utils/showEmptyDatas.js'

export default {
  mixins: [DrawChart, ShowEmptyDatas],
  components: {
    DialogChart: () => import('@/components/dialog-chart-line.vue'),
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
      filter: [{ name: '应用系统均峰值利用率', label: 'max' }, { name: '应用系统均值利用率', label: 'avg' }],
      activeFilter: 'max',
      filter2: [{ name: '物理机', label: '物理机' }, { name: '虚拟机', label: '虚拟机' }],
      activeFilter2: '物理机',
      tableTitles: [],
      tableDatas: [],
      //dialogChart
      dialogChart: {
        dialogVisible: false,
        id: '',//预留：每个弹窗数据的唯一标识
        data: {} //预留：数据
      },
    }
  },

  methods: {
    //表格排序
    sortTable (datas) {
      this.tableDatas = datas;
    },
    //表格点击事件
    clickTableRow (row, column, event) {
      this.dialogChart.dialogVisible = true;
      this.dialogChart.data = row;
      this.dialogChart.data.activeFilter = this.activeFilter;
      this.dialogChart.data.activeFilter2 = this.activeFilter2;
    },
    getMaxDatas () {
      let activeFilterName = '均峰值';
      if (this.activeFilter === 'avg') {
        activeFilterName = '均值';
      }
      this.tableTitles = [
        { name: 'bizSystem', title: '租户应用系统名称', style: {} },
        { name: 'cpuMax', title: `CPU${activeFilterName}利用率`, style: { sortable: true, align: 'right', width: 200, 'text-link': true } },
        { name: 'storeMax', title: `内存${activeFilterName}利用率`, style: { sortable: true, align: 'right', width: 200, 'text-link': true } },
      ];

      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
        "deviceType": this.activeFilter2
      };

      this.$axios.post('/v1/cmdb/index/utilization/max/biz', params).then((res) => {
        this.tableDatas = res.data.map((item) => {
          return {
            bizSystem: item.bizSystem,
            cpuMax: item.cpuMax === null ? item.msg : item.cpuMax,
            deviceType: item.deviceType,
            msg: item.msg,
            resourcePool: item.resourcePool,
            storeMax: item.storeMax === null ? item.msg : item.storeMax,

          }
        });
        if (this.tableDatas && this.tableDatas.length > 0) {
          this.showEmptyDatas.show = false;
        } else {
          this.showEmptyDatas.show = true;
        }
      });
    },
    getAvgDatas () {
      let activeFilterName = '均峰值';
      if (this.activeFilter === 'avg') {
        activeFilterName = '均值';
      }
      this.tableTitles = [
        { name: 'bizSystem', title: '租户应用系统名称', style: {} },
        { name: 'cpuAvg', title: `CPU${activeFilterName}利用率`, style: { sortable: true, align: 'right', width: 200, 'text-link': true } },
        { name: 'storeAvg', title: `内存${activeFilterName}利用率`, style: { sortable: true, align: 'right', width: 200, 'text-link': true } },
      ];

      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
        "deviceType": this.activeFilter2
      };

      this.$axios.post('/v1/cmdb/index/utilization/avg/biz', params).then((res) => {
        this.tableDatas = res.data.map((item) => {
          return {
            bizSystem: item.bizSystem,
            cpuAvg: item.cpuAvg === null ? item.msg : item.cpuAvg,
            deviceType: item.deviceType,
            msg: item.msg,
            resourcePool: item.resourcePool,
            storeAvg: item.storeAvg === null ? item.msg : item.storeAvg,

          }
        });
        if (this.tableDatas && this.tableDatas.length > 0) {
          this.showEmptyDatas.show = false;
        } else {
          this.showEmptyDatas.show = true;
        }
      });
    },
    getDatas () {
      if (this.activeFilter === 'max') {
        this.getMaxDatas();
      } else {
        this.getAvgDatas();
      }

    },

    changeTab (val) {
      this.getDatas();
    },
    //关闭弹窗
    closeDialog (val) {
      this.dialogChart.dialogVisible = false;
      if (val === 'update') {

      }

    },
  },
  mounted () {
    this.getDatas();
  }
}
</script>

<style lang="scss" scoped>
.table-wrap {
  padding: 20px 30px;
  height: calc(100% - 90px);
}
</style>
