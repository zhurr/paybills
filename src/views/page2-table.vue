<template>
  <!-- 表格 -->
  <div class="page2-table">
    <div class="clearfix">
      <el-radio-group v-model="activeFilter"
                      @change="changeTab"
                      class="yw-radio-button fr"
                      style="margin:0 0 10px 0;">
        <el-radio-button :label="item.label"
                         v-for="(item,index) in filter"
                         :key="index">{{item.name}}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="yw-fix-table no-border no-padding"
         :class="{active:option && option['active']}"
         style="height:100%">
      <el-table :data="tableDatas"
                class="yw-el-table yw-fix-header"
                :class="{enClick:option && option['enClick']}"
                :highlight-current-row="option && option['highlight-current-row']"
                @sort-change="sortTable"
                style="width: 100%">
        <el-table-column label=""
                         width="30">
        </el-table-column>

        <el-table-column :prop="item.name"
                         v-for="item in tableTitles"
                         :key="item.name"
                         :label="item.title"
                         :sortable="item.style.sortable ? item.style.sortable : false"
                         :width="item.style.width ? item.style.width : 'auto'"
                         :align="item.style.align ? item.style.align : 'left'">
          <template slot-scope="scope">
            <span class="text-ellipse"
                  :title="scope.row[item.name]">{{ scope.row[item.name] }}</span>
          </template>
        </el-table-column>
        <el-table-column label=""
                         width="50">
        </el-table-column>
      </el-table>
      <el-scrollbar class="yw-scrollbar"
                    style="height: calc(100% - 60px)">
        <el-table :data="tableDatas"
                  :show-header="false"
                  class="yw-el-table yw-fix-body"
                  :class="{enClick:option && option['enClick']}"
                  :highlight-current-row="option && option['highlight-current-row']"
                  style="width: 100%">
          <el-table-column label=""
                           width="30">
          </el-table-column>
          <el-table-column :prop="item.name"
                           v-for="item in tableTitles"
                           :key="item.name"
                           :label="item.title"
                           :sortable="item.style && item.style.sortable ? item.style.sortable : false"
                           :width="item.style && item.style.width ? item.style.width : 'auto'"
                           :align="item.style && item.style.align ? item.style.align : 'left'">
            <template slot-scope="scope">
              <span class="text-ellipse"
                    v-if="item.name!=='notInspectAllocation'"
                    :class="{'text-link':item.style && item.style['text-link']}"
                    :title="scope.row[item.name]">{{ scope.row[item.name] }}</span>

              <div class="text-wrap"
                   v-if="item.name ==='notInspectAllocation'">
                <span class="text text-ellipse"
                      :class="{'text-link':item.style && item.style['text-link']}"
                      :title="scope.row[item.name]">{{ scope.row[item.name] }}</span>
                <el-popover placement="right"
                            v-if="scope.row[item.name]>0"
                            popper-class="yw-popover-dark"
                            @show="getRowDetails(scope.row)"
                            trigger="hover">
                  <div class="tootip-flag">
                    <section v-for="(item,detailIndex) in tableDetails[scope.row.bizSystem]"
                             class="flag-item"
                             :key="detailIndex">
                      <span class="flag-num">{{item.num}}台：</span>
                      <div class="flag-date">
                        <p class="flag-date-item">资源开通日期：{{item.resourceOpenDate}}；</p>
                        <p class="flag-date-item">开始考核日期：{{item.startAssessDate}}；</p>
                      </div>
                    </section>
                  </div>

                  <i class="icon-flag"
                     slot="reference"
                     style="width:12px;height:12px;"></i>
                </el-popover>
                <span v-else
                      style="display:inline-block;width:15px"></span>

              </div>
            </template>
          </el-table-column>

          <el-table-column label=""
                           width="50">
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <div class="empty-wrap"
           v-if="tableDatas && tableDatas.length>0 && tableDatas.length < 2">
        <img src="../assets/img/img_toBottom.png"
             style="height:100%;width:auto;"
             alt="">
      </div>
      <div class="empty-wrap"
           v-else-if="!tableDatas || tableDatas.length < 1">
        <img src="../assets/img/img_empty.png"
             style="height:100%;width:auto;"
             alt="">
      </div>
    </div>
  </div>

