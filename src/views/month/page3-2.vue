
<template>
    <div>
        <div class="chart-title clearfix">
            <el-tabs class="yw-tabs overall"
                     v-model="activeFilter"
                     type="card"
                     @tab-click="changeTab">
                <el-tab-pane :label="item.name"
                             v-for="(item,index) in filter"
                             :key="index"
                             :name="item.label"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="clearfix">
            <el-radio-group v-model="activeFilter2"
                            @change="changeTab"
                            class="yw-radio-button fr"
                            style="margin-right:30px">
                <el-radio-button :label="item.label"
                                 v-for="(item,index) in filter2"
                                 :key="index">{{item.name}}</el-radio-button>
            </el-radio-group>
        </div>
        <!-- 空判断 -->
        <div class="chart-empty-wrap"
             v-if="showEmptyDatas.show"
             style="width: 100%;height: calc(100% - 60px);">
            <p class="chart-empty">{{showEmptyDatas.content}}</p>
        </div>
        <!-- 空判断 -->
        <div style="width: 100%;height: calc(100% - 60px);padding:0 20px;"
             v-if="!(showEmptyDatas.show)">
            <YwChartLine :lineDatas="lineDatas[0]"
                         v-if="lineDatas[0].show"
                         style="width: 100%;height: 100%;"></YwChartLine>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import ShowEmptyDatas from '@/utils/showEmptyDatas.js'
    import { fixedNumber } from '@/utils/filter.js'

    export default {
        mixins: [ShowEmptyDatas],
        components: {
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
                filter: [{ name: '月度利用率均峰值趋势', label: 'max' }, { name: '月度利用率均值趋势', label: 'avg' }],
                activeFilter: 'max',
                filter2: [{ name: '裸金属', label: '物理机' }, { name: '云主机', label: '虚拟机' }],
                activeFilter2: '物理机',
                lineDatas: [
                    { show: false, id: 'line-1', chartOption: 'line-option', chartDatas: [], details: { title: '', valueType: { name: '均峰值利用率', label: 'max' }, seriesName: [{ name: 'CPU', yLabel: 'cpu', xLabel: 'name' }, { name: '内存', yLabel: 'memory', xLabel: 'name' }] } },

                ],
            }
        },

        methods: {
            //判断采集情况
            isEmpty() {
                let params = {
                    "department1": this.department1,
                    "department2": this.department2,
                    "monthlyTime": this.monthlyTime,
                    "deviceType": this.activeFilter2,
                    "tableType": this.activeFilter,
                };

                this.$axios.post('/v1/cmdb/index/judge/status', params).then((res) => {
                    if (res.data && res.data.flag) {
                        this.changeEmptyDatas(false, res.data.msg);
                        this.getDatas();
                    } else {
                        this.changeEmptyDatas(true, res.data.msg);
                    }
                }).catch((error) => {
                    this.changeEmptyDatas(true, '数据服务器崩溃了,请联系管理员！');
                });
            },
            //均峰值
            getMaxDatas() {
                let params = {
                    "department1": this.department1,
                    "department2": this.department2,
                    "monthlyTime": this.monthlyTime,
                    "deviceType": this.activeFilter2
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
                    "deviceType": this.activeFilter2
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
            getDatas() {
                if (this.activeFilter === 'max') {
                    this.getMaxDatas();
                } else {
                    this.getAvgDatas();
                }

            },
            changeTab(val) {
                // this.getDatas();
                this.isEmpty();
            },
        },
        mounted() {
            this.isEmpty();
        }
    }
</script>

<style lang="scss" scoped>
</style>
