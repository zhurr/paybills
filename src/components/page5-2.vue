
<template>
  <div class="container-component">
    <section style="width:100%;height:100%;">
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
      <div class="yw-table-wrap">
        <div class="yw-table">
          <div class="yw-table-item yw-table-header">
            <a class="yw-table-inner"
               v-for="(item,index) in tableTitles"
               :key="index">{{item}}</a>
          </div>
          <el-scrollbar class="yw-scrollbar"
                        style="height: 100%">
            <div class="yw-table-item"
                 v-for="(item,index) in tableDatas"
                 :key="index">
              <a class="yw-table-inner"
                 :title="item.name">{{item.name}}</a>
              <a class="yw-table-inner"
                 :title="item.wuliji">{{item.wuliji}}</a>
              <a class="yw-table-inner"
                 :title="item.xuniji">{{item.xuniji}}</a>
            </div>
            <div class="empty-wrap"
                 v-if="!tableDatas || tableDatas.length < 2">
              <img src="../assets/img/img_empty.png"
                   alt="">
            </div>
          </el-scrollbar>
        </div>
      </div>
    </section>

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
      tableTitles: ['租户应用系统名称', 'CPU峰值利用率', '内存峰值利用率'],
      tableDatas: [
        {
          name: '集中化公文系统',
          wuliji: 0,
          xuniji: 137
        },
        {
          name: '集中化人力资源管理系统',
          wuliji: 124,
          xuniji: 148
        },
        {
          name: '集中化公文系统',
          wuliji: 10,
          xuniji: 0
        },
        {
          name: '电子签章平台系统',
          wuliji: 0,
          xuniji: 2
        },
        {
          name: '云化统一信息平台项目',
          wuliji: 0,
          xuniji: 282
        },
        {
          name: '全国统一待办-二期',
          wuliji: 0,
          xuniji: 86
        },
        {
          name: '办公空间',
          wuliji: 14,
          xuniji: 0
        },
        {
          name: '统一待办系统',
          wuliji: 39,
          xuniji: 0
        },
        {
          name: '统一邮件',
          wuliji: 113,
          xuniji: 35
        },
        {
          name: '统一员工门户',
          wuliji: 45,
          xuniji: 0
        },
        {
          name: 'MOA',
          wuliji: 37,
          xuniji: 0
        },
        {
          name: '支撑网测试平台',
          wuliji: 56,
          xuniji: 0
        },
        {
          name: 'OAAI',
          wuliji: 8,
          xuniji: 0
        },
        {
          name: '移动集团数字党建系统',
          wuliji: 2,
          xuniji: 0
        },
        {
          name: '中国移动ERP人力资源集中培训管理系统',
          wuliji: 0,
          xuniji: 15
        },
        {
          name: '中国移动考核平台系统',
          wuliji: 0,
          xuniji: 17
        },

        {
          name: '管理信息系统部OA类系统与全网监控中心FTP服务器',
          wuliji: 0,
          xuniji: 2
        },
        {
          name: '管理信息系统部SMAP认证平台测试验收环境',
          wuliji: 0,
          xuniji: 13
        },
        {
          name: '管理信息系统部MOA测试验收环境',
          wuliji: 0,
          xuniji: 17
        },
        {
          name: '人力资源集中培训管理系统-北京',
          wuliji: 0,
          xuniji: 8
        },
        {
          name: '股权投资管理系统',
          wuliji: 0,
          xuniji: 17
        },
        {
          name: '云化统一信息平台',
          wuliji: 0,
          xuniji: 4
        },
        {
          name: '中国移动党建云平台',
          wuliji: 0,
          xuniji: 105
        }
      ],
    }
  },

  methods: {
    getDatas () {

      if (this.activeFilter == '物理机') {

      } else {

      }

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
  .yw-table-wrap {
    height: calc(100% - 100px) !important;
    margin: 0 auto !important;
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
