
<template>
    <div style="width:100%;height:100%">
        <!-- 标题 -->
        <section class="title-link-wrap clearfix">
            <YwTitleTab @changeTitle="changeTitle"
                        :tabActive="activeFilterTitle"
                        :tabDatas="filterTitle"></YwTitleTab>
        </section>
        <!-- 标题 -->

        <!-- 进度条 -->
        <section class="progress-wrap">
            <div class="progress-item"
                 v-for="(progressDatas,index) in progressList"
                 :key="index"
                 style="width:49%">
                <YwProgressSingle :progressDatas="progressDatas"></YwProgressSingle>
                <div class="progress-detail">
                    <YwTenant :tenantDatas="progressDatas.tenantDatas"></YwTenant>
                </div>
            </div>

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
            YwTable: () => import('@/components/yw-table.vue'),
            YwTitleTab: () => import('@/components/yw-title-tab.vue'),
            YwProgressSingle: () => import('@/components/yw-progress-single.vue'),
            YwTenant: () => import('@/components/yw-tenant.vue'),
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
                filterTitle: [{ name: 'Agent部署', label: 'Agent部署' },],
                activeFilterTitle: 'Agent部署',
                //表格filter
                filterTable: [{ name: '', label: '' }],
                activeFilterTable: '',
                titleDatas: {
                    name: '租户Agent部署情况排行'
                },
                tableTitles: [],
                tableDatas: [],
                progressList: [{ percent: 0, name: '裸金属部署占比', num: '0%，0台', tenantDatas: { userInner: '0%，0台', userOuter: '0%，0台' } },
                { percent: 0, name: '云主机部署占比', num: '0%，0台', tenantDatas: { userInner: '0%，0台', userOuter: '0%，0台' } }]
            }
        },

        methods: {
            //表格排序
            sortTable(datas) {
                this.tableDatas = datas;
            },

            //获得表格数据
            getTableDatas() {
                //更新表格
                this.updateComponent();
                this.tableTitles = [
                    { name: 'department', title: `${this.activeFilterTable}名称`, style: {} },
                    { name: 'pmPercent', title: `裸金属部署占比`, style: { sortable: true, align: 'right', width: 200, isHtml: true } },
                    { name: 'vmPercent', title: `云主机部署占比`, style: { sortable: true, align: 'right', width: 200, isHtml: true } },
                ];

                let params = {
                    monthlyTime: this.monthlyTime,
                    depType: this.activeFilterTable,
                    excludeDep: this.$route.query.excludeDep
                };

                this.$axios.post('/v1/cmdb/index/overview/agentNum/dept', params).then((res) => {
                    if (!res.data.flag) {
                        this.tableDatas = [];
                        return false;
                    }

                    this.tableDatas = res.data.data.map((item, index) => {
                        let pmPercent = divisionNumber(item.pmCount * 100, item.pmTotalCount, 2);
                        let vmPercent = divisionNumber(item.vmCount * 100, item.vmTotalCount, 2);
                        return {
                            department: item.department,
                            pmPercent: item.pmCount,
                            pmPercentHtml: `<span style="color:rgba(255,255,255,.6)">${pmPercent}%，${item.pmCount}台</span>`,
                            vmPercent: item.vmCount,
                            vmPercentHtml: `<span style="color:rgba(255,255,255,.6)">${vmPercent}%，${item.vmCount}台</span>`,
                        }
                    });
                });
            },

            //获得进度条数据
            getProgressDatas() {
                let params = {
                    monthlyTime: this.monthlyTime,
                    excludeDep: this.$route.query.excludeDep
                };

                this.$axios.post('/v1/cmdb/index/overview/agentNum/all', params).then((res) => {
                    if (!res.data.flag) {
                        return false;
                    }

                    if (res.data.data.total && res.data.data.inside && res.data.data.outside) {
                        let pmPercent = divisionNumber(res.data.data.total.pmCount * 100, res.data.data.total.pmTotalCount, 2);
                        let pmPercent_inside = divisionNumber(res.data.data.inside.pmCount * 100, res.data.data.inside.pmTotalCount, 2);
                        let pmPercent_outside = divisionNumber(res.data.data.outside.pmCount * 100, res.data.data.outside.pmTotalCount, 2);
                        this.progressList[0].percent = pmPercent;
                        this.progressList[0].num = `${pmPercent}%，${res.data.data.total.pmCount}台`;
                        this.progressList[0].tenantDatas.userInner = `${pmPercent_inside}%，${res.data.data.inside.pmCount}台`;
                        this.progressList[0].tenantDatas.userOuter = `${pmPercent_outside}%，${res.data.data.outside.pmCount}台`;

                        let vmPercent = divisionNumber(res.data.data.total.vmCount * 100, res.data.data.total.vmTotalCount, 2);
                        let vmPercent_inside = divisionNumber(res.data.data.inside.vmCount * 100, res.data.data.inside.vmTotalCount, 2);
                        let vmPercent_outside = divisionNumber(res.data.data.outside.vmCount * 100, res.data.data.outside.vmTotalCount, 2);
                        this.progressList[1].percent = vmPercent;
                        this.progressList[1].num = `${vmPercent}%，${res.data.data.total.vmCount}台`;
                        this.progressList[1].tenantDatas.userInner = `${vmPercent_inside}%，${res.data.data.inside.vmCount}台`;
                        this.progressList[1].tenantDatas.userOuter = `${vmPercent_outside}%，${res.data.data.outside.vmCount}台`;
                    }


                });
            },

            //获得数据
            getDatas() {
                this.getProgressDatas();
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
            //初始化
            async init() {
                this.filterTable = [{ name: '内部租户', label: '内部租户' }, { name: '外部租户', label: '外部租户' }]
                this.activeFilterTable = this.filterTable[0].label
                this.getDatas();
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style lang="scss" scoped>
    .progress-wrap {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        padding: 0 20px;
        margin: 30px 0 40px 0;
        .progress-detail {
            background: rgba(255, 255, 255, 0.05);
            height: 48px;
            line-height: 48px;
        }
    }
    .table-wrap {
        height: calc(100% - 250px);
        padding: 0 20px;
    }
</style>
