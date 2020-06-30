
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
            <section class="progress-wrap">
                <div class="progress-item"
                     v-for="(progressItem,progressIndex) in 1"
                     :key="progressIndex"
                     style="width:100%">
                    <p class="progress-text">{{progressDatas.name}}</p>
                    <YwProgress :datas="{percentage:progressDatas.percent,index:''}"
                                style="width:calc(100% + 20px)"
                                :option="progressOption"></YwProgress>
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
            YwProgress: () => import('@/components/yw-progress.vue'),
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
                filterTitle: [{ name: '故障', label: '故障' }],
                activeFilterTitle: '故障',
                pieDatas: [
                    {
                        show: false,
                        id: 'pie-1',
                        chartOption: 'pie-option',
                        chartDatas: [],
                        details: { pieColors: ['#F77B0C', '#FF9719', '#FBBD44', '#FAD898', '#3EDBCB', '#1C91E9'], legend: { top: 'auto' }, cell: '条', total: 0 }
                    }],
                progressDatas: {
                    name: '故障处理及时率',
                    percent: 0,
                },
                progressOption: {
                    label: {
                        //位置
                        position: 'outer',//['outer','inner']
                        //百分比
                        percentage: {
                            show: true
                        },
                    }
                },
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
                        name: '特别重大故障',
                        value: 0,
                    },
                    {
                        name: '重大故障',
                        value: 0,
                    },
                    {
                        name: '较大故障',
                        value: 0,
                    },
                    {
                        name: '一般故障',
                        value: 0,
                    },
                    {
                        name: '异常事件',
                        value: 0,
                    },
                    {
                        name: '常规软硬件故障',
                        value: 0,
                    },
                ];

                let params = {
                    "idcType": this.moduleData.pool,
                    "month": this.moduleData.monthlyTime,
                };
                this.$axios.get(`/v1/cmdb/idctenant/bpm/monthlyOperationReport/getAlarmErrorReport`, { params: params }).then((res) => {
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

                        this.pieDatas[0].details.total = res.data.value['故障总数'] || 0;

                        this.progressDatas.name = '故障处理及时率'
                        this.progressDatas.percent = res.data.value.rateObject[this.progressDatas.name]
                    }

                    this.pieDatas[0].show = true
                });
            },



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
        padding: 0 10px;
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
            position: relative;
            height: calc(100% - 60px);
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
            // height: calc(100% - 60px);
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
        .progress-wrap {
            position: absolute;
            bottom: 0px;
            display: flex;
            justify-content: space-between;
            flex-wrap: nowrap;
            width: 164px;
            .progress-item {
                position: relative;
                height: 48px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding-left: 10px;
                .progress-text {
                    font-size: 14px;
                    margin: 2px 0;
                }
                .progress-percent {
                    margin-top: 10px;
                    font-size: 12px;
                    color: #574fb6;
                }
            }
        }
    }
</style>
