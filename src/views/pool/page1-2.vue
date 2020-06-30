
<template>
    <div class="component-wrap">
        <section class="title-link-wrap clearfix">
            <YwTitleTab @changeTitle="changeTitle"
                        :tabActive="activeFilterTitle"
                        :tabDatas="filterTitle"></YwTitleTab>
            <el-select class="yw-select round"
                       style="width:170px;"
                       v-model="activefilterSelect"
                       filterable
                       @change="changeSelect"
                       popper-class="yw-select-options"
                       placeholder="请选择">
                <el-option v-for="(item,index) in filterSelect"
                           :key="index"
                           :label="item.name"
                           :value="item.label">
                </el-option>
            </el-select>
        </section>
        <section class="component-main">
            <div style="width:49.5%">
                <section class="total-wrap">
                    <div class="total-item"
                         style="width:100%">
                        <div class="total-num-wrap">
                            <p class="total-num">{{totalDatas.total.name}}<span class="cell">(T)</span></p>
                            <p class="total-order">{{totalDatas.total.num}}</p>
                        </div>
                        <div class="detail-list">
                            <div class="detail-item"
                                 v-for="(item,index) in totalDatas.list1"
                                 :key="index">
                                <div class="detail-left">
                                    <i class="detail-img"></i>
                                </div>
                                <div class="detail-right">
                                    <p class="num">{{item.num}}</p>
                                    <p class="text">{{item.name}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div class="part-wrap"
                     style="width:100%">
                    <div class="part-left"
                         style="width:49.5%">
                        <section class="num-wrap"
                                 style="width:100%">
                            <div class="total-item-per"
                                 style="width:49.5%"
                                 v-for="(perItem,perIndex) in totalDatas.list2"
                                 :key="perIndex">
                                <p class="per-num">{{perItem.num}}</p>
                                <p class="per-text">{{perItem.name}}</p>
                            </div>
                        </section>
                        <section class="progress-wrap"
                                 style="width:100%">
                            <div class="progress-item"
                                 v-for="(progressItem,progressIndex) in progressDatas"
                                 :key="progressIndex"
                                 style="width:100%">
                                <p class="progress-text">{{progressItem.name}}</p>
                                <YwProgress :datas="{percentage:progressItem.percent,index:''}"
                                            style="width:95%"
                                            :option="progressOption"></YwProgress>
                                <p class="progress-percent">
                                    <span>同比上月份</span>
                                    <YwNumUpDown :datas="progressItem.change"
                                                 :options="{color: true,background: false}"
                                                 style="margin-left:10px"></YwNumUpDown>

                                </p>
                            </div>
                        </section>
                    </div>
                    <section class="gauge-wrap"
                             style="width:49.5%">
                        <div class="gauge-item"
                             v-for="(gaugeItem,gaugeIndex) in 1"
                             :key="gaugeIndex"
                             style="width:100%">
                            <!-- <div class="chart-title clearfix">
                                <span>{{gaugeDatas[gaugeIndex*2].chartDatas.title}}</span>
                            </div> -->
                            <div class="chart-wrap">
                                <section class="chart-item"
                                         v-for="(subItem,subIndex) in gaugeDatas.slice(gaugeIndex*2,2 + gaugeIndex*2)"
                                         :key="subIndex"
                                         style="width:100%">
                                    <YwChartGauge :gaugeDatas="subItem"
                                                  v-if="subItem.show"></YwChartGauge>
                                </section>
                            </div>
                        </div>
                    </section>
                </div>

            </div>
            <div style="width:49.5%">
                <section class="line-wrap">
                    <div class="line-item"
                         v-for="(lineItem,lineIndex) in lineDatas"
                         :key="lineIndex"
                         style="width:100%;">
                        <div class="chart-title clearfix">
                            <span>{{lineItem.details.title}}</span>
                            <el-tabs class="yw-tabs fr"
                                     v-model="activefilterLine"
                                     type="card"
                                     @tab-click="changeLine">
                                <el-tab-pane :label="item.name"
                                             v-for="(item,index) in filterLine"
                                             :key="index"
                                             :name="item.label"></el-tab-pane>
                            </el-tabs>
                        </div>
                        <div class="chart-wrap">
                            <section class="chart-item"
                                     style="width:100%">
                                <YwChartLine :lineDatas="lineItem"
                                             v-if="lineItem.show"></YwChartLine>
                            </section>
                        </div>
                    </div>
                </section>
            </div>
        </section>

    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import { xMonth, fixedNumber } from '@/utils/filter.js'

    export default {
        props: ['moduleData'],
        components: {
            YwTitleTab: () => import('@/components/yw-title-tab.vue'),
            YwProgress: () => import('@/components/yw-progress.vue'),
            YwNumUpDown: () => import('@/components/yw-num-UpDown.vue'),
            YwChartGauge: () => import('@/components/yw-chart-gauge.vue'),
            YwChartLine: () => import('@/components/yw-chart-line.vue'),
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
                filterTitle: [{ name: '存储资源', label: '存储资源' }],
                activeFilterTitle: '存储资源',
                //下拉框
                filterSelect: [{ name: '', label: '' }],
                activefilterSelect: '',
                //曲线图
                filterLine: [{ name: '使用率', label: '使用率' }, { name: '分配率', label: '分配率' }],
                activefilterLine: '使用率',
                totalDatas: {
                    total: {
                        name: '裸金属总量',
                        num: '0'
                    },
                    list1: [
                        {
                            name: '已建(T)',
                            num: 0,
                        },
                        {
                            name: '在建(T)',
                            num: 0,
                        }
                    ],
                    list2: [
                        {
                            name: '已分配(台)',
                            num: 0,
                        },
                        {
                            name: '已创建(台)',
                            num: 0,
                        },
                    ]
                },
                gaugeDatas: [{ show: false, id: 'gauge-1', chartOption: 'gauge-option', chartDatas: { title: '', type: '利用率', name: '利用率', rate: 0, changeName: '同比上月份', change: 0 } },
                ],

                lineDatas: [
                    { show: false, id: 'pool-line-1', chartOption: 'line-option', chartDatas: [], details: { title: '使用率月度趋势', seriesName: [{ name: '存储利用率', yLabel: 'cpu', xLabel: 'name' }] } },
                ],
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
                progressDatas: [
                    {
                        name: '',
                        percent: 0,
                        changeName: '同比上月份',
                        change: 0
                    },
                ],
            }
        },

        methods: {
            //标题tab
            changeTitle(val) {
                this.activeFilterTitle = val;
            },
            //下拉框
            changeSelect() {
                this.getDatas()
            },
            //曲线图
            changeLine() {
                this.getLineDatas()
            },

            //获得下拉框数据
            getFilterSelect() {
                let params = {
                    "type": 'month_report_storage_type',
                };

                return this.$axios.get('/v1/cmdb/configDict/getDictsByType', { params: params }).then((res) => {
                    this.filterSelect = res.data.map((item) => {
                        return {
                            name: item.name,
                            label: item.value
                        }
                    })

                    this.activefilterSelect = this.filterSelect[0].label
                    return res.data
                });
            },

            //获得统计数据
            getTotalDatas() {
                let params = {
                    "idcType": this.moduleData.pool,
                    "month": this.moduleData.monthlyTime,
                    storageType: this.activefilterSelect
                };

                this.$axios.get('/v1/cmdb/monthReport/countStorageResource', { params: params }).then((res) => {
                    this.totalDatas.total.name = `${this.activefilterSelect}总量`
                    this.totalDatas.total.num = fixedNumber(res.data[this.totalDatas.total.name + '(T)'], 2)
                    this.totalDatas.list1.forEach((item) => {
                        item.num = fixedNumber(res.data[item.name], 2);
                    })
                    this.totalDatas.list2.forEach((item) => {
                        item.num = res.data[item.name];
                    })

                    //获得进度条数据
                    this.progressDatas[0].name = `${this.activefilterSelect}分配率`
                    this.progressDatas[0].percent = fixedNumber(res.data[this.progressDatas[0].name], 2)
                    this.progressDatas[0].change = fixedNumber(res.data[this.progressDatas[0].changeName], 2)
                });
            },

            //获得gauge数据
            getGaugeDatas() {

                let params = {
                    "idcType": this.moduleData.pool,
                    "month": this.moduleData.monthlyTime,
                    deviceType: this.activefilterSelect
                };

                this.$axios.post('/v1/kpi/restful/getIdcTypeStoreUseRate', params).then((res) => {
                    this.gaugeDatas.forEach((item, index) => {
                        item.chartDatas.name = `${this.activefilterSelect}利用率`
                        item.chartDatas.rate = fixedNumber(res.data[item.chartDatas.name], 2)
                        item.chartDatas.change = fixedNumber(res.data[item.chartDatas.changeName], 2)
                        this.gaugeDatas[index].show = true
                    })

                });
            },

            //获得进度条数据
            getProgressDatas() {

            },

            //获得line数据
            getLineDatas() {

                let params = {
                    "idcType": this.moduleData.pool,
                    "month": this.moduleData.monthlyTime,
                    type: this.activefilterLine,
                    storageType: this.activefilterSelect
                };

                this.$axios.get('/v1/cmdb/monthReport/countStorageSixMonthTrend', { params: params }).then((res) => {

                    if (res.data && res.data.length > 0) {
                        this.lineDatas[0].chartDatas = res.data
                        this.lineDatas[0].details.title = `${this.activefilterSelect}${this.activefilterLine}月度趋势`
                        this.lineDatas[0].details.seriesName[0].name = this.activefilterLine
                        this.lineDatas[0].details.seriesName[0].xLabel = '月份'
                        this.lineDatas[0].details.seriesName[0].yLabel = this.activefilterLine
                    }

                    this.lineDatas[0].show = false
                    this.$nextTick(() => {
                        this.lineDatas[0].show = true
                    })
                });
            },

            //获得数据
            getDatas() {
                this.getTotalDatas()
                this.getGaugeDatas()
                this.getProgressDatas()
                this.getLineDatas()
            },

            async init() {
                await this.getFilterSelect()
                this.getDatas()
            }

        },

        mounted() {
            this.init()
        }
    }
