
<template>
    <div style="width:100%;height:100%">
        <!-- 标题 -->
        <section class="title-link-wrap clearfix">
            <YwTitleTab @changeTitle="changeTitle"
                        :tabActive="activeFilterTitle"
                        :tabDatas="filterTitle"></YwTitleTab>
            <el-select class="yw-select-blue fr"
                       style="width:110px"
                       popper-class="yw-select-blue-options"
                       v-model="activeFilter"
                       @change="changeSelect"
                       placeholder="请选择">
                <el-option v-for="item in filter"
                           :key="item.code"
                           :label="item.name"
                           :value="item.code">
                </el-option>
            </el-select>
        </section>
        <!-- 标题 -->

        <!-- 圆环图 -->
        <section class="chart-wrap ">
            <div v-if="!showEmptyDatas.show"
                 class="static-chart">
                <div v-for="(item,index) in pieDatas"
                     class="chart-item"
                     style="width:49%;"
                     :key="index">
                    <div class="img-wrap">
                        <p class="num text-ellipse"
                           :title="item.num">{{item.num}}</p>
                        <p class="name text-ellipse"
                           :title="item.name">{{item.name}}</p>
                    </div>
                </div>
            </div>
            <YwChartEmpty v-else
                          :showEmptyDatas="showEmptyDatas"></YwChartEmpty>
        </section>
        <!-- 圆环图 -->

        <!-- 进度条 -->
        <section class="process-wrap">
            <YwProgressMuti :progressDatas="progressDatas"
                            style="width:49%"
                            v-for="(progressDatas,index) in progressList"
                            :key="index"></YwProgressMuti>
        </section>
        <!-- 进度条 -->

        <!-- 表格 -->
        <section class="table-wrap"
                 style="width:100%;">
            <div class="table-inner">
                <div class="chart-title clearfix">
                    <span>{{titleDatas.name}}</span>
                    <el-radio-group v-model="activeFilterTable"
                                    @change="changeTable"
                                    class="yw-radio-button fr">
                        <el-radio-button :label="item.label"
                                         v-for="(item,index) in filterTable"
                                         :key="index">{{item.name}}</el-radio-button>
                    </el-radio-group>
                </div>
                <div class="table-box">
                    <YwTable :tableTitles="tableTitles"
                             v-if="resetComponent"
                             :option="{'selfClass':'no-border no-padding'}"
                             @sortTable="sortTable"
                             :tableDatas="tableDatas"></YwTable>
                </div>

            </div>
        </section>
        <!-- 表格 -->
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import ChartOption from '@/utils/chartOption.js'
    import DrawChart from '@/utils/drawCharts.js'
    import updateComponent from '@/utils/updateComponent.js'
    import { fixedNumber, divisionNumber } from '@/utils/filter.js'

    export default {
        mixins: [DrawChart, updateComponent],
        props: ['moduleData'],
        components: {
            YwTitleTab: () => import('@/components/yw-title-tab.vue'),
            YwProgressMuti: () => import('@/components/yw-progress-muti.vue'),
            YwTable: () => import('@/components/yw-table.vue'),
            YwChartEmpty: () => import('@/components/yw-chart-empty.vue'),
        },
        computed: {
            ...mapState({
                department1: state => state.user.department1,
                department2: state => state.user.department2,
                monthlyTime: state => state.user.monthlyTime,
            }),
        },
        data() {
            return {
                //标题filter
                filterTitle: [{ name: '计算资源', label: '计算资源' }],
                activeFilterTitle: '计算资源',
                //下拉框filter
                filter: [],
                activeFilter: '',
                activeFilterObj: {},
                //表格filter
                filterTable: [{ name: '内部租户', label: '内部租户' }, { name: '外部租户', label: '外部租户' }],
                activeFilterTable: '内部租户',
                titleDatas: {
                    name: '租户计算资源排行'
                },
                pieDatas: [
                    {
                        name: '已分配(台)',
                        num: 0
                    },
                    {
                        name: '已使用(台)',
                        num: 0
                    }
                ],
                progressList: [[{ name: '内部租户已分配', num: 0, cell: '', percent: 50 }, { name: '外部租户已分配', num: 0, cell: '', percent: 50 }],
                [{ name: '内部租户已使用', num: 0, cell: '', percent: 50 }, { name: '外部租户已使用', num: 0, cell: '', percent: 50 }]],
                tableTitles: [],
                tableDatas: [],
                cell: '台',//单位
                //空数据
                showEmptyDatas: { show: false, content: '数据正在生成中，可参考上月数据' },

            }
        },

        methods: {
            //表格排序
            sortTable(datas) {
                this.tableDatas = datas;
            },
            //获得圆环数据
            getPieDatas() {
                let params = {
                    monthlyTime: this.monthlyTime,
                    moduleType: this.moduleData.type,
                    deviceType: this.activeFilter,
                    excludeDep: this.$route.query.excludeDep
                };
                this.$axios.post('/v1/cmdb/index/overview/hasAndUse/devt', params).then((res) => {
                    this.showEmptyDatas.show = false;
                    if (!res.data.flag) {
                        this.showEmptyDatas.show = true;
                        this.showEmptyDatas.content = res.data.errorMsg;
                        return false;
                    }
                    this.pieDatas[0].num = res.data.data.total && res.data.data.total.hasAlt;
                    this.progressList[0][0].num = res.data.data.inside && res.data.data.inside.hasAlt;
                    this.progressList[0][1].num = res.data.data.outside && res.data.data.outside.hasAlt;
                    this.progressList[0][0].percent = divisionNumber(this.progressList[0][0].num * 100, this.pieDatas[0].num, 0) || 50;
                    this.progressList[0][1].percent = 100 - this.progressList[0][0].percent;
                    this.progressList[0][0].cell = this.cell;
                    this.progressList[0][1].cell = this.cell;

                    this.pieDatas[1].num = res.data.data.total && res.data.data.total.useAlt;
                    this.progressList[1][0].num = res.data.data.inside && res.data.data.inside.useAlt;
                    this.progressList[1][1].num = res.data.data.outside && res.data.data.outside.useAlt;
                    this.progressList[1][0].percent = divisionNumber(this.progressList[1][0].num * 100, this.pieDatas[1].num, 0) || 50;
                    this.progressList[1][1].percent = 100 - this.progressList[1][0].percent;
                    this.progressList[1][0].cell = this.cell;
                    this.progressList[1][1].cell = this.cell;

                });
            },
            //获得表格数据
            getTableDatas() {
                //更新表格
                this.updateComponent();
                this.tableTitles = [
                    { name: 'department', title: `${this.activeFilterTable}名称 `, style: {} },
                    { name: 'hasAlt', title: `${this.activeFilterObj.name}已分配(${this.cell})`, style: { sortable: true, align: 'right', width: 200, 'text-link': true } },
                    { name: 'useAlt', title: `${this.activeFilterObj.name}已使用(${this.cell})`, style: { sortable: true, align: 'right', width: 200, 'text-link': true } },
                ];

                let params = {
                    monthlyTime: this.monthlyTime,
                    deviceType: this.activeFilter,
                    depType: this.activeFilterTable,
                    moduleType: this.moduleData.type,
                    excludeDep: this.$route.query.excludeDep
                };

                this.$axios.post('/v1/cmdb/index/overview/hasAndUse/devtAndDept', params).then((res) => {
                    if (!res.data.flag) {
                        this.tableDatas = [];
                        return false;
                    }
                    this.tableDatas = res.data.data;
                });
            },
            //获得filter下拉框数据
            getFilterDatas() {

                let params = {
                    moduleType: this.moduleData.type,
                };

                return this.$axios.get('/v1/cmdb/index/overview/list/dept', { params: params }).then((res) => {
                    if (!res.data.flag) {
                        return false;
                    }

                    this.filter = res.data.data;
                    this.activeFilter = this.filter[0].code;
                    this.activeFilterObj = this.filter[0]
                    return this.filter;
                });
            },
            //获得数据
            getDatas() {
                this.getPieDatas();
                this.getTableDatas();
            },
            changeTable(val) {
                this.getTableDatas();
            },
            changeSelect(val) {
                this.filter.some((item) => {
                    if (item.code === val) {
                        this.activeFilterObj = item
                        return true
                    }
                })
                this.getDatas();
            },
            changeTitle(val) {
                this.activeFilterTitle = val;
            },
            //初始化
            async init() {
                if (this.moduleData.type === '计算资源') {
                    this.cell = '台'
                    this.titleDatas.name = '租户计算资源排行';
                    this.pieDatas[0].name = '已分配(台)';
                    this.pieDatas[1].name = '已使用(台)';
                } else {
                    this.cell = 'T'
                    this.titleDatas.name = '租户存储资源排行';
                    this.pieDatas[0].name = '已分配(T)';
                    this.pieDatas[1].name = '已使用(T)';
                }
                this.filterTitle[0].name = this.moduleData.type
                this.filterTitle[0].label = this.moduleData.type
                this.activeFilterTitle = this.filterTitle[0].label

                await this.getFilterDatas();
                this.getDatas();
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style lang="scss" scoped>
    .yw-select-blue {
        margin-right: 20px;
    }
    .process-wrap {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        padding: 0 20px;
        margin: 20px 0 20px 0;
    }
    .chart-wrap {
        height: 191px;
        .static-chart {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            .img-wrap {
                position: relative;
                width: 213px;
                height: 191px;
                margin: auto;
                background: url(../../assets/img/img_circle_01.png) no-repeat;
                background-size: contain;
                text-align: center;
                .name {
                    padding-top: 50px;
                    font-size: 14px;
                }
                .num {
                    padding: 100px 50px 0 50px;
                    font-size: 18px;
                }
            }
        }
    }
    .table-wrap {
        height: calc(100% - 400px);
        padding: 0 20px;
    }
</style>
