
<template>
    <!-- 表格 -->
    <section class="table-wrap"
             v-if="datas.show">
        <p class="title">{{datas.data.department}}各月考核情况</p>
        <YwTable :tableTitles="tableTitles"
                 :option="{'selfClass':'no-border empty-more'}"
                 @sortTable="sortTable"
                 :tableDatas="tableDatas"></YwTable>
    </section>
    <!-- 表格 -->
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import updateComponent from '@/utils/updateComponent.js'
    import { fixedNumber, divisionNumber } from '@/utils/filter.js'

    export default {
        mixins: [updateComponent],
        props: ['datas'],
        components: {
            department: () => import('@/components/department.vue'),
            logo: () => import('@/components/logo.vue'),
            YwTable: () => import('@/components/yw-table.vue'),
            YwTitleTab: () => import('@/components/yw-title-tab.vue'),
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
                tableTitles: [],
                tableDatas: [],
            }
        },

        methods: {

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
                    { name: 'cpuMax', title: `CPU均峰值利用率`, style: { align: 'right', width: 140, isHtml: true } },
                    { name: 'deploy', title: `部署上线延迟扣分`, style: { align: 'right', width: 140, isHtml: true } },
                    { name: 'inform', title: `上线通知延迟扣分`, style: { align: 'right', width: 140, isHtml: true } },
                    // { name: 'total', title: `总扣分`, style: { align: 'right', width: 100, isHtml: true } },

                ];

                let params = {
                    "department1": '中移信息公司',
                    "department2": this.datas.data.department,
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
                            deployHtml: eval(item.deploy) ? `-${item.deploy}` : `<span style="color:#fff">--</span>`,
                            inform: item.inform,
                            informHtml: eval(item.inform) ? `-${item.inform}` : `<span style="color:#fff">--</span>`,
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

        },
        mounted() {
            this.getDatas();
        }
    }
</script>

<style lang="scss" scoped>
    .title {
        font-size: 14px;
        margin: 20px 0 10px 20px;
    }
    .table-wrap {
        height: calc(100% - 50px);
    }
</style>
