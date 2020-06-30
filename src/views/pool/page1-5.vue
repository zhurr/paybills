
<template>
    <div class="component-wrap">
        <section class="title-link-wrap clearfix">
            <YwTitleTab @changeTitle="changeTitle"
                        :tabActive="activeFilterTitle"
                        :tabDatas="filterTitle"></YwTitleTab>
            <div class="more-link fr"
                 @click="getAlert()"
                 v-if="moduleData.pool">
                <i class="more-flag"></i>
                <span class="more-text">TOP10</span>
                <i class="more-arrow">></i>
            </div>
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

        <!-- dialog -->
        <DialogAlert :dialogMsg="dialogMsg"
                     :moduleData="moduleData"
                     @closeDialog="closeDialog"
                     v-if="dialogMsg.dialogVisible"></DialogAlert>
        <!-- dialog -->
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
            DialogAlert: () => import('./dialog-alert.vue'),
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
                filterTitle: [{ name: '告警', label: '告警' }],
                activeFilterTitle: '告警',
                pieDatas: [
                    {
                        show: false,
                        id: 'pie-1',
                        chartOption: 'pie-option',
                        chartDatas: [],
                        details: { pieColors: ['#E12E1B', '#F95645', '#FF8073', '#FFB6AE'], cell: '条', total: 0 }
                    }],
                //dialog
                dialogMsg: {
                    dialogVisible: false,
                    id: '',//预留：每个弹窗数据的唯一标识
                    data: {} //预留：数据
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
                    // {
                    //     name: '严重告警',
                    //     value: 0,
                    // },
                    // {
                    //     name: '重要告警',
                    //     value: 0,
                    // },
                    // {
                    //     name: '次要告警',
                    //     value: 0,
                    // },
                    // {
                    //     name: '提醒告警',
                    //     value: 0,
                    // },

                ];

                let params = {
                    "idcType": this.moduleData.pool,
                    "month": this.moduleData.monthlyTime,
                };

                this.$axios.post('/v1/alerts/monReport/viewByIdcType', params).then((res) => {
                    this.pieDatas[0].details.total = res.data['告警总量'] || 0;
                    for (let itemKey in res.data.data) {
                        this.pieDatas[0].chartDatas.push({
                            name: itemKey,
                            value: res.data.data[itemKey] || 0
                        })
                    }
                    this.pieDatas[0].show = true
                });
            },
            getAlert() {
                this.dialogMsg.dialogVisible = true;
            },
            //关闭弹窗
            closeDialog(val) {
                this.dialogMsg.dialogVisible = false;
                if (val === 'update') {

                }

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
        padding: 0 40px;
        .title-link-wrap {
            min-height: 36px;
            margin-bottom: 0;
            .yw-select {
                position: absolute;
                top: 20px;
                left: 20px;
            }
            .more-link {
                font-size: 16px;
                cursor: pointer;
                .more-flag {
                    display: inline-block;
                    vertical-align: middle;
                    width: 18px;
                    height: 18px;
                    background: url(../../assets/img/chart.png) no-repeat;
                    background-size: contain;
                }
                .more-text {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 5px;
                }
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
