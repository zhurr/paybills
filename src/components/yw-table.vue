<template>
    <!-- 表格(常用) -->
    <div class="yw-fix-table"
         ref="fixTable"
         :class="option && option.selfClass">
        <vue-scroll style="width:100%;height:100%;"
                    :ops="opsX">
            <!-- 表头 -->
            <el-table :data="[]"
                      class="yw-el-table yw-fix-header"
                      :class="{ enClick: option && option['enClick'] }"
                      :show-header="(option && option.selfClass && option.selfClass.indexOf('no-header')>-1) ? false : true"
                      :highlight-current-row="option && option['highlight-current-row']"
                      :default-sort="(option && option.sort && option.sort.default) ? option.sort.default : {prop: '', order: ''}"
                      @row-click="clickTableRow"
                      @sort-change="sortTable">
                <el-table-column label=""
                                 v-if="!(option  && option.selfClass && option.selfClass.indexOf('multi-table') > -1)"
                                 width="30"> </el-table-column>
                <el-table-column :prop="item.name"
                                 v-for="(item,index) in tableTitles"
                                 :label="item.title"
                                 :key="index"
                                 :sortable="item.style.sortable ? item.style.sortable : false"
                                 :width="item.style.width ? item.style.width : 'auto'"
                                 :align="item.style.align ? item.style.align : 'left'">
                    <el-table-column :prop="item2.name"
                                     v-for="(item2,index2) in item.children"
                                     :label="item2.title"
                                     :key="index2"
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
                        <span class="">
                            <el-popover placement="bottom"
                                        style="display:block"
                                        :disabled="!scope.row[item.name + 'Tooltip']"
                                        trigger="hover"
                                        popper-class="yw-popover-blue">
                                <div v-html="scope.row[item.name + 'Tooltip']"></div>
                                <span slot="reference"
                                      class="text-ellipse"
                                      v-html="item.style.isHtml ? scope.row[item.name + 'Html']: scope.row[item.name]"
                                      :class="{ 'text-link': item.style && item.style['text-link'] }"
                                      :title="item.style.isHtml ? '' : scope.row[item.name]">
                                </span>
                            </el-popover>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label=""
                                 v-if="!(option  && option.selfClass && option.selfClass.indexOf('multi-table') > -1)"
                                 width="50"> </el-table-column>
            </el-table>
            <!-- 表头 -->

            <!-- 表内容 -->
            <vue-scroll :style="{height: tableContentHeight}"
                        :ops="opsY">
                <el-table :data="tableDatas"
                          :show-header="false"
                          class="yw-el-table yw-fix-body"
                          :class="{ enClick: option && option['enClick'] }"
                          :highlight-current-row="option && option['highlight-current-row']"
                          @row-click="clickTableRow">
                    <el-table-column label=""
                                     v-if="!(option  && option.selfClass && option.selfClass.indexOf('multi-table') > -1)"
                                     width="30"> </el-table-column>
                    <el-table-column :prop="item.name"
                                     v-for="(item,index) in tableTitles"
                                     :label="item.title"
                                     :key="index"
                                     :sortable="item.style.sortable ? item.style.sortable : false"
                                     :width="item.style.width ? item.style.width : 'auto'"
                                     :align="item.style.align ? item.style.align : 'left'">
                        <el-table-column :prop="item2.name"
                                         v-for="(item2,index2) in item.children"
                                         :label="item2.title"
                                         :key="index2"
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
                            <span class="">
                                <el-popover placement="bottom"
                                            style="display:block"
                                            :disabled="!scope.row[item.name + 'Tooltip']"
                                            trigger="hover"
                                            popper-class="yw-popover-blue">
                                    <div v-html="scope.row[item.name + 'Tooltip']"></div>
                                    <span slot="reference"
                                          class="text-ellipse"
                                          v-html="item.style.isHtml ? scope.row[item.name + 'Html']: scope.row[item.name]"
                                          :class="{ 'text-link': item.style && item.style['text-link'] }"
                                          :title="item.style.isHtml ? '' : scope.row[item.name]">
                                    </span>
                                </el-popover>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label=""
                                     v-if="!(option  && option.selfClass && option.selfClass.indexOf('multi-table') > -1)"
                                     width="50"> </el-table-column>
                </el-table>
            </vue-scroll>
            <!-- 表内容 -->
            <!-- 空处理 -->
            <div class="empty-wrap one-img"
                 v-if="tableDatas && tableDatas.length > 0 && tableDatas.length < 2"
                 title="到底了">
            </div>
            <div class="empty-wrap"
                 v-else-if="!tableDatas || tableDatas.length < 1"
                 title="空空如也">
            </div>

            <div class="empty-wrap only-img"
                 v-else-if="option && option.selfClass && option.selfClass.indexOf('empty-more')>-1 && tableDatas && tableDatas.length > 1 && tableDatas.length < 11"
                 title="暂无更多数据">
                <p class="empty-text">暂无更多数据</p>
            </div>
            <!-- 空处理 -->
        </vue-scroll>
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
                //横向滚动条
                opsX: {
                    scrollPanel: {
                        scrollingY: false
                    }
                },
                //垂直滚动条
                opsY: {
                    scrollPanel: {
                        scrollingX: false,
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
            this.tableHeight = this.$refs.fixTable.offsetHeight
            if (this.option && this.option.selfClass && this.option.selfClass.indexOf('multi-table') > -1) {
                //多级表结构
                this.tableContentHeight = this.tableHeight - 60 * 2 + 'px'
            } else if (this.option && this.option.selfClass && this.option.selfClass.indexOf('title-line-2') > -1) {
                //表头占据2行
                this.tableContentHeight = this.tableHeight - 80 + 'px'

            } else {
                this.tableContentHeight = this.tableHeight - 60 + 'px'
                // this.tableContentHeight = this.tableHeight
            }

        },
    }
</script>
<style lang="scss" scoped></style>
