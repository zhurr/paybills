<template>
    <!-- 业务系统趋势图 -->
    <el-dialog class="yw-dialog"
               v-if="dialogMsg.dialogVisible"
               :append-to-body="true"
               :modal="false"
               width="1200px"
               title="租户应用系统利用率趋势"
               :visible.sync="dialogMsg.dialogVisible">
        <span slot="title"
              class="yw-dialog-title">
            {{dialogMsg.data.bizSystem}}
        </span>
        <div class="dialog-mian"
             v-if="!emptyData">
            <section class="main-header clearfix">
                <el-radio-group v-model="activeFilter"
                                @change="changeTab"
                                class="yw-radio-button fr"
                                style="margin-right:30px">
                    <el-radio-button :label="item.label"
                                     v-for="(item,index) in filter"
                                     :key="index">{{item.name}}</el-radio-button>
                </el-radio-group>
            </section>
            <section class="main-body">
                <!-- 图表 -->
                <div class="chart-wrap"
                     v-if="activeFilter === 'chart'">
                    <!-- <div :id="datas.id"
                         style="width:100%;height:100%"
                         class="chart-box">正在加载</div> -->
                    <YwChartLine :lineDatas="lineDatas[0]"
                                 v-if="lineDatas[0].show"
                                 class="chart-box"
                                 style="width: 100%;height: 100%;"></YwChartLine>
                </div>
                <!-- 图表 -->

                <!-- 表格 -->
                <div class="table-wrap"
                     v-loading="loading"
                     element-loading-text="拼命加载中"
                     element-loading-spinner="el-icon-loading"
                     element-loading-background="rgba(0, 0, 0, 0.8)"
                     v-if="activeFilter === 'table'">
                    <YwTable :tableTitles="tableTitles"
                             :tableDatas="tableDatas"
                             :option="{'selfClass':'no-padding multi-table'}"
                             @sortTable="sortTable"></YwTable>
                    <YwPagination class="page-chart"
                                  @handleSizeChange="handleSizeChange"
                                  @handleCurrentChange="handleCurrentChange"
                                  :current-page="currentPage"
                                  :page-sizes="pageSizes"
                                  :page-size="pageSize"
                                  :total="total"></YwPagination>

                </div>
                <!-- 表格 -->
            </section>
        </div>
        <!-- 空判断 -->
        <div class="chart-empty-wrap"
             v-if="emptyData"
             style="width:100%;height:300px;">
            <p class="chart-empty">{{emptyData}}</p>
        </div>
        <!-- 空判断 -->
    </el-dialog>