</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({
      department1: state => state.user.department1,
      department2: state => state.user.department2,
      monthlyTime: state => state.user.monthlyTime,
    }),
  },
  data () {
    return {
      filter: [{ name: '物理机', label: '物理机' }, { name: '虚拟机', label: '虚拟机' }],
      activeFilter: '物理机',
      tableTitles: [],
      tableDatas: [],
      tableDetails: {},
      rowDetails: [],
      option: {
        style: {
          height: '42%'
        },
        sort: [{
          column: 'wuliji',
          show: true
        }]
      },
    }
  },
  methods: {
    //排序比较
    compare (property, type = "ascending") {
      return (a, b) => {
        let value1 = a[property];
        let value2 = b[property];
        let sort = 0;
        if (type === "ascending") {//升序
          sort = value1 - value2;
        } else { //降序等
          sort = value2 - value1;
        }
        return sort;
      }

    },
    //自定义排序
    sortTable (column) {
      this.tableDatas = this.tableDatas.sort(this.compare(column.prop, column.order));
    },
    //行点击事件
    clickTableRow (row, column, event) {

    },
    //表格数据
    getTableDatas () {
      this.tableTitles = [
        { name: 'bizSystem', title: '租户应用系统名称', style: {} },
        { name: 'hasAllocation', title: `已分配数量(台)`, style: { sortable: true, align: 'right', width: 150, 'text-link': true } },
        { name: 'useAllocation', title: `使用量(台)`, style: { sortable: true, align: 'right', width: 150, 'text-link': true } },
        { name: 'notInspectAllocation', title: `免考核资源量(台)`, style: { sortable: true, align: 'right', width: 200, 'text-link': true } },
      ];

      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
        "deviceType": this.activeFilter
      };

      this.$axios.post('/v1/cmdb/index/allocate/bizSystem', params).then((res) => {
        this.tableDatas = res.data;
        this.getDetails();
      });
    },

    //详细列表
    getRowDetails (row) {
      return false;
      this.rowDetails = [];
      let params = {
        "department1": this.department1,
        "department2": this.department2,
        "monthlyTime": this.monthlyTime,
        "bizSystem": row.bizSystem,
        "deviceType": this.activeFilter
      };

      this.$axios.post('/v1/cmdb/index/bizSystem/notInspect', params).then((res) => {
        this.rowDetails = res.data;
      });

    },

    //详细列表
    getDetails () {
      this.tableDatas.forEach((item) => {
        let params = {
          "department1": this.department1,
          "department2": this.department2,
          "monthlyTime": this.monthlyTime,
          "bizSystem": item.bizSystem,
          "deviceType": this.activeFilter
        };

        this.$axios.post('/v1/cmdb/index/bizSystem/notInspect', params).then((res) => {
          this.$set(this.tableDetails, item.bizSystem, res.data);
        });

      });

    },
    changeTab (val) {
      this.getTableDatas();
    },

  },
  mounted () {
    this.getTableDatas();
  }

}
</script>
<style lang="scss" scoped>
.page2-table {
  width: 100%;
  height: 100%;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  .empty-wrap {
    height: calc(100% - 140px);
  }
  .text-wrap {
    .text {
      width: calc(100% - 25px);
    }
    .icon-flag {
      display: inline-block;
      vertical-align: middle;
      background: url(../assets/img/ico_01.png) no-repeat;
      margin-left: 5px;
      cursor: pointer;
    }
  }
}
.tootip-flag {
  font-size: 12px;
  color: #01e5ff;
  padding: 10px;
  .flag-item {
    padding: 10px 0;
    border-bottom: 1px dashed #01e5ff;
    &:last-of-type {
      border-bottom: none;
    }
  }
  .flag-num {
    display: inline-block;
    vertical-align: top;
  }
  .flag-date {
    display: inline-block;
    min-width: 165px;
    .flag-date-item {
      margin-bottom: 5px;
    }
  }
}
</style>
