
<template>
    <div class="container clearfix">
        <section class="log-wrap">
            <logo></logo>
            <span class="title small">
                {{monthlyTime.split('-')[0]}}年各月考核情况
            </span>
        </section>
        <department></department>
        <section class="img-wrap">
            <img src="../../assets/img/pic_01.png"
                 class="img"
                 alt="">
        </section>
        <section class="main-wrap">
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
                         :option="{'selfClass':'no-border empty-more title-line-2'}"
                         @sortTable="sortTable"
                         :tableDatas="tableDatas"></YwTable>
            </section>
            <!-- 表格 -->
        </section>
        <section class="rule-wrap">
            <a class="rule-link"
               @click="getRules()">查看考核内容与规则 ></a>
        </section>
        <section class="footer-wrap">Copyright©1999-2019 中国移动IT云 版权所有</section>

        <!-- dialog -->
        <DialogRules :dialogMsg="dialogMsg"
                     @closeDialog="closeDialog"
                     v-if="dialogMsg.dialogVisible"></DialogRules>
        <!-- dialog -->
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import updateComponent from '@/utils/updateComponent.js'
    import { fixedNumber, divisionNumber } from '@/utils/filter.js'

    export default {
        mixins: [updateComponent],
        name: 'page5',
        components: {
            department: () => import('@/components/department.vue'),
            logo: () => import('@/components/logo.vue'),
            YwTable: () => import('@/components/yw-table.vue'),
            YwTitleTab: () => import('@/components/yw-title-tab.vue'),
            DialogRules: () => import('./dialog-rules.vue'),
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
                filterTitle: [{ name: '各月考核情况', label: 'PART' }],
                activeFilterTitle: 'PART',
                tableTitles: [],
                tableDatas: [],
                //dialog
                dialogMsg: {
                    dialogVisible: false,
                    id: '',//预留：每个弹窗数据的唯一标识
                    data: {} //预留：数据
                },
            }
        },

        methods: {
            //规则
            getRules() {
                this.dialogMsg.dialogVisible = true;
            },
            //关闭弹窗
            closeDialog(val) {
                this.dialogMsg.dialogVisible = false;
                if (val === 'update') {

                }

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
                    { name: 'month', title: `月份`, style: {} },
                    { name: 'cpuMax', title: `CPU均峰值利用率`, style: { align: 'right', width: 100, isHtml: true } },
                    { name: 'deploy', title: `部署上线延迟扣分`, style: { align: 'right', width: 150, isHtml: true } },
                    { name: 'inform', title: `上线通知延迟扣分`, style: { align: 'right', width: 150, isHtml: true } },
                    { name: 'total', title: `总扣分`, style: { align: 'right', width: 100, isHtml: true } },

                ];

                let params = {
                    "department1": this.department1,
                    "department2": this.department2,
                    "monthlyTime": this.monthlyTime,
                };

                this.$axios.post('/v1/cmdb/index/score/list', params).then((res) => {

                    this.tableDatas = res.data.data.map((item, index) => {
                        let total = eval(item.total) ? `-${item.total}` : '未扣分';
                        let obj = {
                            month: item.month,
                            cpuMax: item.cpuMax,
                            cpuMaxHtml: `${fixedNumber(item.cpuMax, 2)}%`,
                            deploy: item.deploy,
                            deployHtml: eval(item.deploy) ? `-${item.deploy}` : `<span style="color:#8681C1">--</span>`,
                            inform: item.inform,
                            informHtml: eval(item.inform) ? `-${item.inform}` : `<span style="color:#8681C1">--</span>`,
                            total: item.total,
                            totalHtml: `<span style="color: #01E5FF;">${total}</span>`,
                        }
                        if (item.month.indexOf('当前累计') > -1) {
                            obj.cpuMaxHtml = `<span style="cursor: pointer;"><i class="el-icon-thumb" style="margin-right:5px;color:#01E5FF;"></i>${fixedNumber(item.cpuMax, 2)}%</span>`
                            obj.cpuMaxTooltip = eval(res.data.final) ? `年终累计扣分：-${res.data.final}` : `年终累计扣分：--`
                        }
                        return obj
                    });
                });
            },

            getDatas() {
                this.getTableDatas();
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
            position: absolute;
            top: 100px;
            left: 150px;
            width: 760px;
            height: calc(80% - 50px);
            padding: 15px;
            background: rgba(24, 19, 109, 0.95);
            z-index: 3;
            .title {
                font-size: 16px;
                color: #fff;
                letter-spacing: 0;
                margin: 10px 0 30px 0;
            }
            .table-wrap {
                margin-top: 30px;
                height: calc(100% - 80px);
            }
        }
        .rule-wrap {
            position: absolute;
            bottom: 100px;
            left: 450px;
            font-size: 16px;
            color: #b1a5da;
        }
    }
</style>
