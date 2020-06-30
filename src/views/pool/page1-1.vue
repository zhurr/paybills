
<template>
    <div class="component-wrap">
        <section class="title-link-wrap clearfix">
            <YwTitleTab @changeTitle="changeTitle"
                        :tabActive="activeFilterTitle"
                        :tabDatas="filterTitle"></YwTitleTab>
            <!-- <el-select class="yw-select round"
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
            </el-select> -->
        </section>
        <section class="total-wrap">
            <div class="total-item"
                 style="width:49%">
                <div class="total-num-wrap">
                    <p class="total-num">裸金属总量<span class="cell">（台）</span></p>
                    <p class="total-order">
                        <span class="order-num"
                              v-for="(item,index) in totalDatas.total.num"
                              :key="index">{{item}}</span>
                    </p>
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
            <div class="total-item"
                 style="width:51%">
                <div class="total-item-per"
                     style="width:32%"
                     v-for="(perItem,perIndex) in totalDatas.list2"
                     :key="perIndex">
                    <p class="per-num">{{perItem.num}}</p>
                    <p class="per-text">{{perItem.name}}</p>
                </div>
            </div>
        </section>
        <section class="progress-wrap">
            <div class="progress-item"
                 v-for="(progressItem,progressIndex) in progressDatas"
                 :key="progressIndex"
                 style="width:49.5%">
                <p class="progress-text">{{progressItem.name}}</p>
                <YwProgress :datas="{percentage:progressItem.percent,index:''}"
                            style="width:60%"
                            :option="progressOption"></YwProgress>
                <p class="progress-percent">
                    <span>同比上月份</span>
                    <YwNumUpDown :datas="progressItem.change"
                                 :options="{color: true,background: false}"
                                 style="margin-left:10px"></YwNumUpDown>

                </p>
            </div>
        </section>
        <section class="gauge-wrap">
            <div class="gauge-item"
                 v-for="(gaugeItem,gaugeIndex) in 2"
                 :key="gaugeIndex"
                 style="width:49.5%;">
                <div class="chart-title clearfix">
                    <span>{{gaugeDatas[gaugeIndex*2].chartDatas.title}}</span>
                </div>
                <div class="chart-wrap">
                    <section class="chart-item"
                             v-for="(subItem,subIndex) in gaugeDatas.slice(gaugeIndex*2,2 + gaugeIndex*2)"
                             :key="subIndex"
                             style="width:50%">
                        <YwChartGauge :gaugeDatas="subItem"
                                      v-if="subItem.show"></YwChartGauge>
                    </section>
                </div>
            </div>
        </section>
        <section class="line-wrap">
            <div class="line-item"
                 v-for="(lineItem,lineIndex) in lineDatas"
                 :key="lineIndex"
                 style="width:49.5%;">
                <div class="chart-title clearfix">
                    <span>{{lineItem.details.title}}</span>
                    <el-tabs class="yw-tabs fr"
                             v-if="lineIndex === 0"
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
                filterTitle: [{ name: '计算资源', label: '计算资源' }],
                activeFilterTitle: '计算资源',
                //下拉框
                filterSelect: [{ name: '物理计算资源', label: '物理计算资源' }, { name: '物理计算资源2', label: '物理计算资源2' }],
                activefilterSelect: '物理计算资源',
                //曲线图
                filterLine: [{ name: '均峰值利用率', label: 'MAX' }, { name: '均值利用率', label: 'AVG' }],
                activefilterLine: 'MAX',
                gaugeDatas: [{ show: false, id: 'gauge-1', chartOption: 'gauge-option', chartDatas: { title: '裸金属均峰值利用率', name: 'CPU均峰值利用率', changeName: '同比上月份', rate: 0, change: 0 } },
                { show: false, id: 'gauge-2', chartOption: 'gauge-option', chartDatas: { title: '裸金属均峰值利用率', name: '内存均峰值利用率', changeName: '同比上月份', rate: 30, change: -10 } },
                { show: false, id: 'gauge-3', chartOption: 'gauge-option', chartDatas: { title: '裸金属均值利用率', name: 'CPU均值利用率', changeName: '同比上月份', rate: 50, change: 20 } },
                { show: false, id: 'gauge-4', chartOption: 'gauge-option', chartDatas: { title: '裸金属均值利用率', name: '内存均值利用率', changeName: '同比上月份', rate: 80, change: -30 } }],

                lineDatas: [
                    { show: false, id: 'line-1', chartOption: 'line-option', chartDatas: [], details: { title: '裸金属均峰值利用率月度趋势', valueType: { name: '均峰值利用率', label: 'max' }, seriesName: [{ name: 'CPU', yLabel: 'cpu', xLabel: 'name' }, { name: '内存', yLabel: 'memory', xLabel: 'name' }] } },
                    { show: false, id: 'line-2', chartOption: 'line-option', chartDatas: [], details: { title: '裸金属使用率/裸金属分配率', seriesName: [{ name: '使用率', yLabel: 'create', xLabel: 'name' }, { name: '分配率', yLabel: 'distribution', xLabel: 'name' }] } },
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
                        name: '裸金属分配率',
                        percent: 0,
                        changeName: '同比上月份',
                        change: 0
                    },
                    {
                        name: '裸金属使用率',
                        percent: 0,
                        changeName: '同比上月份',
                        change: 0
                    }
                ],
                totalDatas: {
                    total: {
                        name: '裸金属总量(台)',
                        num: '0'
                    },
                    list1: [
                        {
                            name: '已建(台)',
                            num: 0,
                        },
                        {
                            name: '在建(台)',
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
                        {
                            name: '管理节点(台)',
                            num: 0,
                        }
                    ]
                },
            }
        },

        methods: {
            //标题tab
            changeTitle(val) {
                this.activeFilterTitle = val;
            },
            //下拉框
            changeSelect() {

            },
            //曲线图
            changeLine() {
                this.getLineDatas();
            },

            //获得统计数据
            getTotalDatas() {
                let params = {
                    "idcType": this.moduleData.pool,
                    "month": this.moduleData.monthlyTime,
                };

                this.$axios.get('/v1/cmdb/monthReport/countCompResource', { params: params }).then((res) => {
                    this.totalDatas.total.num = (res.data[this.totalDatas.total.name] || 0) + ''
                    this.totalDatas.list1.forEach((item) => {
                        item.num = res.data[item.name] || 0;
                    })
                    this.totalDatas.list2.forEach((item) => {
                        item.num = res.data[item.name] || 0;
                    })
                });
            },
            //获得进度条数据
            getProgressDatas() {
                let params = {
                    "idcType": this.moduleData.pool,
                    "month": this.moduleData.monthlyTime,
                };

                this.$axios.get('/v1/cmdb/monthReport/countRateCompResource', { params: params }).then((res) => {
                    this.progressDatas.forEach((item, index) => {
                        item.percent = fixedNumber(res.data[index][item.name], 2);
                        item.change = fixedNumber(res.data[index][item.changeName], 2);
                    })
                });
            },

            //获得gauge数据
            getGaugeDatas() {
                let params = {
                    "idcType": this.moduleData.pool,
                    "month": this.moduleData.monthlyTime,
                    "deviceType": 'X86服务器'
                };

                this.$axios.post('/v1/kpi/restful/getIdcTypeUserRate', params).then((res) => {
                    this.gaugeDatas.forEach((item, index) => {
                        item.chartDatas.rate = fixedNumber(res.data[index][item.chartDatas.name], 2)
                        item.chartDatas.change = fixedNumber(res.data[index][item.chartDatas.changeName], 2)
                        this.gaugeDatas[index].show = true
                    })
                });

            },
            //获得line数据(利用率)
            getLineDatas() {

                let params = {
                    "idcType": this.moduleData.pool,
                    "month": this.moduleData.monthlyTime,
                    "deviceType": 'X86服务器',
                    countType: this.activefilterLine
                };

                this.$axios.post('/v1/kpi/restful/getIdcTypeTrends', params).then((res) => {
                    this.lineDatas[0].chartDatas = res.data
                    this.lineDatas[0].details.seriesName[0].xLabel = '日期'
                    this.lineDatas[0].details.seriesName[1].xLabel = '日期'

                    if (this.activefilterLine === 'MAX') {
                        this.lineDatas[0].details.seriesName[0].yLabel = 'CPU均峰值利用率'
                        this.lineDatas[0].details.seriesName[1].yLabel = '内存均峰值利用率'
                        this.lineDatas[0].details.valueType.name = `均峰值利用率`
                    } else {
                        this.lineDatas[0].details.seriesName[0].yLabel = '内存均值利用率'
                        this.lineDatas[0].details.seriesName[1].yLabel = 'CPU均值利用率'
                        this.lineDatas[0].details.valueType.name = `均值利用率`
                    }

                    this.lineDatas[0].show = false
                    this.$nextTick(() => {
                        this.lineDatas[0].show = true
                    })
                });
            },

            //获得line数据(分配率)
            getLineDatas2() {

                let params = {
                    "idcType": this.moduleData.pool,
                    "month": this.moduleData.monthlyTime,
                    "monthCount": 6
                };

                this.$axios.get('/v1/cmdb/monthReport/countSixMonthTrend', { params: params }).then((res) => {
                    this.lineDatas[1].chartDatas = res.data
                    this.lineDatas[1].details.seriesName[0].xLabel = '月份'
                    this.lineDatas[1].details.seriesName[1].xLabel = '月份'

                    this.lineDatas[1].details.seriesName[0].yLabel = '使用率'
                    this.lineDatas[1].details.seriesName[1].yLabel = '分配率'

                    this.lineDatas[1].show = false
                    this.$nextTick(() => {
                        this.lineDatas[1].show = true
                    })
                });
            },

            //获得数据
            init() {
                this.getTotalDatas()
                this.getProgressDatas()
                this.getGaugeDatas()
                this.getLineDatas()
                this.getLineDatas2()
            },

        },

        mounted() {
            this.init()
        }
    }
</script>

<style lang="scss" scoped>
    .component-wrap {
        width: 100%;
        height: 870px;
        padding: 0 20px;
        .title-link-wrap {
            min-height: 36px;
            .yw-select {
                position: absolute;
                top: 20px;
                left: 20px;
            }
        }

        .total-wrap {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            width: 100%;
            height: 100px;
            background: #2d72fd;
            margin: 20px 0;
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
                    padding: 10px 0 0 50px;
                    .total-num {
                        margin-bottom: 10px;
                        font-size: 16px;
                        .cell {
                            font-size: 12px;
                        }
                    }
                    .total-order {
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
                        margin-top: 28px;
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
                height: 60px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding-left: 20px;
                .progress-text {
                    font-size: 14px;
                    margin: 10px 0 5px 0;
                }
                .progress-percent {
                    position: absolute;
                    bottom: 12px;
                    right: 10px;
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
                height: 240px;
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
                    height: calc(100% - 30px);
                }
            }
        }
        .line-wrap {
            display: flex;
            justify-content: space-between;
            flex-wrap: nowrap;
            .line-item {
                height: 300px;
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
