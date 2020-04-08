
<template>
  <div class="container clearfix">
    <section class="log-wrap">
      <logo></logo>
      <span class="title small">
        IT云资源使用量（截至{{monthlyTime.split('-')[0]}}年{{monthlyTime.split('-')[1]}}月底）
      </span>
    </section>
    <department></department>
    <section class="main-wrap main-chart">
      <div class="main">
        <div class="left"
             style="width:65%;">
          <!-- 仪表盘 -->
          <div class="chart-wrap"
               v-if="!showEmptyDatas.show"
               style="height:50%">
            <section class="chart-item"
                     style="width:40%;height:100%;"
                     v-for="item in leftDatas.slice(0,2)"
                     :key="item.deviceType">
              <p class="title">{{item.deviceType}}{{item.moduleType}}</p>
              <div class="gaugle-wrap">
                <p class="gaugle-num text-ellipse"
                   :title="item.amount">{{item.amount}}</p>
                <p class="gaugle-name">{{item.deviceType}}已分配({{item.unit}})</p>
                <p class="gaugle-use">使用量(台)：{{item.useAllocation}}</p>
              </div>
              <div class="split-tip">
                <p class="tip">本月申请资源数量({{item.unit}})<span class="tip-num">{{item.apply}}</span></p>
                <p class="tip">本月回收资源数量({{item.unit}})<span class="tip-num">{{item.recycle}}</span></p>
              </div>
              <div class="progress-wrap">
                <YwProgress :datas="{percentage:item.percent,index:-1}"
                            :option="progressOption"></YwProgress>
                <p class="progress-content clearfix">
                  <span class="name text-ellipse"
                        title="未部署采集点数量">未部署采集点数量</span>
                  <span class="name text-ellipse fr"
                        style="text-align:right"
                        :title='`${item.percent}%，${item.undeploy}个`'>{{item.percent}}%，{{item.undeploy}}个</span>
                </p>
              </div>
            </section>
            <section class="chart-item"
                     style="width:16%;height:100%"
                     v-for="item in leftDatas.slice(2)"
                     :key="item.deviceType">
              <p class="title">{{item.deviceType}}{{item.moduleType}}</p>
              <div>
                <p class="gaugle-num text-ellipse"
                   :title="item.amount"
                   style="color: #2D72FD;">{{item.amount}}</p>
                <p class="gaugle-name">{{item.deviceType}}已分配({{item.unit}}</p>
                <p class="gaugle-use">使用量(台)：{{item.useAllocation}}</p>
              </div>
              <div class="footer-tip">
                <p class="tip">本月申请资源数量({{item.unit}})<span class="tip-num">{{item.apply}}</span></p>
                <p class="tip">本月回收资源数量({{item.unit}})<span class="tip-num">{{item.recycle}}</span></p>
              </div>

            </section>
          </div>

          <!-- 空判断 -->
          <div class="chart-empty-wrap"
               v-if="showEmptyDatas.show"
               style="width: 100%;height: 50%;">
            <p class="chart-empty">{{showEmptyDatas.content}}</p>
          </div>
          <!-- 空判断 -->

          <!-- 仪表盘 -->
          <!-- 表格 -->
          <div class="table-wrap"
               style="height:48%">
            <page2_table></page2_table>
          </div>
        </div>

        <!-- 右 -->
        <div class="right"
             style="width:33.5%;">
          <div class="right-item"
               v-for="(item,index) in rightDatas"
               :key="index">
            <p class="title">{{item.moduleType}}：{{item.deviceType}}</p>
            <section class="content">
              <p class="num">{{item.amount}}</p>
              <p class="cell">已分配({{item.unit}})</p>
              <p class="total">使用量(T)：{{item.useAllocation || 0}} </p>
            </section>
            <section class="footer-tip">
              <div class="footer-item">
                <p class="num text-ellipse"
                   :title="item.apply">{{item.apply}}</p>
                <p>本月申请数量({{item.unit}})</p>
              </div>
              <div class="footer-item">
                <p class="num text-ellipse"
                   :title="item.recycle">{{item.recycle}}</p>
                <p>本月回收数量({{item.unit}})</p>
              </div>
            </section>

          </div>
        </div>
        <!-- 右 -->
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import ShowEmptyDatas from '@/utils/showEmptyDatas.js'
import { fixedNumber, divisionNumber } from '@/utils/filter.js'

export default {
  name: 'page2',
  mixins: [ShowEmptyDatas],
  components: {
    department: () => import('@/components/department.vue'),
    logo: () => import('../components/logo.vue'),
    PageTitle: () => import('../components/page-title.vue'),
    YwProgress: () => import('@/components/yw-progress.vue'),
    page2_table: () => import('@/views/page2-table.vue'),
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
      leftDatas: [],
      rightDatas: [],
      progressOption: {
        label: {
          //位置
          position: 'outer',//['outer','inner']
          //百分比
          percentage: {
            show: false
          },
        }
      },
    }
  },

  methods: {
    //计算数据
    getLeftRightDatas () {
      this.showEmptyDatas.content = '计算资源没有采集到！';
      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime
      };

      this.$axios.post('/v1/cmdb/index/allocate/resource', params).then((res) => {
        this.leftDatas = res.data.calculate.map((item, index) => {
          let percent = divisionNumber((item.undeploy || 0) * 100, item.amount, 2);
          return {
            amount: item.amount,
            apply: item.apply,
            deviceType: item.deviceType,
            moduleType: item.moduleType,
            recycle: item.recycle,
            undeploy: item.undeploy,
            unit: item.unit,
            percent: percent,
            useAllocation: item.useAllocation || 0
          }
        });
        this.rightDatas = res.data.store.map((item, index) => {
          return {
            deviceType: item.deviceType,
            amount: fixedNumber(item.amount, 2),
            unit: item.unit,
            moduleType: item.moduleType,
            apply: fixedNumber(item.apply, 2),
            recycle: fixedNumber(item.recycle, 2),
            useAllocation: fixedNumber(item.useAllocation, 2),
            undeploy: fixedNumber(item.undeploy, 2),
          };
        });
        if (this.leftDatas && this.leftDatas.length > 0) {
          this.showEmptyDatas.show = false
        } else {
          this.showEmptyDatas.show = true
        }
      }).catch((error) => {
        this.showEmptyDatas.show = true
      });
    },
  },
  mounted () {
    this.getLeftRightDatas();
  }
}
</script>

