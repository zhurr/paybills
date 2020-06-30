
<template>
    <div style="width:100%;height:100%">
        <!-- 标题 -->
        <section class="title-link-wrap clearfix">
            <YwTitleTab @changeTitle="changeTitle"
                        :tabActive="activeFilterTitle"
                        :tabDatas="filterTitle"></YwTitleTab>
        </section>
        <!-- 标题 -->

        <!-- 内容 -->
        <div style="width:100%;height:calc(100% - 60px)">
            <!-- 图表 -->
            <div class="chart-wrap">
                <div class="static-chart"
                     v-if="!showEmptyDatas.show">
                    <section class="chart-item"
                             :class="{active:item.active}"
                             style="width:32%;height:100%;"
                             @click="clickChart(item,index)"
                             v-for="(item,index) in pieDatas"
                             :key="index">
                        <div class="chart-box">
                            <p class="chart-num text-ellipse"
                               :title="item.typeObj.count">{{item.typeObj.count}}</p>
                            <p class="chart-memory"
                               v-if="item.typeObj.memory">{{item.typeObj.memory}}</p>
                        </div>
                        <div class="chart-desc">
                            <p class="chart-name">{{item.typeObj.name}}</p>
                        </div>
                        <div class="chart-tenant">
                            <YwTenant :tenantDatas="item.typeObj.tenantDatas"></YwTenant>
                        </div>
                    </section>
                </div>
                <YwChartEmpty v-else
                              :showEmptyDatas="showEmptyDatas"></YwChartEmpty>
            </div>
            <!-- 图表 -->
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
        <!-- 内容 -->
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
            YwTable: () => import('@/components/yw-table.vue'),
            YwTitleTab: () => import('@/components/yw-title-tab.vue'),
            YwTenant: () => import('@/components/yw-tenant.vue'),
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
                filterTitle: [{ name: '资源回收', label: '资源回收' },],
                activeFilterTitle: '资源回收',
                //表格filter
                filterTable: [{ name: '', label: '' }],
                activeFilterTable: '',
                titleDatas: {
                    name: '裸金属回收明细'
                },
                tableTitles: [],
                tableDatas: [],
                pieDatas: [{ id: 'page5-right-1', chartOption: 'pie-option', chartDatas: [], typeObj: { count: 0, name: '裸金属本月回收(台)', type: { code: '物理机', name: '裸金属' }, tenantDatas: { userInner: '0台', userOuter: '0台' } }, active: true },
                { id: 'page5-right-2', chartOption: 'pie-option', chartDatas: [], typeObj: { count: 0, name: 'GPU本月回收(台)', type: { code: 'GPU', name: 'GPU' }, tenantDatas: { userInner: '0台', userOuter: '0台' } }, active: false },
                { id: 'page5-right-3', chartOption: 'pie-option', chartDatas: [], typeObj: { count: 0, memory: '内存 0G', name: '云主机本月回收VCPU数(个)', type: { code: '虚拟机', name: '云主机' }, tenantDatas: { userInner: '0台', userOuter: '0台' } }, active: false },
                ],
                //图表模块选中
                activeModule: {

                },
                //空数据
                showEmptyDatas: { show: false, content: '数据正在生成中，可参考上月数据' },
            }
        },

        methods: {
            //获得图表数据
            getPieDatas() {
                let params = {
                    monthlyTime: this.monthlyTime,
                    excludeDep: this.$route.query.excludeDep
                };

                this.$axios.post('/v1/cmdb/index/overview/recycleCount/all', params).then((res) => {
                    this.showEmptyDatas.show = false;
                    if (!res.data.flag) {
                        this.showEmptyDatas.show = true;
                        this.showEmptyDatas.content = res.data.errorMsg;
                        return false;
                    }

                    if (res.data.data.total && res.data.data.inside && res.data.data.outside) {
                        this.pieDatas[0].typeObj.count = res.data.data.total.pmReCnt || 0;
                        this.pieDatas[0].typeObj.tenantDatas.userInner = `${res.data.data.inside.pmReCnt || 0}台`;
                        this.pieDatas[0].typeObj.tenantDatas.userOuter = `${res.data.data.outside.pmReCnt || 0}台`;

                        this.pieDatas[1].typeObj.count = res.data.data.total.gpuReCnt || 0;
                        this.pieDatas[1].typeObj.tenantDatas.userInner = `${res.data.data.inside.gpuReCnt || 0}台`;
                        this.pieDatas[1].typeObj.tenantDatas.userOuter = `${res.data.data.outside.gpuReCnt || 0}台`;

                        this.pieDatas[2].typeObj.count = res.data.data.total.vmReCnt || 0;
                        this.pieDatas[2].typeObj.memory = `内存 ${fixedNumber(res.data.data.total.vmMsCnt, 2)}G`;
                        this.pieDatas[2].typeObj.tenantDatas.userInner = `${res.data.data.inside.vmReCnt || 0}个`;
                        this.pieDatas[2].typeObj.tenantDatas.userOuter = `${res.data.data.outside.vmReCnt || 0}个`;
                    }

                });
            },
            //图表点击
            clickChart(item, index) {
                this.activeModule = item;
                this.getTableDatas();
                this.pieDatas.forEach((item) => {
                    item.active = false;
                });
                item.active = true;

            },

            //表格排序
            sortTable(datas) {
                this.tableDatas = datas;
            },

            //获得表格数据
            getTableDatas() {
                //更新表格
                this.updateComponent();
                this.titleDatas.name = `${this.activeModule.typeObj.type.name}回收明细`;
                let cell = '（台）';
                if (this.activeModule.typeObj.type.code === '虚拟机') {
                    cell = '（个）';
                }
                this.tableTitles = [
                    { name: 'department', title: `${this.activeFilterTable}名称`, style: {} },
                    { name: 'recycleCount', title: `回收数量${cell}`, style: { sortable: true, align: 'right', width: 200 } },
                ];


                let params = {
                    monthlyTime: this.monthlyTime,
                    depType: this.activeFilterTable,
                    deviceType: this.activeModule.typeObj.type.code,
                    excludeDep: this.$route.query.excludeDep
                };

                this.$axios.post('/v1/cmdb/index/overview/recycleCount/devt', params).then((res) => {
                    if (!res.data.flag) {
                        this.tableDatas = [];
                        return false;
                    }

                    this.tableDatas = res.data.data;
                });
            },

            //获得数据
            getDatas() {
                this.filterTable = [{ name: '内部租户', label: '内部租户' }, { name: '外部租户', label: '外部租户' }]
                this.activeFilterTable = this.filterTable[0].label
                this.getPieDatas();
                this.activeModule = this.pieDatas[0];
                this.getTableDatas();
            },
            //表格tab
            changeTable(val) {
                this.getTableDatas();
            },
            //标题tab
            changeTitle(val) {
                this.activeFilterTitle = val;
                this.getDatas();
            },
        },
        mounted() {
            this.getDatas();
        }
    }
