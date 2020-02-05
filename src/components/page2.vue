
<template>
  <div class="container clearfix">
    <section class="log-wrap">
      <i class="logo"></i>
      <span class="title small">IT云资源使用量（截至2020年01月底）</span>
      <!-- <span class="date">截至2019年12月底</span> -->
    </section>
    <section class="flag-wrap">信息技术中心-管理信息系统部</section>
    <section class="main-wrap main-chart">
      <div class="main">
        <div class="left">
          <p class="title">计算资源</p>
          <div class="gaugle-wrap">
            <div class="gaugle-item">
              <p class="num">448</p>
              <p class="name">物理机已分配总量</p>
              <p class="name">（台）</p>
            </div>
            <div class="gaugle-item">
              <p class="num">888</p>
              <p class="name">虚拟机已分配总量</p>
              <p class="name">（台）</p>
            </div>
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
        </div>
        <div class="right">
          <div class="right-item"
               v-for="(item,index) in rightDatas"
               :key="index">
            <p class="title">{{item.title}}</p>
            <p class="num">{{item.num}}</p>
            <p class="cell">{{item.cell}}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

export default {
  name: 'page2',
  components: {

  },
  data () {
    return {
      rightDatas: [
        {
          title: '存储资源 ：FC-SAN',
          num: 608.19,
          cell: '已分配总量(T)'
        },
        {
          title: '存储资源 ：IP-SAN',
          num: 0,
          cell: '已分配总量(T)'
        },
        {
          title: '存储资源 ：块存储',
          num: 608.19,
          cell: '已分配总量(T)'
        }, {
          title: '存储资源 ：文件存储',
          num: 1252.6,
          cell: '已分配总量(T)'
        },
        {
          title: '存储资源 ：对象存储N',
          num: 3,
          cell: '已分配总量(T)'
        },
        {
          title: '存储资源 ：备份存储',
          num: 808.7,
          cell: '已分配总量(T)'
        }
      ],
      tableTitles: ['租户应用系统名称', '物理机分配总量(台)', '虚拟机分配总量(台)'],
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

  },
  mounted () {

  }
}
</script>

<style lang="scss" scoped>
.left {
  .empty-wrap {
    text-align: center;
  }
  .title {
    font-size: 18px;
    color: #ffffff;
    letter-spacing: 0;
    padding: 20px;
  }
  .gaugle-wrap {
    display: flex;
    justify-content: space-around;
    padding: 0 70px;
    .gaugle-item {
      position: relative;
      width: 224px;
      height: 172px;
      background: url(../assets/img/img_wuliji.png) no-repeat;
      &:nth-of-type(2) {
        background: url(../assets/img/img_xuniji.png) no-repeat;
      }
      .num {
        font-size: 38px;
        color: #f04aa6;
        letter-spacing: 0;
        text-align: center;
        margin: 60px 0 20px;
      }
      .name {
        font-size: 18px;
        color: #ffffff;
        letter-spacing: 0;
        text-align: center;
      }
    }
  }
}
.right {
  .right-item {
    position: relative;
    width: 48.5%;
    height: 31%;
    background: #2d72fd;
    .title {
      font-size: 18px;
      color: #ffffff;
      letter-spacing: 0;
      padding: 20px 0 0 20px;
    }
    .num {
      position: absolute;
      width: 100%;
      top: 50%;
      margin-top: -20px;
      font-size: 38px;
      color: #ffffff;
      letter-spacing: 0;
      text-align: center;
    }
    .cell {
      position: absolute;
      width: 100%;
      bottom: 20px;
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 0;
      text-align: center;
    }
  }
}
</style>
