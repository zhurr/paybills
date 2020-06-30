
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
                         v-for="(item,index) in pieDatas"
                         :key="index">
                    <!-- 图表 -->
                    <div :id="item.id"
                         class="chart-box">正在加载</div>
                    <!-- 图表 -->
                    <p class="chart-percent">{{item.chartDatas[0].value}}<span class="chart-percent-cell">%</span></p>
                    <div class="content">
                        <p class="content-name">{{item.chartDatas[0].name}} <span class="num">{{item.chartDatas[0].value}}%</span></p>
                        <p class="chart-change-wrap">
                            同比上月份<span class="chart-change-percent">
                                <span class="down"
                                      v-if="item.chartDatas[0].change<0"><i class="arrow">↓</i>{{-item.chartDatas[0].change}}%</span>
                                <span class="up"
                                      v-else><i class="arrow">↑</i>{{item.chartDatas[0].change}}%</span>
                            </span>
                        </p>
                        <p class="chart-name">{{item.chartDatas.name}}</p>
                    </div>

                    <div class="chart-detail">
                        <p class="detail-item">
                            <YwTenant :tenantDatas='{name:"内部租户",num:item.chartDatas[0].tenantDatas.userInner,change:item.chartDatas[0].tenantDatas.userInnerChange}'
                                      :options="{type:'border'}"></YwTenant>
                        </p>
                        <p class="detail-item">
                            <YwTenant :tenantDatas='{name:"外部租户",num:item.chartDatas[0].tenantDatas.userOuter,change:item.chartDatas[0].tenantDatas.userOuterChange}'
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
    import ChartOption from '@/utils/chartOption.js'
    import DrawChart from '@/utils/drawCharts.js'
    import updateComponent from '@/utils/updateComponent.js'
    import { fixedNumber, divisionNumber, subNumber } from '@/utils/filter.js'

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
                filterTitle: [{ name: '存储资源利用率', label: '存储资源利用率' }],
                activeFilterTitle: '存储资源利用率',
                //下拉框filter
                filter: [],
                activeFilter: '',
                activeFilterObj: {},
                //表格filter
                filterTable: [{ name: '', label: '' }],
                activeFilterTable: '',
                titleDatas: {
                    name: '租户存储资源利用率排行'
                },
                pieDatas: [{ id: 'page4-right-1', chartOption: 'pie-option', chartDatas: [{ name: '利用率', value: 0, change: 0, changeName: '同比上月份', tenantDatas: { userInner: 0, userInnerChange: 0, userOuter: 0, userOuterChange: 0 } }, { name: '', value: 100 - 0 }] },

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
            getPieDatas() {
                // this.pieDatas[0].chartDatas = [
                //   {
                //     name: '占比',
                //     value: 0
                //   },
                //   {
                //     name: '',
                //     value: 100 - 0
                //   }
                // ];
                this.pieDatas[0].chartDatas[0].name = `${this.activeFilterObj.name}利用率`;

                let params = {
                    "monthlyTime": this.monthlyTime,
                    "deviceType": this.activeFilter,
                    excludeDep: this.$route.query.excludeDep
                };

                this.$axios.post('/v1/cmdb/index/overview/storeUlt/devt', params).then((res) => {
                    this.showEmptyDatas.show = false;
                    if (!res.data.flag) {
                        this.showEmptyDatas.show = true;
                        this.showEmptyDatas.content = res.data.errorMsg;
                        return false;
                    }

                    if (res.data.data.crtMonth) {
                        let value = res.data.data.crtMonth.total.alt || 0.00;
                        this.pieDatas[0].chartDatas[0].value = fixedNumber(value, 2);
                        this.pieDatas[0].chartDatas[1].value = subNumber(100, value, 2);
                        this.pieDatas[0].chartDatas[0].change = subNumber(res.data.data.crtMonth.total.alt, res.data.data.preMonth.total.alt, 2);
                        this.pieDatas[0].chartDatas[0].tenantDatas.userInner = fixedNumber(res.data.data.crtMonth.inside.alt, 2);
                        this.pieDatas[0].chartDatas[0].tenantDatas.userInnerChange = subNumber(res.data.data.crtMonth.inside.alt, res.data.data.preMonth.inside.alt, 2);
                        this.pieDatas[0].chartDatas[0].tenantDatas.userOuter = fixedNumber(res.data.data.crtMonth.outside.alt, 2);
                        this.pieDatas[0].chartDatas[0].tenantDatas.userOuterChange = subNumber(res.data.data.crtMonth.outside.alt, res.data.data.preMonth.outside.alt, 2);
                    }

                    this.drawCharts(this.pieDatas[0]);
                });
            },
            //绘制图表
            drawCharts(subItem) {
                this.$nextTick(() => {

                    let myChart = echarts.init(document.getElementById(subItem.id));
                    myChart.clear();

                    // 数据格式处理
                    this.drawPie(myChart, subItem);

                })

            },

            drawPie(myChart, subItem) {
                // 数据格式处理(扇叶放大效果【2个series重叠】)
                let option = JSON.parse(JSON.stringify(ChartOption[subItem.chartOption]))
                let chartDatas = JSON.parse(JSON.stringify(subItem.chartDatas))

                option.series[0] = JSON.parse(JSON.stringify(option.series[0]));

                option.title.show = true
                option.title.text = ``
                // option.title.text = `${chartDatas[0].value}%`
                option.title.subtext = ''
                option.title.x = '50%'
                option.title.y = '45%'
                option.legend.show = false;
                option.tooltip.show = false;
                option.series[0].name = '';
                option.series[0].label.show = false;
                option.series[0].itemStyle.color = function (item) {
                    let colors = ['#FFCC3F', '#17154F'];
                    return colors[item.dataIndex];
                }
                option.series[0].data = chartDatas;

                myChart.setOption(option)

                // resize自适应
                this.setResizeFun(myChart)
            },
            //获得表格数据
            getTableDatas() {
                //更新表格
                this.updateComponent();
                this.tableTitles = [
                    { name: 'department', title: `${this.activeFilterTable}名称`, style: {} },
                    { name: 'alt', title: `${this.activeFilterObj.name}利用率`, style: { sortable: true, align: 'right', width: 200, isHtml: true } },
                ];

                let params = {
                    monthlyTime: this.monthlyTime,
                    deviceType: this.activeFilter,
                    depType: this.activeFilterTable,
                    excludeDep: this.$route.query.excludeDep
                };

                this.$axios.post('/v1/cmdb/index/overview/storeUlt/tenantAndDevt', params).then((res) => {
                    if (!res.data.flag) {
                        this.tableDatas = [];
                        return false;
                    }

                    this.tableDatas = res.data.data.map((item, index) => {
                        let alt = fixedNumber(item.alt, 2);
                        let altDuce = fixedNumber(item.alt - item.preAlt, 2);
                        let altChange = eval(altDuce) < 0 ? `<sup class="change down"><i class="arrow">↓</i>${fixedNumber(-altDuce, 2)}%</sup>` : `<sup class="change"><i class="arrow">↑</i>${fixedNumber(altDuce, 2)}%</sup>`;
                        return {
                            department: item.department,
                            alt: `${alt}`,
                            altHtml: `${alt}%${altChange}`,
                        }
                    });
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
            //标题tab
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
            width: 100%;
            height: 100%;
        }
        .chart-item {
            position: relative;
            display: inline-block;
            width: 100%;
            height: 100%;

            .chart-box {
                display: inline-block;
                vertical-align: middle;
                width: 30%;
                height: 220px;
                margin: 0 0 0 80px;
            }
            .chart-detail {
                display: inline-block;
                vertical-align: middle;
                margin-left: 40px;
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
                    margin: 0 0 40px 0;
                    &:last-of-type {
                        margin: 0;
                    }
                }
            }
            &:last-of-type {
                .chart-detail:after {
                    display: none;
                }
            }
            .content {
                display: inline-block;
                padding: 0 30px 0 0;
                border-right: 1px dashed rgba(255, 255, 255, 0.3);
                .content-name {
                    margin-bottom: 10px;
                    font-size: 14px;
                    color: #fff;
                    .num {
                        font-size: 18px;
                    }
                }
            }
            .chart-percent {
                position: absolute;
                left: calc(15% + 60px);
                top: 92px;
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