<style lang="scss" scoped>
.left {
  background: rgba(24, 19, 109, 0.95);
  .chart-wrap {
    display: flex;
    justify-content: space-between;
    flex-flow: nowrap;
    padding: 20px 30px 0 30px;
    .chart-item {
      position: relative;
      height: 346px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      &:before {
        content: "";
        position: absolute;
        top: -4px;
        left: -4px;
        display: inline-block;
        width: 15px;
        height: 15px;
        background: url(../assets/img/arrow-up.png) no-repeat;
      }
      &:after {
        content: "";
        position: absolute;
        bottom: -4px;
        right: -4px;
        display: inline-block;
        width: 15px;
        height: 15px;
        background: url(../assets/img/arrow-down.png) no-repeat;
      }
      .gaugle-num {
        font-size: 20px;
        color: #f04aa6;
        letter-spacing: 0;
        text-align: center;
        margin: 0 0 10px;
        padding-top: 40px;
        padding-right: 30px;
        padding-left: 30px;
      }
      .gaugle-name {
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0;
        text-align: center;
        margin-bottom: 10px;
      }
      .gaugle-use {
        font-size: 12px;
        color: #7a77ab;
        text-align: center;
      }
      .tip {
        font-size: 12px;
        color: #bbcee4;
        .tip-num {
          font-size: 16px;
          color: #bbcee4;
          display: inline-block;
          vertical-align: middle;
          margin-left: 5px;
        }
      }
      .split-tip {
        text-align: center;
        margin-top: 20px;
        .tip {
          display: inline-block;
          vertical-align: middle;
          &:after {
            content: "";
            display: inline-block;
            vertical-align: middle;
            width: 1px;
            height: 13px;
            margin: 0 20px;
            background: rgba(255, 255, 255, 0.5);
          }
          &:last-child {
            &:after {
              display: none;
            }
          }
        }
      }
      .footer-tip {
        position: absolute;
        bottom: 10px;
        width: 100%;
        text-align: center;
      }
      .gaugle-wrap {
        width: 175px;
        height: 134px;
        margin: auto;
        background: url(../assets/img/img_wuliji.png) no-repeat;
        background-size: contain;
      }
      &:nth-of-type(2) {
        .gaugle-wrap {
          background: url(../assets/img/img_xuniji.png) no-repeat;
          background-size: contain;
        }
      }
    }
  }
  .empty-wrap {
    text-align: center;
  }
  .table-wrap {
    padding: 20px 30px;
  }
  .title {
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0;
    padding: 20px;
  }
}
.right {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-content: space-between;
  .right-item {
    position: relative;
    width: 48.5%;
    height: 31%;
    background: #2d72fd;
    .title {
      font-size: 14px;
      color: #ffffff;
      padding: 20px 0 0 20px;
    }
    .content {
      position: absolute;
      width: 100%;
      top: 50%;
      margin-top: -50px;
      .num {
        font-size: 18px;
        color: #ffffff;
        text-align: center;
        margin-bottom: 5px;
      }
      .cell {
        font-size: 14px;
        color: #ffffff;
        text-align: center;
        margin-bottom: 20px;
      }
      .total {
        font-size: 14px;
        color: #ffffff;
        text-align: center;
      }
    }
    .footer-tip {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
      border-top: 1px dashed #7da7fe;
      .footer-item {
        display: inline-block;
        width: 49%;
        padding: 10px 0;
        text-align: center;
        font-size: 12px;
        color: #8bb2ff;
        .num {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
