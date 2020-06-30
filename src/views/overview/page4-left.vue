
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
        <div class="chart-wrap">
            <div class="static-chart"
                 v-if="!showEmptyDatas.show">
                <section class="chart-item"
                         v-for="(item,index) in gaugeDatas"
                         :key="index">
                    <div class="content">
                        <p class="chart-percent">{{item.chartDatas.rate}}<span class="chart-percent-cell">%</span></p>
                        <p class="chart-change-wrap">
                            同比上月份<span class="chart-change-percent">
                                <span class="down"
                                      v-if="item.chartDatas.change<0"><i class="arrow">↓</i>{{-item.chartDatas.change}}%</span>
                                <span class="up"
                                      v-else><i class="arrow">↑</i>{{item.chartDatas.change}}%</span>
                            </span>
                        </p>
                        <p class="chart-name">{{item.chartDatas.name}}</p>
                    </div>
                    <!-- 图表 -->
                    <YwChartGauge :gaugeDatas="item"
                                  class="chart-box"
                                  v-if="item.show"></YwChartGauge>
                    <!-- 图表 -->

                    <div class="chart-detail">
                        <p class="detail-item">
                            <YwTenant :tenantDatas='{name:"内部租户",num:item.chartDatas.tenantDatas.userInner,change:item.chartDatas.tenantDatas.userInnerChange}'
                                      :options="{type:'border'}"></YwTenant>
                        </p>
                        <p class="detail-item">
                            <YwTenant :tenantDatas='{name:"外部租户",num:item.chartDatas.tenantDatas.userOuter,change:item.chartDatas.tenantDatas.userOuterChange}'
                                      :options="{type:'border'}"></YwTenant>
                        </p>
                    </div>
                </section>
            </div>

            <YwChartEmpty v-else
                          :showEmptyDatas="showEmptyDatas"></YwChartEmpty>
        </div>
        <!-- 圆环图 -->

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
    import updateComponent from '@/utils/updateComponent.js'
    import { fixedNumber, divisionNumber, subNumber } from '@/utils/filter.js'

    export default {
        mixins: [updateComponent],
        props: ['moduleData'],
        components: {
            YwTable: () => import('@/components/yw-table.vue'),
            YwTitleTab: () => import('@/components/yw-title-tab.vue'),
            YwTenant: () => import('@/components/yw-tenant.vue'),
            YwChartEmpty: () => import('@/components/yw-chart-empty.vue'),
            YwChartGauge: () => import('@/components/yw-chart-gauge.vue'),
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
                filterTitle: [{ name: '计算资源均峰值利用率', label: 'MAX' }, { name: '计算资源均值利用率', label: 'AVG' }],
                activeFilterTitle: 'MAX',
                //下拉框filter
                filter: [],
                activeFilter: '',
                activeFilterObj: {},
                //表格filter
                filterTable: [{ name: '', label: '' }],
                activeFilterTable: '',
                titleDatas: {
                    name: '租户计算资源均峰值利用率排行'
                },
                gaugeDatas: [{ show: false, id: 'gauge-1', chartOption: 'gauge-option', chartDatas: { name: 'CPU均峰值利用率', rate: 0, change: 0, tenantDatas: { userInner: 0, userInnerChange: 0, userOuter: 0, userOuterChange: 0 } } },
                { show: false, id: 'gauge-2', chartOption: 'gauge-option', chartDatas: { name: '内存均峰值利用率', rate: 0, change: 0, tenantDatas: { userInner: 0, userInnerChange: 0, userOuter: 0, userOuterChange: 0 } } },
                ],
                tableTitles: [],
                tableDatas: [],
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
            getGaugeDatas() {
                this.gaugeDatas[0].chartDatas.name = 'CPU均峰值利用率';
                this.gaugeDatas[1].chartDatas.name = '内存均峰值利用率';
                if (this.activeFilterTitle === 'AVG') {
                    this.gaugeDatas[0].chartDatas.name = 'CPU均值利用率';
                    this.gaugeDatas[1].chartDatas.name = '内存均值利用率';
                }

                let params = {
                    "monthlyTime": this.monthlyTime,
                    "deviceType": this.activeFilter,
                    calculateType: this.activeFilterTitle,
                    excludeDep: this.$route.query.excludeDep
                };

                this.$axios.post('/v1/cmdb/index/overview/cpuAndStore', params).then((res) => {
                    this.showEmptyDatas.show = false;
                    if (!res.data.flag) {
                        this.showEmptyDatas.show = true;
                        this.showEmptyDatas.content = res.data.errorMsg;
                        return false;
                    }

                    this.gaugeDatas[0].chartDatas.rate = fixedNumber(res.data.data.total.cpu, 2);
                    this.gaugeDatas[0].chartDatas.change = subNumber(res.data.data.total.cpu, res.data.data.total.preCpu, 2);
                    this.gaugeDatas[1].chartDatas.rate = fixedNumber(res.data.data.total.store, 2);
                    this.gaugeDatas[1].chartDatas.change = subNumber(res.data.data.total.store, res.data.data.total.preStore, 2);

                    this.gaugeDatas[0].chartDatas.tenantDatas.userInner = fixedNumber(res.data.data.inside.cpu, 2);
                    this.gaugeDatas[0].chartDatas.tenantDatas.userInnerChange = subNumber(res.data.data.inside.cpu, res.data.data.inside.preCpu, 2);
                    this.gaugeDatas[0].chartDatas.tenantDatas.userOuter = fixedNumber(res.data.data.outside.cpu, 2);
                    this.gaugeDatas[0].chartDatas.tenantDatas.userOuterChange = subNumber(res.data.data.outside.cpu, res.data.data.outside.preCpu, 2);

                    this.gaugeDatas[1].chartDatas.tenantDatas.userInner = fixedNumber(res.data.data.inside.store, 2);
                    this.gaugeDatas[1].chartDatas.tenantDatas.userInnerChange = subNumber(res.data.data.inside.store, res.data.data.inside.preStore, 2);
                    this.gaugeDatas[1].chartDatas.tenantDatas.userOuter = fixedNumber(res.data.data.outside.store, 2);
                    this.gaugeDatas[1].chartDatas.tenantDatas.userOuterChange = subNumber(res.data.data.outside.store, res.data.data.outside.preStore, 2);

                    this.gaugeDatas[0].show = true
                    this.gaugeDatas[1].show = true
                });
            },

            //获得表格数据
            getTableDatas() {
                //更新表格
                this.updateComponent();
                let type = '均峰值';
                if (this.activeFilterTitle === 'AVG') {
                    type = '均值';
                }
                this.titleDatas.name = `租户计算资源${type}利用率排行`;
                this.tableTitles = [
                    { name: 'department', title: `${this.activeFilterTable}名称`, style: {} },
                    { name: 'cpu', title: `${this.activeFilterObj.name}CPU${type}利用率`, style: { sortable: true, align: 'right', width: 200, isHtml: true } },
                    { name: 'store', title: `${this.activeFilterObj.name}内存${type}利用率`, style: { sortable: true, align: 'right', width: 200, isHtml: true } },
                ];

                let params = {
                    monthlyTime: this.monthlyTime,
                    deviceType: this.activeFilter,
                    depType: this.activeFilterTable,
                    calculateType: this.activeFilterTitle,
                    excludeDep: this.$route.query.excludeDep
                };

                this.$axios.post('/v1/cmdb/index/overview/cpuAndStore/list', params).then((res) => {
                    if (!res.data.flag) {
                        this.tableDatas = [];
                        return false;
                    }

                    this.tableDatas = res.data.data.map((item, index) => {

                        let cpuDuce = fixedNumber(item.cpu - item.preCpu, 2);
                        let storeDuce = fixedNumber(item.store - item.preStore, 2);
                        let cpuChange = eval(cpuDuce) < 0 ? `<sup class="change down"><i class="arrow">↓</i>${fixedNumber(-cpuDuce, 2)}%</sup>` : `<sup class="change"><i class="arrow">↑</i>${fixedNumber(cpuDuce, 2)}%</sup>`;
                        let storeChange = eval(storeDuce) < 0 ? `<sup class="change down"><i class="arrow">↓</i>${fixedNumber(-storeDuce, 2)}%</sup>` : `<sup class="change"><i class="arrow">↑</i>${fixedNumber(storeDuce, 2)}%</sup>`;

                        return {
                            department: item.department,
                            cpu: item.cpu,
                            cpuHtml: `${fixedNumber(item.cpu, 2)}%${cpuChange}`,
                            store: item.store,
                            storeHtml: `${fixedNumber(item.store, 2)}%${storeChange}`,
                        }
                    });
                });
            },
            //获得filter下拉框数据
            getFilterDatas() {
                let params = {
                    moduleType: this.moduleData.type,
                    exclude: 'GPU'
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
                this.getGaugeDatas();
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
                this.getDatas();
            },
            //初始化
            async init() {
                this.filterTable = [{ name: '内部租户', label: '内部租户' }, { name: '外部租户', label: '外部租户' }]
                this.activeFilterTable = this.filterTable[0].label
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

    .chart-wrap {
        width: 100%;
        height: 300px;
        .static-chart {
            display: flex;
            justify-content: space-between;
            flex-wrap: nowrap;
            width: 100%;
            height: 100%;
        }

        .chart-item {
            position: relative;
            display: inline-block;
            width: 50%;
            height: 100%;

            .chart-box {
                width: 100%;
                height: 220px;
                margin: 0 auto;
            }
            .chart-detail {
                display: flex;
                justify-content: center;
                &:after {
                    position: absolute;
                    bottom: 50px;
                    left: 100%;
                    content: "";
                    display: inline-block;
                    width: 0;
                    height: 70px;
                    border-left: 1px dashed rgba(255, 255, 255, 0.3);
                }
                .detail-item {
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 30px;
                    &:last-of-type {
                        margin-right: 0;
                    }
                }
            }
            &:last-of-type {
                .chart-detail:after {
                    display: none;
                }
            }
            .content {
                position: absolute;
                left: 0;
                top: 50px;
                width: 100%;
                // height: 100%;
                text-align: center;
                z-index: 99;
            }
            .chart-percent {
                font-size: 24px;
                color: #ffffff;
                margin-bottom: 15px;
                .chart-percent-cell {
                    font-size: 16px;
                }
            }
            .chart-change-wrap {
                font-size: 12px;
                color: #574fb6;
                margin-bottom: 15px;
                .chart-change-percent {
                    border-radius: 12px;
                    color: #fff;
                    margin-left: 5px;
                    .down {
                        background: #ff5136;
                        border-radius: 12px;
                        padding: 3px 5px;
                    }
                    .up {
                        background: #0dbe9c;
                        border-radius: 12px;
                        padding: 3px 5px;
                    }
                }
            }
            .chart-name {
                font-size: 14px;
            }
        }
    }
    .table-wrap {
        height: calc(100% - 400px);
        padding: 0 20px;
    }
</style>
