
<template>
    <div class="component-wrap">
        <section class="title-link-wrap clearfix">
            <YwTitleTab @changeTitle="changeTitle"
                        :tabActive="activeFilterTitle"
                        :tabDatas="filterTitle"></YwTitleTab>
        </section>
        <section class="component-main">
            <section class="pie-wrap">
                <div class="pie-item"
                     v-for="(pieItem,pieIndex) in pieDatas"
                     :key="pieIndex"
                     style="width:100%;">
                    <div class="chart-title clearfix">

                    </div>
                    <div class="chart-wrap">
                        <section class="chart-item"
                                 style="width:100%">
                            <YwChartPie :pieDatas="pieItem"
                                        v-if="pieItem.show"></YwChartPie>
                            <div></div>
                        </section>
                    </div>
                </div>
            </section>
        </section>

    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import { xMonth } from '@/utils/filter.js'

    export default {
        props: ['moduleData'],
        components: {
            YwTitleTab: () => import('@/components/yw-title-tab.vue'),
            YwChartPie: () => import('@/components/yw-chart-pie-ring.vue'),
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
                filterTitle: [{ name: '工单', label: '工单' }],
                activeFilterTitle: '工单',
                pieDatas: [
                    {
                        show: false,
                        id: 'pie-1',
                        chartOption: 'pie-option',
                        chartDatas: [],
                        details: { pieColors: ['#5E90FF', '#2D72FD', '#24B09F', '#EDA35D', '#F58230', '#532AE4'], cell: '条', total: 0 }
                    }],
            }
        },

        methods: {
            //标题tab
            changeTitle(val) {
                this.activeFilterTitle = val;
            },
            //获得数据
            getDatas() {
                this.getPieDatas()
            },
            //获得圆环数据
            getPieDatas() {
                this.pieDatas[0].chartDatas = [
                    {
                        name: '资源申请工单',
                        value: 0,
                    },
                    {
                        name: '网络策略工单',
                        value: 0,
                    },
                    {
                        name: '请求变更工单',
                        value: 0,
                    },
                    {
                        name: '告警工单',
                        value: 0,
                    },
                    {
                        name: '故障工单',
                        value: 0,
                    },
                    {
                        name: '维保工单',
                        value: 0,
                    },
                ];

                let params = {
                    "idcType": this.moduleData.pool,
                    "month": this.moduleData.monthlyTime,
                };
                this.$axios.get(`/v1/cmdb/idctenant/bpm/monthlyOperationReport/getOrderReport`, { params: params }).then((res) => {
                    if (res.data.state) {
                        this.pieDatas[0].chartDatas = res.data.value.reportList.map((item) => {
                            for (let itemKey in item) {
                                if (['百分比', '占比'].indexOf(itemKey) < 0) {
                                    return {
                                        name: itemKey,
                                        value: item[itemKey]
                                    }
                                }
                            }

                        })

                        this.pieDatas[0].details.total = res.data.value['工单总数'] || 0;
                    }

                    this.pieDatas[0].show = true
                });
            }

        },

        mounted() {
            this.getDatas()
        }
    }
</script>

<style lang="scss" scoped>
    .component-wrap {
        width: 100%;
        height: 300px;
        padding: 0 40px;
        .title-link-wrap {
            min-height: 36px;
            margin-bottom: 0;
            .yw-select {
                position: absolute;
                top: 20px;
                left: 20px;
            }
        }
        .component-main {
            height: calc(100% - 80px);
            .part-wrap {
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                .part-left {
                    display: flex;
                    flex-flow: column;
                    flex-wrap: nowrap;
                    justify-content: space-between;
                }
            }
        }
        .pie-wrap {
            display: flex;
            justify-content: space-between;
            flex-wrap: nowrap;
            height: 100%;
            .pie-item {
                height: 100%;
                padding: 0 20px;
                .chart-title {
                    padding: 0;
                    margin-bottom: 15px;
                }
                &:first-of-type {
                    .chart-title {
                        margin-bottom: 0;
                    }
                }
                .chart-wrap {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: nowrap;
                    height: 100%;
                }
            }
        }
    }
</style>
