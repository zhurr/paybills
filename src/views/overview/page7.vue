
<template>
    <div class="container clearfix">
        <section class="log-wrap">
            <logo></logo>
            <span class="title small">
                考核情况（{{monthlyTime.split('-')[0]}}年{{monthlyTime.split('-')[1]}}月）
            </span>
        </section>
        <department></department>
        <section class="img-wrap">
            <img src="../../assets/img/pic_01.png"
                 class="img"
                 alt="">
        </section>
        <section class="main-wrap main-chart">
            <div class="main">
                <div class="left"
                     style="width:60%;">
                    <!-- 标题 -->
                    <section class="title-link-wrap clearfix">
                        <YwTitleTab @changeTitle="changeTitle"
                                    :tabActive="activeFilterTitle"
                                    :tabDatas="filterTitle"></YwTitleTab>
                    </section>
                    <!-- 标题 -->

                    <!-- 表格 -->
                    <section class="table-wrap">
                        <YwTable :tableTitles="tableTitles"
                                 v-if="resetComponent"
                                 :option="{'highlight-current-row':true,'enClick':true,'selfClass':'no-border title-line-2'}"
                                 @sortTable="sortTable"
                                 @clickTableRow="clickTableRow"
                                 :tableDatas="tableDatas"></YwTable>
                    </section>
                    <!-- 表格 -->
                </div>
                <div class="right"
                     v-if="activeFilterTitle === 'ALL' && detailsDatas.show"
                     style="width:38.4%">
                    <Page7_2 :datas="detailsDatas"></Page7_2>
                </div>
            </div>
        </section>
        <!-- <section class="footer-wrap">Copyright©1999-2019 中国移动IT云 版权所有</section> -->
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import updateComponent from '@/utils/updateComponent.js'
    import { fixedNumber, divisionNumber } from '@/utils/filter.js'

    export default {
        mixins: [updateComponent],
        components: {
            department: () => import('@/components/department.vue'),
            logo: () => import('@/components/logo.vue'),
            YwTable: () => import('@/components/yw-table.vue'),
            YwTitleTab: () => import('@/components/yw-title-tab.vue'),
            Page7_2: () => import('@/views/overview/page7-2.vue'),
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
                filterTitle: [{ name: '本月考核情况', label: 'PART' }, { name: '累计考核情况', label: 'ALL' }],
                activeFilterTitle: 'PART',
                tableTitles: [],
                tableDatas: [],
                //详细数据
                detailsDatas: {
                    show: false,
                    id: '',//预留：每个数据的唯一标识
                    data: {} //预留：数据
                }
            }
        },

        methods: {
            //表格点击事件
            clickTableRow(row, column, event) {
                this.detailsDatas.show = false;
                this.$nextTick(() => {
                    this.detailsDatas.data = row
                    this.detailsDatas.show = true
                })

            },
            //表格排序
            sortTable(datas) {
                this.tableDatas = datas;
            },
            //表格
            getTableDatas() {
                //更新表格
                this.updateComponent();

                this.tableDatas = []
                this.tableTitles = [
                    { name: 'department', title: `内部租户名称`, style: {} },
                    { name: 'cpuMax', title: `本月CPU均峰值利用率`, style: { align: 'right', width: 120 } },
                    { name: 'deploy', title: `部署上线延迟扣分`, style: { align: 'right', width: 150, isHtml: true } },
                    { name: 'inform', title: `上线通知延迟扣分`, style: { align: 'right', width: 150, isHtml: true } },
                    { name: 'total', title: `本月总扣分`, style: { sortable: true, align: 'right', width: 120, isHtml: true } },
                ];
                if (this.activeFilterTitle === 'ALL') {
                    this.tableTitles = [
                        { name: 'department', title: `内部租户名称`, style: {} },
                        { name: 'cpuMax', title: `CPU均峰值利用率当前累计`, style: { align: 'right', width: 120 } },
                        { name: 'deploy', title: `部署上线延迟扣分`, style: { align: 'right', width: 140, isHtml: true } },
                        { name: 'inform', title: `上线通知延迟扣分`, style: { align: 'right', width: 140, isHtml: true } },
                        { name: 'finalScore', title: `利用率年终扣分`, style: { align: 'right', width: 120, isHtml: true } },
                        { name: 'total', title: `总扣分`, style: { sortable: true, align: 'right', width: 100, isHtml: true } },
                    ];
                }

                let params = {
                    monthlyTime: this.monthlyTime,
                    calculateType: this.activeFilterTitle,
                    excludeDep: this.$route.query.excludeDep
                };

                this.$axios.post('/v1/cmdb/index/overview/score/list', params).then((res) => {
                    if (!res.data.flag) {
                        this.tableDatas = [];
                        return false;
                    }

                    this.tableDatas = res.data.data.map((item, index) => {
                        let total = eval(item.total) ? `-${item.total}` : '未扣分';
                        return {
                            department: item.department,
                            cpuMax: `${fixedNumber(item.cpuMax, 2)}%`,
                            deploy: item.deploy,
                            deployHtml: eval(item.deploy) ? `-${item.deploy}` : `<span style="color:#8681C1">--</span>`,
                            inform: item.inform,
                            informHtml: eval(item.inform) ? `-${item.inform}` : `<span style="color:#8681C1">--</span>`,
                            finalScore: item.finalScore,
                            finalScoreHtml: eval(item.finalScore) ? `-${item.finalScore}` : `<span style="color:#8681C1">--</span>`,
                            total: item.total,
                            totalHtml: `<span style="color: #01E5FF;">${total}</span>`,
                        }
                    });
                });
            },

            getDatas() {
                this.getTableDatas();
            },
            //标题tab
            changeTitle(val) {
                this.activeFilterTitle = val;
                this.getTableDatas();
                this.detailsDatas.show = false;
            },

        },
        mounted() {
            this.getDatas();
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        .img-wrap {
            position: absolute;
            top: 20%;
            right: 10%;
            z-index: 2;
            .img {
                width: 605px;
                // height:412px;
                height: auto;
            }
        }
        .main-wrap {
            .main {
                z-index: 3;
                .left {
                    background: rgba(24, 19, 109, 0.95);
                    .table-wrap {
                        margin-top: 30px;
                        height: calc(100% - 100px);
                        padding: 0 20px;
                    }
                }
                .right {
                    background: #0467f6;
                    &:before {
                        position: absolute;
                        top: 50%;
                        left: -15px;
                        content: "";
                        width: 0;
                        height: 0;
                        border-top: 15px solid transparent;
                        border-right: 15px solid #0467f6;
                        border-bottom: 15px solid transparent;
                    }
                }
            }
        }
    }
</style>