</script>

<style lang="scss" scoped>
    .chart-wrap {
        width: 100%;
        height: 250px;
        padding: 10px 20px 30px 20px;
        .static-chart {
            display: flex;
            justify-content: space-between;
            flex-wrap: nowrap;
            width: 100%;
            height: 100%;
        }
        .chart-item {
            position: relative;
            background: rgba(255, 255, 255, 0.05);
            border: 4px solid transparent;
            cursor: pointer;
            .chart-box {
                width: 120px;
                height: 120px;
                background: url(../../assets/img/img_circle.png) no-repeat;
                background-size: contain;
                margin: 20px auto 0 auto;
                text-align: center;
                .chart-num {
                    max-width: 80%;
                    font-size: 20px;
                    padding-top: 45px;
                }
                .chart-memory {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.6);
                }
            }

            .chart-name {
                font-size: 14px;
                text-align: center;
                margin-top: 10px;
            }
            .chart-tenant {
                position: absolute;
                bottom: 10px;
                width: 100%;
            }

            &.active {
                border: 4px solid #0d7ef4;
                &:after,
                &:before {
                    content: "";
                    position: absolute;
                    width: 0;
                    height: 0;
                    border: 16px solid transparent;
                    border-top-color: #0d7ef4;
                    left: 50%;
                    margin-left: -16px;
                    bottom: -32px;
                }
                &:after {
                    border-top-color: #261f76;
                    bottom: -26px;
                }
            }
        }
    }
    .table-wrap {
        // margin-top: 30px;
        height: calc(100% - 280px);
        padding: 0 20px;
    }
</style>