</script>

<style lang="scss" scoped>
    .component-wrap {
        width: 100%;
        height: 420px;
        padding: 0 20px;
        .title-link-wrap {
            min-height: 36px;
            .yw-select {
                position: absolute;
                top: 20px;
                left: 20px;
            }
        }
        .component-main {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
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
        .num-wrap {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            .total-item-per {
                height: 94px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.2);
                text-align: center;
                .per-num {
                    font-size: 16px;
                    margin: 20px 0 10px 0;
                }
                .per-text {
                    font-size: 14px;
                }
            }
        }

        .total-wrap {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            width: 100%;
            height: 80px;
            background: #2d72fd;
            margin-bottom: 20px;
            .total-item {
                width: 50%;
                display: flex;
                justify-content: space-between;
                &:before {
                    content: "";
                    display: inline-block;
                    width: 1px;
                    height: 60px;
                    background: linear-gradient(#1ff9d7 0%, #0854ff 100%);
                    margin-top: 5px;
                }
                &:first-of-type {
                    &:before {
                        display: none;
                    }
                }
                &:nth-of-type(2) {
                    padding: 16px;
                }
                .total-item-per {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    text-align: center;
                    .per-num {
                        font-size: 16px;
                        margin: 10px 0;
                    }
                    .per-text {
                        font-size: 14px;
                    }
                }
                .total-num-wrap {
                    display: inline-block;
                    padding: 15px 0 0 30px;
                    .total-num {
                        margin-bottom: 10px;
                        font-size: 16px;
                        .cell {
                            font-size: 12px;
                        }
                    }
                    .total-order {
                        font-size: 20px;
                        .order-num {
                            display: inline-block;
                            width: 35px;
                            height: 48px;
                            line-height: 48px;
                            background: url(../../assets/img/bg_number.png)
                                no-repeat;
                            background-size: contain;
                            font-size: 30px;
                            text-align: center;
                            margin-right: 10px;
                        }
                    }
                }
                .detail-list {
                    display: inline-block;
                    margin-right: 50px;
                    .detail-item {
                        display: inline-block;
                        margin-top: 20px;
                        margin-right: 50px;
                        .detail-left {
                            display: inline-block;
                            vertical-align: middle;
                            width: 32px;
                            height: 32px;
                            border-radius: 100%;
                            background: rgba(255, 255, 255, 0.2);
                            margin-right: 15px;
                            text-align: center;
                            .detail-img {
                                display: inline-block;
                                width: 32px;
                                height: 32px;
                                background: url(../../assets/img/file.png) no-repeat;
                                background-size: contain;
                            }
                        }
                        .detail-right {
                            display: inline-block;
                            vertical-align: middle;
                            .num {
                                font-size: 16px;
                                color: #ffe873;
                            }
                            .text {
                                font-size: 14px;
                                color: rgba(255, 255, 255, 0.8);
                            }
                        }
                    }
                }
            }
        }
        .progress-wrap {
            display: flex;
            justify-content: space-between;
            flex-wrap: nowrap;
            margin-bottom: 30px;
            .progress-item {
                position: relative;
                height: 94px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding-left: 20px;
                .progress-text {
                    font-size: 14px;
                    margin: 10px 0 5px 0;
                }
                .progress-percent {
                    margin-top: 10px;
                    font-size: 12px;
                    color: #574fb6;
                }
            }
        }
        .gauge-wrap {
            display: flex;
            justify-content: space-between;
            flex-wrap: nowrap;
            margin-bottom: 30px;
            .gauge-item {
                position: relative;
                height: 200px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 20px;
                .chart-title {
                    padding: 0;
                    margin-bottom: 10px;
                }
                .chart-wrap {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: nowrap;
                    height: 100%;
                }
            }
        }
        .line-wrap {
            display: flex;
            justify-content: space-between;
            flex-wrap: nowrap;
            margin-top: 10px;
            .line-item {
                height: 320px;
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
                    height: calc(100% - 30px);
                }
            }
        }
    }
</style>