</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import { fixedNumber, getDayByMonth } from '@/utils/filter.js'
    import QueryObject from '@/utils/queryObject.js'

    export default {
        mixins: [QueryObject],
        props: ['dialogMsg'],
        components: {
            YwTable: () => import('@/components/yw-table.vue'),
            YwPagination: () => import('@/components/yw-pagination.vue'),
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
                filter: [{ name: '趋势图', label: 'chart' }, { name: '查询业务下设备利用率数据', label: 'table' }],
                activeFilter: 'chart',
                emptyData: '',
                lineDatas: [
                    { show: false, id: 'line-1', chartOption: 'line-option', chartDatas: [], details: { title: '', valueType: { name: '均峰值利用率', label: 'max' }, seriesName: [{ name: 'CPU', yLabel: 'cpu', xLabel: 'name' }, { name: '内存', yLabel: 'memory', xLabel: 'name' }] } },

                ],
                tableTitles: [],
                tableDatas: [],
                //查询条件
                queryParams: {

                },
            }
        },
        methods: {
            //表格排序
            sortTable(datas) {
                this.tableDatas = datas;
            },
            //设置参数
            setParams(activePagination) {

                if (activePagination) {
                    this.queryParams['pageNo'] = this.currentPage
                    this.queryParams['pageSize'] = this.pageSize
                } else {

                    this.queryParams = {
                        monthlyTime: this.monthlyTime,
                        deviceType: this.dialogMsg.data.activeFilter2,
                        bizSystem: this.dialogMsg.data.bizSystem,
                        tableType: this.dialogMsg.data.activeFilter,
                        'pageNo': this.initPageChange(),
                        'pageSize': this.pageSize,
                    }
                }

            },

            //均峰值
            getMaxDatas() {
                let params = {
                    "department1": this.department1,
                    "department2": this.department2,
                    "monthlyTime": this.monthlyTime,
                    "deviceType": this.dialogMsg.data.activeFilter2,
                    "bizSystem": this.dialogMsg.data.bizSystem
                };

                this.$axios.post('/v1/cmdb/index/utilization/max/month', params).then((res) => {
                    this.lineDatas[0].chartDatas = res.data.map((item) => {
                        return {
                            name: item.statistDate,
                            cpu: item.cpuMax,
                            memory: item.storeMax,
                        }
                    });
                    this.lineDatas[0].details.valueType.name = '均峰值利用率'
                    this.lineDatas[0].show = false
                    this.$nextTick(() => {
                        this.lineDatas[0].show = true
                    })
                });
            },
            //均值
            getAvgDatas() {
                let params = {
                    "department1": this.department1,
                    "department2": this.department2,
                    "monthlyTime": this.monthlyTime,
                    "deviceType": this.dialogMsg.data.activeFilter2,
                    "bizSystem": this.dialogMsg.data.bizSystem
                };

                this.$axios.post('/v1/cmdb/index/utilization/avg/month', params).then((res) => {
                    this.lineDatas[0].chartDatas = res.data.map((item) => {
                        return {
                            name: item.statistDate,
                            cpu: item.cpuAvg,
                            memory: item.storeAvg,
                        }
                    });
                    this.lineDatas[0].details.valueType.name = '均值利用率'
                    this.lineDatas[0].show = false
                    this.$nextTick(() => {
                        this.lineDatas[0].show = true
                    })
                });

            },

            //图表数据
            getChartDatas() {
                this.emptyData = '';
                if (this.dialogMsg.data.msg !== "success") {
                    this.emptyData = this.dialogMsg.data.msg;
                    return false;
                }

                if (this.dialogMsg.data.activeFilter === 'MAX') {
                    this.getMaxDatas();
                } else {
                    this.getAvgDatas();
                }
            },

            //表格数据
            query(activePagination = false) {
                this.showLoading()
                this.setParams(activePagination)

                //静态列
                let staticTitles = [
                    { name: 'bizSystem', title: '业务系统', style: { align: 'center', width: 200 } },
                    { name: 'deviceName', title: `设备名称`, style: { align: 'center', width: 150, } },
                    { name: 'resourcePool', title: `资源池`, style: { align: 'center', width: 150, } },
                    { name: 'ip', title: `设备ip`, style: { align: 'center', width: 150, 'text-link': true } },
                    { name: 'serviceIp', title: `业务ip`, style: { align: 'center', width: 150, 'text-link': true } }
                ]

                //动态列
                let dayList = []
                let days = getDayByMonth(this.monthlyTime.split('-')[0], this.monthlyTime.split('-')[1])
                for (let i = 1; i <= days; i++) {
                    dayList.push(i + '号')
                }
                let subTitles = [
                    { name: 'cpu', title: `cpu`, style: { align: 'center', width: 100, 'text-link': true } },
                    { name: 'memory', title: `内存`, style: { align: 'center', width: 100, 'text-link': true } }
                ]
                let columnList = [];

                dayList.forEach((item) => {
                    columnList.push({
                        name: item,
                        title: item,
                        children: subTitles,
                        style: { align: 'center', 'text-link': true },
                    })
                })
                //表头
                this.tableTitles = staticTitles.concat(columnList)

                //数据
                let params = this.queryParams
                this.$axios.post('/v1/cmdb/index/bisSystem/list/device', params).then((res) => {
                    this.closeLoading()

                    this.total = res.data.total || 0
                    let that = this
                    this.tableDatas = res.data.data.map((item) => {
                        //动态数据字段
                        let dateObjList = {}
                        for (let itemKey in item) {
                            if (item[itemKey] && item[itemKey].dateDisplay) {
                                let dateObj = {}
                                let cpuValue = item[itemKey].cpu == '-' ? item[itemKey].cpu : fixedNumber(item[itemKey].cpu, 2)
                                let memoryValue = item[itemKey].memory == '-' ? item[itemKey].memory : fixedNumber(item[itemKey].memory, 2)
                                this.$set(dateObj, item[itemKey].dateDisplay, { cpu: cpuValue, memory: memoryValue })

                                dateObjList = Object.assign({}, dateObjList, dateObj)
                            }

                        }

                        //静态字段
                        let staticLlist = {
                            bizSystem: item.bizSystem,
                            deviceName: item.deviceName,
                            ip: item.ip,
                            resourcePool: item.idcType,
                            serviceIp: item.serviceIp ? item.serviceIp : '-',
                        }

                        return Object.assign({}, staticLlist, dateObjList)
                    })

                }).finally(() => {
                    this.closeLoading()
                });
            },
            changeTab(val) {
                if (this.activeFilter === 'table') {
                    this.query();
                } else {
                    this.getChartDatas();
                }
            },
        },
        mounted() {
            this.changeTab();
        }
    }

</script>
<style lang="scss" scoped>
    .dialog-mian {
        width: 100%;
        height: 600px;
        background: #19136e;
        padding: 30px 30px 40px 30px;
        .main-header {
            margin-bottom: 15px;
        }
        .main-body {
            width: 100%;
            height: calc(100% - 30px);
            .table-wrap {
                height: calc(100% - 30px);
            }
            .chart-wrap {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
