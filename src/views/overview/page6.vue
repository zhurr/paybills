
<template>
    <div class="container clearfix">
        <section class="log-wrap">
            <logo></logo>
            <span class="title small">
                资源通报（{{monthlyTime.split('-')[0]}}年{{monthlyTime.split('-')[1]}}月）
            </span>
        </section>
        <department></department>
        <section class="main-wrap main-chart">
            <div class="main-header clearfix">
                <div class="header-list fr">
                    <p class="header-item">{{total.name}}<span class="header-num">{{total.num}}</span><span>{{total.cell}}</span></p>
                    <p class="header-item tenant-wrap">
                        <YwTenant :tenantDatas="total.tenantDatas"></YwTenant>
                    </p>
                </div>
            </div>
            <div class="main">
                <div class="left"
                     style="width:100%;">
                    <div class="chart-title clearfix">
                        <span>租户本月总体通报业务系统占比</span>
                        <!-- <p class="total-wrap fr">应用系统总数<span class="num">{{bizSysTotal}}</span> <span class="cell">个</span></p> -->
                    </div>
                    <!-- 内容 -->
                    <div style="width:100%;height:calc(100% - 60px)">
                        <!-- 图表 -->
                        <div class="chart-wrap">
                            <div class="static-chart"
                                 v-if="!showEmptyDatas.show">
                                <section class="chart-item"
                                         :class="{active:item.active}"
                                         style="width:24%;height:100%;"
                                         @click="clickChart(item,index)"
                                         v-for="(item,index) in chartDatas"
                                         :key="index">
                                    <p class="chart-flag">{{item.typeObj.name}}</p>
                                    <p class="chart-desc">{{item.typeObj.desc}}</p>
                                    <div class="chart-box-wrap">
                                        <div :id="item.id"
                                             class="chart-box">正在加载</div>
                                        <div class="chart-inner">
                                            <p class="chart-num-wrap text-ellipse"
                                               :title="item.typeObj.percent"><span class="chart-num-name">占比</span>{{item.typeObj.percent}}%</p>
                                            <p class="chart-total text-ellipse"
                                               :title="item.typeObj.count">共<span class="chart-total-num">{{item.typeObj.count}}</span>个</p>
                                        </div>
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
                                 v-if="resetComponent">
                            <div class="table-item"
                                 v-for="(item,index) in tableList"
                                 :key="index"
                                 style="width:48%">
                                <YwTable :tableTitles="item.tableTitles"
                                         :option="{}"
                                         @sortTable="sortTable"
                                         :tableDatas="item.tableDatas"></YwTable>
                            </div>
                            <div class="table-cover"
                                 @click="clickTableCover()"
                                 v-if="showTableCover"></div>
                        </section>
                        <!-- 表格 -->
                    </div>
                    <!-- 内容 -->
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import ChartOption from '@/utils/chartOption.js'
    import DrawChart from '@/utils/drawCharts.js'
    import QueryObject from '@/utils/queryObject.js'
    import updateComponent from '@/utils/updateComponent.js'
    import { divisionNumber, fixedNumber, subNumber } from '@/utils/filter.js'

    export default {
        mixins: [DrawChart, QueryObject, updateComponent],
        components: {
            department: () => import('@/components/department.vue'),
            logo: () => import('@/components/logo.vue'),
            PageTitle: () => import('@/components/page-title.vue'),
            YwTable: () => import('@/components/yw-table.vue'),
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
                //总数
                total: {
                    name: '业务系统总数',
                    num: 0,
                    cell: '个',
                    tenantDatas: {
                        innerNum: 0,
                        userInner: `<span style="font-size:16px;color:#fff">0</span>`,
                        outerNum: 0,
                        userOuter: `<span style="font-size:16px;color:#fff">0</span>`
                    }
                },
                //应用系统总数
                bizSysTotal: 0,
                //图表模块选中
                activeModule: {
                },
                showTableCover: true,
                tableList: [{ tableTitles: [], tableDatas: [] }, { tableTitles: [], tableDatas: [] }],
                chartDatas: [{ id: 'page4-1-1', chartOption: 'pie-option', chartDatas: [], typeObj: { percent: 0, count: 0, name: '裸金属CPU', type: { code: '物理机', name: '裸金属' }, hardwareType: 'CPU', desc: '均峰值利用率低于30%的业务系统', tenantDatas: { userInner: '0个,占比0%', userOuter: '0个,占比0%' } }, active: true },
                { id: 'page4-1-2', chartOption: 'pie-option', chartDatas: [], typeObj: { percent: 0, count: 0, name: '云主机CPU', type: { code: '虚拟机', name: '云主机' }, hardwareType: 'CPU', desc: '均峰值利用率低于30%的业务系统', tenantDatas: { userInner: '0个,占比0%', userOuter: '0个,占比0%' } }, active: false },
                { id: 'page4-1-3', chartOption: 'pie-option', chartDatas: [], typeObj: { percent: 0, count: 0, name: '云主机内存', type: { code: '虚拟机', name: '云主机' }, hardwareType: '内存', desc: '均峰值利用率低于30%的业务系统', tenantDatas: { userInner: '0个,占比0%', userOuter: '0个,占比0%' } }, active: false },
                { id: 'page4-1-4', chartOption: 'pie-option', chartDatas: [], typeObj: { percent: 0, count: 0, name: '云存储', type: { code: '云存储', name: '云存储' }, hardwareType: null, desc: '均峰值利用率低于30%的业务系统', tenantDatas: { userInner: '0个,占比0%', userOuter: '0个,占比0%' } }, active: false }],
                //空数据
                showEmptyDatas: { show: false, content: '数据正在生成中，可参考上月数据' },
            }
        },

        methods: {
            //表格排序
            sortTable(datas) {
                this.tableDatas = datas;
            },
            //表格遮罩是否展示
            clickTableCover() {
                this.showTableCover = false;
            },
            //图表点击
            clickChart(item, index) {
                this.activeModule = item;
                this.showTableCover = true;
                this.getTableDatas();
                this.chartDatas.forEach((item) => {
                    item.active = false;
                });
                item.active = true;

            },
            //获得系统总数
            getTotalDatas() {
                let params = {
                    "monthlyTime": this.monthlyTime,
                    excludeDep: this.$route.query.excludeDep
                };

                return this.$axios.post('/v1/cmdb/index/overview/bzCount/total', params).then((res) => {
                    if (!res.data.flag) {
                        return false;
                    }

                    this.total.num = res.data.data.total;
                    this.total.tenantDatas.innerNum = res.data.data.inside;
                    this.total.tenantDatas.outerNum = res.data.data.outside;
                    this.total.tenantDatas.userInner = `<span style="font-size:16px;color:#fff">${res.data.data.inside}</span>`;
                    this.total.tenantDatas.userOuter = `<span style="font-size:16px;color:#fff">${res.data.data.outside}</span>`;
                    return res.data.data;
                });
            },
            getChartDatas(item = {}) {
                item.chartDatas = [
                    {
                        name: '占比',
                        value: '0.00'
                    },
                    {
                        name: '',
                        value: '100.00'
                    }
                ];

                let params = {
                    monthlyTime: this.monthlyTime,
                    deviceType: item.typeObj.type.code,
                    hardwareType: item.typeObj.hardwareType,
                    excludeDep: this.$route.query.excludeDep
                };

                this.$axios.post('/v1/cmdb/index/overview/bzCount/detail', params).then((res) => {
                    this.showEmptyDatas.show = false;
                    if (!res.data.flag) {
                        this.showEmptyDatas.show = true;
                        this.showEmptyDatas.content = res.data.errorMsg;
                        return false;
                    }

                    item.chartDatas[0].value = divisionNumber((res.data.data.total || 0) * 100, this.total.num, 2);
                    item.chartDatas[1].value = subNumber(100, item.chartDatas[0].value, 2);

                    item.typeObj.percent = item.chartDatas[0].value;
                    item.typeObj.count = res.data.data.total;
                    item.typeObj.tenantDatas.userInner = `${res.data.data.inside || 0}个,占比${divisionNumber((res.data.data.inside || 0) * 100, res.data.data.total, 2)}%`;
                    item.typeObj.tenantDatas.userOuter = `${res.data.data.outside || 0}个,占比${divisionNumber((res.data.data.outside || 0) * 100, res.data.data.total, 2)}%`;

                    this.drawCharts(item);
                });
            },

            //所有表格
            getTableDatas() {
                //更新表格
                this.updateComponent();
                ['内部租户', '外部租户'].forEach((item, index) => {
                    this.getTableByItem(item, index);
                })
            },
            //表格
            getTableByItem(item, index) {
                this.tableList[index].tableTitles = [
                    { name: 'department', title: `${item}名称`, style: {} },
                    { name: 'part', title: `通报业务系统个数`, style: { sortable: true, align: 'right', width: 200 } },
                    { name: 'percent', title: `通报业务系统占比`, style: { sortable: true, align: 'right', width: 200, isHtml: true } },
                ];

                let params = {
                    monthlyTime: this.monthlyTime,
                    deviceType: this.activeModule.typeObj.type.code,
                    hardwareType: this.activeModule.typeObj.hardwareType,
                    depType: item,
                    excludeDep: this.$route.query.excludeDep
                };

                this.$axios.post('/v1/cmdb/index/overview/bzList/detail', params).then((res) => {
                    if (!res.data.flag) {
                        this.tableList[index].tableDatas = [];
                        return false;
                    }

                    this.tableList[index].tableDatas = res.data.data.map((item, index) => {
                        return {
                            department: item.department,
                            part: item.part,
                            percent: item.percent,
                            percentHtml: `${fixedNumber(item.percent, 2)}%，<span style="color:rgba(255,255,255,.6)">总数${item.total}</span>`,
                        }
                    });
                });
            },

            //绘制图表
            drawCharts(subItem) {
                this.$nextTick(() => {

                    let myChart = echarts.init(document.getElementById(subItem.id));
                    myChart.clear();

                    // 数据格式处理
                    switch (subItem.chartOption) {
                        case 'pie-option':
                            this.drawPie(myChart, subItem);
                            break;
                    }

                })

            },
            drawPie(myChart, subItem) {
                // 数据格式处理(扇叶放大效果【2个series重叠】)
                let option = JSON.parse(JSON.stringify(ChartOption[subItem.chartOption]))
                let chartDatas = JSON.parse(JSON.stringify(subItem.chartDatas))
                let colorSource = ChartOption['color-option']['linearColor']
                let colors = [colorSource.pieYellow, colorSource.pieBlueDark];

                option.series[0] = JSON.parse(JSON.stringify(option.series[0]));
                option.series[1] = JSON.parse(JSON.stringify(option.series[0]));

                option.title.show = true
                option.title.text = ``
                option.title.subtext = ''
                option.title.x = '50%'
                option.title.y = '45%'
                option.legend.show = false;
                option.tooltip.show = false;
                option.series[0].name = '';
                option.series[0].label.show = false;
                option.series[0].itemStyle.color = function (item) {
                    let colors = ['transparent', '#391FCE'];
                    return colors[item.dataIndex];
                }
                option.series[0].data = chartDatas;

                option.series[1].name = '';
                option.series[1].label.show = false;
                option.series[1].radius = ['55%', '85%'];
                option.series[1].itemStyle.color = function (item) {
                    let colors = ['#FFCC3F', 'transparent'];
                    return colors[item.dataIndex]
                }
                option.series[1].data = chartDatas;


                myChart.setOption(option)

                // resize自适应
                this.setResizeFun(myChart)
            },

            async getDatas() {
                this.bizSysTotal = await this.getTotalDatas();
                this.chartDatas.forEach((item) => {
                    this.getChartDatas(item);
                })
                this.activeModule = this.chartDatas[0];
                this.getTableDatas();
            }
        },
        mounted() {
            this.getDatas();
        }
    }
