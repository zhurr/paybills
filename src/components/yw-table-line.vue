<template>
    <!-- 表格(线型)[用到的页面:资源池表格] -->
    <div class="yw-table-line"
         ref="fixTable"
         :class="option && option.selfClass">
        <!-- 表头 -->

        <!-- 表头 -->

        <!-- 表内容 -->
        <vue-scroll style="height:100%;"
                    :ops="ops2">
            <el-table :data="tableDatas"
                      :show-header="false"
                      class="yw-el-table yw-fix-body"
                      :class="{ enClick: option && option['enClick'] }"
                      :highlight-current-row="option && option['highlight-current-row']"
                      @row-click="clickTableRow">
                <el-table-column :prop="item.name"
                                 v-for="item in tableTitles"
                                 :label="item.title"
                                 :key="item.name"
                                 :sortable="item.style.sortable ? item.style.sortable : false"
                                 :width="item.style.width ? item.style.width : 'auto'"
                                 :align="item.style.align ? item.style.align : 'left'">
                    <el-table-column :prop="item2.name"
                                     v-for="(item2) in item.children"
                                     :label="item2.title"
                                     :key="item2.name"
                                     :sortable="item2.style.sortable ? item2.style.sortable : false"
                                     :width="item2.style.width ? item2.style.width : 'auto'"
                                     :align="item2.style.align ? item2.style.align : 'left'">
                        <template slot-scope="scope">
                            <span class="text-ellipse"
                                  v-html="item.style.isHtml ? scope.row[item.name + 'Html']: scope.row[item.name][item2.name]"
                                  :class="{ 'text-link': item.style && item.style['text-link'] }"
                                  :title="item.style.isHtml ? '' : scope.row[item.name][item2.name]">
                            </span>
                        </template>
                    </el-table-column>
                    <template slot-scope="scope">
                        <span class="text-ellipse"
                              v-html="item.style.isHtml ? scope.row[item.name + 'Html']: scope.row[item.name]"
                              :class="{ 'text-link': item.style && item.style['text-link'] }"
                              :title="item.style.isHtml ? '' : scope.row[item.name]">
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label=""
                                 v-if="!(option  && option.selfClass && option.selfClass.indexOf('multi-table') > -1)"
                                 width="10"> </el-table-column>
            </el-table>
        </vue-scroll>
        <!-- 表内容 -->
    </div>

</template>
<script>
    export default {
        //表头、内容、表格配置
        props: ['tableTitles', 'tableDatas', 'option'],
        components: {
        },
        data() {
            return {
                //表格配置
                // option: {
                //     'selfClass': '',//样式类
                //     'highlight-current-row': true,//高亮
                //     'enClick': true,//行可点击
                //     //排序类
                //     'sort': {
                //         type: 'dynamic', //动态排序（时时走接口,否则当前数据静态排序）
                //         order: 'descending' //只显示降序(否则升序和降序)
                //     },
                // },
                tableHeight: '',
                tableContentHeight: '',
                ops1: {
                    scrollPanel: {
                        scrollingY: false
                    }
                },
                ops2: {
                    scrollPanel: {
                        scrollingX: false
                    }
                }
            }
        },
        methods: {
            compare(property, type = 'ascending') {
                return (a, b) => {
                    let value1 = a[property]
                    let value2 = b[property]
                    let sort = 0
                    if (type === 'ascending') {
                        //升序
                        sort = value1 - value2
                    } else {
                        //降序等
                        sort = value2 - value1
                    }
                    return sort
                }
            },
            //自定义排序
            sortTable(column) {
                if (this.option && this.option.sort && this.option.sort.type === 'dynamic') {
                    //动态数据排序(时时走接口,例如top5类的数据)
                    this.$emit('sortTable', column)
                } else {
                    let list = []
                    list = this.tableDatas.sort(this.compare(column.prop, column.order))
                    this.$emit('sortTable', list)
                }

            },
            //行点击事件
            clickTableRow(row, column, event) {
                this.$emit('clickTableRow', row, column, event)
            },
        },
        created() {

        },
        mounted() {
            // this.tableHeight = this.$refs.fixTable.offsetHeight
            // if (this.option && this.option.selfClass && this.option.selfClass.indexOf('multi-table') > -1) {
            //     this.tableContentHeight = this.tableHeight - 60 * 2 + 'px'
            // } else {
            //     this.tableContentHeight = this.tableHeight - 60 + 'px'
            // }

        },
    }
</script>
<style lang="scss" scoped>
    .yw-table-line {
        height: 100%;
    }
</style>
