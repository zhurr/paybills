<template>
  <!-- 表格 -->
  <div class="yw-fix-table"
       :class="{active:option && option['active']}"
       style="height:100%">
    <el-table :data="tableDatas"
              class="yw-el-table yw-fix-header"
              :class="{enClick:option && option['enClick']}"
              :highlight-current-row="option && option['highlight-current-row']"
              @row-click="clickTableRow"
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
                  style="height: calc(100% - 40px)">
      <el-table :data="tableDatas"
                :show-header="false"
                class="yw-el-table yw-fix-body"
                :class="{enClick:option && option['enClick']}"
                :highlight-current-row="option && option['highlight-current-row']"
                @row-click="clickTableRow"
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
                  :class="{'text-link':item.style && item.style['text-link']}"
                  :title="scope.row[item.name]">{{ scope.row[item.name] }}</span>
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
</template>
<script>
export default {
  //表头、内容、表格配置
  props: ['tableTitles', 'tableDatas', 'option'],
  data () {
    return {

    }
  },
  methods: {
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
      let list = [];
      list = this.tableDatas.sort(this.compare(column.prop, column.order));
      this.$emit('sortTable', list);
    },
    //行点击事件
    clickTableRow (row, column, event) {
      this.$emit('clickTableRow', row, column, event);
    }
    // compare (property) {
    //   return function (a, b) {
    //     return a[property] - b[property]
    //   }
    // },
    // sortUp (index) {
    //   let property = this.option.sort[index];
    //   this.tableDatas.sort(this.compare(property));
    // },
    // sortDown (index) {

    // }
  },
  mounted () {

  }

}
</script>
<style lang="scss" scoped>
</style>
