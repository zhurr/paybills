
<template>
    <div style="width:100%;height:100%">
        <section class="title-link-wrap">
            <YwTitleTab @changeTitle="changeTitle"
                        :tabActive="activeFilterTitle"
                        :tabDatas="filterTitle"></YwTitleTab>
        </section>
        <section class="chart-wrap static-chart">
            <div v-for="(item,index) in pieDatas"
                 class="chart-item"
                 style="width:49%;"
                 :key="index">
                <div class="img-wrap">
                    <p class="num text-ellipse"
                       :title="item.num">{{item.num}}</p>
                    <p class="name text-ellipse"
                       :title="item.name">{{item.name}}</p>
                </div>
            </div>
        </section>
        <section class="chart-title clearfix">
            <span>{{barDatas[activeBarIndex].details.title}}</span>
            <el-radio-group v-model="activeFilter"
                            @change="changeTab"
                            class="yw-radio-button fr">
                <el-radio-button :label="item.label"
                                 v-for="(item,index) in filter"
                                 :key="index">{{item.name}}</el-radio-button>
            </el-radio-group>
        </section>
        <section class="chart-wrap"
                 style="width:100%;height:50%;">
            <YwChartBar :barDatas="barDatas[activeBarIndex]"
                        style="width: 100%;height:100%;padding:0 20px 20px 20px;"
                        v-if="barDatas[activeBarIndex].show && !showEmptyDatas.show"></YwChartBar>
            <YwChartEmpty v-else
                          :showEmptyDatas="showEmptyDatas"></YwChartEmpty>
        </section>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    export default {
        props: ['moduleData'],
        components: {
            YwTitleTab: () => import('@/components/yw-title-tab.vue'),
            YwChartEmpty: () => import('@/components/yw-chart-empty.vue'),
            YwChartBar: () => import('@/components/yw-chart-bar.vue'),
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
                activeBarIndex: 0,//序号（内部租户0、外部租户1）
                //标题filter
                filterTitle: [{ name: '内部租户', label: '内部租户' }],
                activeFilterTitle: '内部租户',
                filter: [{ name: '内部租户数量', label: '内部租户数量' }, { name: '应用系统数量', label: '应用系统数量' }],
                activeFilter: '内部租户数量',

                pieDatas: [
                    {
                        name: '租户总数(个)',
                        num: 0
                    },
                    {
                        name: '业务系统总数(个)',
                        num: 0
                    }
                ],
                barDatas: [
                    { show: false, id: 'bar-1', chartOption: 'bar-option', chartDatas: [], details: { title: '各资源池内部租户数量', valueType: { name: '均峰值利用率', label: 'max' }, seriesName: [{ yLabel: 'resourcePool', xLabel: 'depCount', yLabelName: '数量', xLabelName: '个' }] } },
                    { show: false, id: 'bar-2', chartOption: 'bar-option', chartDatas: [], details: { title: '各资源池外部租户数量', valueType: { name: '均峰值利用率', label: 'max' }, seriesName: [{ yLabel: 'resourcePool', xLabel: 'depCount', yLabelName: '数量', xLabelName: '个' }] } }
                ],
                //空数据
                showEmptyDatas: { show: false, content: '数据正在生成中，可参考上月数据' },
            }
        },

        methods: {
            //获得圆环数据
            getPieDatas() {
                let params = {
                    "depType": this.moduleData.type,
                    "monthlyTime": this.monthlyTime,
                    excludeDep: this.$route.query.excludeDep
                };

                this.$axios.post('/v1/cmdb/index/overview/tenantAndBz/dept', params).then((res) => {
                    if (!res.data.flag) {
                        return false;
                    }

                    this.pieDatas[0].num = res.data.data.depCount || 0;
                    this.pieDatas[1].num = res.data.data.bzCount || 0;
                });
            },
            //获得柱状图数据
            getBarDatas() {
                let params = {
                    "depType": this.moduleData.type,
                    "monthlyTime": this.monthlyTime,
                    excludeDep: this.$route.query.excludeDep
                };

                this.$axios.post('/v1/cmdb/index/overview/tenantAndBz/rp', params).then((res) => {
                    this.showEmptyDatas.show = false;
                    if (!res.data.flag) {
                        this.showEmptyDatas.show = true;
                        this.showEmptyDatas.content = res.data.errorMsg;
                        return false;
                    }
                    this.barDatas[this.activeBarIndex].chartDatas = res.data.data;

                    this.barDatas[0].details.title = '各资源池内部租户数量'
                    this.barDatas[1].details.title = '各资源池外部租户数量'
                    if (this.activeFilter === '应用系统数量') {
                        this.barDatas[this.activeBarIndex].details.title = '各资源池应用系统数量'
                        this.barDatas[this.activeBarIndex].details.seriesName[0].xLabel = 'bzCount'
                        this.barDatas[this.activeBarIndex].details.seriesName[0].yLabel = 'resourcePool'
                    } else {
                        this.barDatas[this.activeBarIndex].details.seriesName[0].xLabel = 'depCount'
                        this.barDatas[this.activeBarIndex].details.seriesName[0].yLabel = 'resourcePool'
                    }

                    this.barDatas[this.activeBarIndex].show = false
                    this.$nextTick(() => {
                        this.barDatas[this.activeBarIndex].show = true
                    })
                });
            },
            //获得数据
            getDatas() {
                if (this.moduleData.type === '内部租户') {
                    this.activeBarIndex = 0;
                    this.filter = [{ name: '内部租户数量', label: '内部租户数量' }, { name: '应用系统数量', label: '应用系统数量' }]
                    this.activeFilter = this.filter[0].label
                } else {
                    this.activeBarIndex = 1;
                    this.filter = [{ name: '外部租户数量', label: '外部租户数量' }, { name: '应用系统数量', label: '应用系统数量' }]
                    this.activeFilter = this.filter[0].label
                }
                this.filterTitle[0].name = this.moduleData.type
                this.filterTitle[0].label = this.moduleData.type
                this.activeFilterTitle = this.filterTitle[0].label

                this.getPieDatas();
                this.getBarDatas();
            },
            changeTab(val) {
                this.getBarDatas();
            },
            //标题tab
            changeTitle(val) {
                this.activeFilterTitle = val;
            },
        },
        mounted() {
            this.getDatas();
        }
    }
</script>

<style lang="scss" scoped>
    .chart-wrap {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        &.static-chart {
            margin-bottom: 40px;
            .img-wrap {
                position: relative;
                width: 213px;
                height: 191px;
                margin: auto;
                background: url(../../assets/img/img_circle_01.png) no-repeat;
                background-size: contain;
                text-align: center;
                .name {
                    padding-top: 50px;
                    font-size: 14px;
                }
                .num {
                    padding: 100px 50px 0 50px;
                    font-size: 18px;
                }
            }
        }
    }
</style>