</script>

<style lang="scss" scoped>
    .main-wrap {
        &.main-chart {
            height: calc(80% - 40px);
        }
    }
    .main-header {
        .header-list {
            margin-bottom: 10px;
        }
        .header-item {
            display: inline-block;
            &:first-of-type {
                &:after {
                    content: "";
                    display: inline-block;
                    vertical-align: bottom;
                    width: 1px;
                    height: 25px;
                    background: rgba(255, 255, 255, 0.4);
                    margin: 0 10px 0 15px;
                }
            }
            &.tenant-wrap {
                min-width: 150px;
            }
            font-size: 16px;
            .header-num {
                font-size: 28px;
                margin: 0 5px 0 5px;
            }
        }
    }
    .left {
        background: rgba(24, 19, 109, 0.95);
        .chart-title {
            .total-wrap {
                font-size: 16px;
                color: #ffffff;
                .num {
                    font-size: 28px;
                    color: #ffffff;
                    margin-left: 20px;
                    margin-right: 2px;
                }
                .cell {
                    font-size: 16px;
                    color: #ffffff;
                }
            }
        }
        .chart-wrap {
            width: 100%;
            height: 360px;
            padding: 20px 30px 0px 30px;
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
                .chart-box-wrap {
                    position: relative;
                    width: 100%;
                    height: calc(100% - 140px);
                    margin: 0 auto;
                }
                .chart-box {
                    width: 100%;
                    height: 100%;
                }
                .chart-inner {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                    text-align: center;
                    font-size: 16px;
                }
                .chart-num-wrap {
                    margin-bottom: 10px;
                    .chart-num-name {
                        font-size: 12px;
                        margin-right: 10px;
                    }
                }
                .chart-total {
                    max-width: 20%;
                    .chart-total-num {
                        color: #ffcc3f;
                    }
                }
                .chart-flag {
                    width: 130px;
                    height: 30px;
                    line-height: 30px;
                    border-radius: 15px;
                    background-image: linear-gradient(
                        270deg,
                        #441ce8 0%,
                        #1eb5fa 100%
                    );
                    font-size: 14px;
                    color: #fff;
                    text-align: center;
                    margin: 25px auto 15px auto;
                }
                .chart-desc {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.6);
                    text-align: center;
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
            position: relative;
            display: flex;
            justify-content: space-between;
            flex-wrap: nowrap;
            height: calc(100% - 340px);
            padding: 20px 30px;
            .table-item {
                height: 100%;
            }
        }
    }
    .btn-wrap {
        margin-top: 0;
        text-align: center;
    }
</style>
