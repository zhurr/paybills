
<template>
    <div class="component-wrap">
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
        <div class="chart-wrap">
            <section class="chart-item"
                     v-for="(lineItem,lineIndex) in lineDatas"
                     :key="lineIndex"
                     style="width:100%;height:100%;">
                <YwChartLine :lineDatas="lineItem"
                             v-if="lineItem.show"></YwChartLine>
            </section>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import ShowEmptyDatas from '@/utils/showEmptyDatas.js'
    import { fixedNumber } from '@/utils/filter.js'

    export default {
        props: ['moduleData'],
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
                filter: [{ name: '利用率均峰值趋势', label: 'max' }, { name: '利用率均值趋势', label: 'avg' }],
                activeFilter: 'max',
                filter2: [{ name: '裸金属', label: '物理机' }, { name: '云主机', label: '虚拟机' }],
                activeFilter2: '物理机',
                lineDatas: [
                    { show: false, id: 'line-1', chartOption: 'line-option', chartDatas: [], details: { title: '裸金属均峰值利用率月度趋势', valueType: { name: '均峰值利用率', label: 'max' }, seriesName: [{ name: 'CPU', yLabel: 'cpu', xLabel: 'name' }, { name: '内存', yLabel: 'memory', xLabel: 'name' }] } },

                ],
            }
        },

        methods: {
            //获得line数据(利用率)
            getLineDatas() {

                let params = {
                    "idcType": '',
                    "month": '2020-05',
                    "deviceType": 'X86服务器',
                    countType: 'MAX'
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
            changeTab() {
                this.getLineDatas()
            },
            //获得数据
            init() {
                this.getLineDatas()
            },
        },
        mounted() {
            this.init();
        }
    }
</script>

<style lang="scss" scoped>
    .chart-wrap {
        padding: 0 30px;
        height: calc(100% - 100px);
    }
</style>
