
<template>
  <div class="container clearfix">
    <section class="log-wrap">
      <i class="logo"></i>
      <span class="title">租户IT云资源使用情况</span>
      <span class="date">截至2019年12月底</span>
    </section>
    <section class="flag-wrap">信息技术中心-管理信息系统部</section>
    <section class="main-wrap">
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
              <p class="num">448</p>
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
              <el-scrollbar style="height: 100%;">
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
          num: '608.16',
          cell: '已分配总量(T)'
        },
        {
          title: '存储资源 ：IP-SAN',
          num: '0',
          cell: '已分配总量(T)'
        },
        {
          title: '存储资源 ：块存储',
          num: '608.16',
          cell: '已分配总量(T)'
        }, {
          title: '存储资源 ：文件存储',
          num: '608.16',
          cell: '已分配总量(T)'
        },
        {
          title: '存储资源 ：对象存储N',
          num: '608.16',
          cell: '已分配总量(T)'
        },
        {
          title: '存储资源 ：备份存储',
          num: '608.16',
          cell: '已分配总量(T)'
        }
      ],
      tableTitles: ['租户应用系统名称', '物理机分配总量(台)', '虚拟机分配总量(台)'],
      tableDatas: [
        {
          name: '中国移动党建云平台',
          wuliji: '0',
          xuniji: '105'
        },
        {
          name: '中国移动党建云平台',
          wuliji: '120',
          xuniji: '10'
        },
        {
          name: '中国移动党建云平台',
          wuliji: '34',
          xuniji: '0'
        },
        {
          name: '中国移动党建云平台',
          wuliji: '0',
          xuniji: '105'
        },
        {
          name: '中国移动党建云平台',
          wuliji: '120',
          xuniji: '10'
        },
        {
          name: '中国移动党建云平台',
          wuliji: '34',
          xuniji: '0'
        },
        {
          name: '中国移动党建云平台',
          wuliji: '34',
          xuniji: '0'
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
.main-wrap {
  padding: 50px 70px 20px 50px;
  .main {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .left {
      width: 50.5%;
      height: 764px;
      background: rgba(24, 19, 109, 0.95);
      .title {
        font-size: 18px;
        color: #ffffff;
        letter-spacing: 0;
        padding: 20px;
        margin-bottom: 20px;
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
      .yw-table-wrap {
        border: 1px solid rgba(255, 255, 255, 0.2);
        margin: 80px 50px 50px 50px;
        padding: 10px;
        .yw-table {
          .yw-table-item {
            height: 33px;
            line-height: 33px;
            font-size: 14px;
            color: #ffffff;
            letter-spacing: 0;
            padding: 0 30px;
            &:nth-of-type(even) {
              background: rgba(255, 255, 255, 0.05);
            }
            .yw-table-inner {
              display: inline-block;
              &:nth-child(1) {
                width: 50%;
              }
              &:nth-child(2) {
                width: 24%;
                text-align: right;
              }
              &:nth-child(3) {
                width: 24%;
                text-align: right;
              }
            }
            &.yw-table-header {
              height: 30px;
              line-height: 30px;
              font-size: 14px;
              color: #bbcee4;
              letter-spacing: 0;
              background: rgba(255, 255, 255, 0.05);
            }
          }
        }
      }
    }
    .right {
      width: 48%;
      height: 764px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      align-content: space-between;
      .right-item {
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
          font-size: 38px;
          color: #ffffff;
          letter-spacing: 0;
          text-align: center;
          margin: 45px 0 30px 0;
        }
        .cell {
          font-size: 14px;
          color: #ffffff;
          letter-spacing: 0;
          line-height: 30px;
          text-align: center;
        }
      }
    }
  }
}
</style>
