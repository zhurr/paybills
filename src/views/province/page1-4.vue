
<template>
    <div class="component-wrap">
        <div class="chart-title clearfix">
            {{otherDatas.title}}
        </div>
        <section class="table-wrap"
                 style="width:100%;">
            <div class="table-box">
                <YwTable :tableTitles="tableTitles"
                         v-if="resetComponent"
                         :option="{'highlight-current-row':true,'enClick':true,'selfClass':'table-line no-border only-descending',sort:{type:'dynamic',order:'descending',default:{prop: 'cpmMAX', order: 'descending'}}}"
                         @sortTable="sortTable"
                         @clickTableRow="clickTableRow"
                         :tableDatas="tableDatas"></YwTable>
            </div>
        </section>

        <!-- dialog -->
        <DialogPoolTrend :dialogMsg="dialogMsg"
                         :moduleData="moduleData"
                         @closeDialog="closeDialog"
                         v-if="dialogMsg.dialogVisible"></DialogPoolTrend>
        <!-- dialog -->
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import { xMonth, fixedNumber } from '@/utils/filter.js'
    import updateComponent from '@/utils/updateComponent.js'

    export default {
        mixins: [updateComponent],
        props: ['moduleData', 'otherDatas'],
        components: {
            YwTitleTab: () => import('@/components/yw-title-tab.vue'),
            YwTable: () => import('@/components/yw-table.vue'),
            DialogPoolTrend: () => import('./dialog-pool-trend.vue'),
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
                filterTitle: [{ name: '资源回收', label: '资源回收' }],
                activefilterTitle: '资源回收',
                //表格
                filterTable: [{ name: '计算', label: '计算' }, { name: '存储', label: '存储' }],
                activefilterTable: '计算',
                tableTitles: [],
                tableDatas: [],
                tableOrder: 'cpmMAX',
                //dialog
                dialogMsg: {
                    dialogVisible: false,
                    id: '',//预留：每个弹窗数据的唯一标识
                    data: {} //预留：数据
                },
            }
        },

        methods: {
            //表格排序
            sortTable(rules) {
                this.tableOrder = rules.prop
                this.getTableDatas()
            },
            //表格点击事件
            clickTableRow(row, column, event) {
                this.dialogMsg.dialogVisible = true
                this.dialogMsg.data = row;
            },
            //关闭弹窗
            closeDialog(val) {
                this.dialogMsg.dialogVisible = false;
                if (val === 'update') {

                }

            },
            //标题tab
            changeTitle(val) {
                this.activefilterTitle = val;
            },
            //表格tab
            changeTable() {
                this.getTableDatas()
            },

            //表格
            getTableDatas() {
                //更新表格
                // this.updateComponent();
                this.tableTitles = [
                    { name: 'name', title: `资源池`, style: { isHtml: true, width: 150, } },
                    { name: 'cpmMAX', title: `CPU均峰值`, style: { sortable: true, align: 'right', isHtml: true } },
                    { name: 'memoryMAX', title: `内存均峰值`, style: { sortable: true, align: 'right', isHtml: true } },
                    { name: 'cpmAVG', title: `CPU均值`, style: { sortable: true, align: 'right', isHtml: true } },
                    { name: 'memoryAVG', title: `内存均值`, style: { sortable: true, align: 'right', isHtml: true } },
                ];

                let flagImg = `<i style="display:inline-block; vertical-align: middle;margin-right: 10px;width:4px;height:4px;border-radius:100%;background:#fff;"></i>`
                this.tableDatas = []

                this.tableDatas = [
                    {
                        name: ' 廊坊数据中心',
                        nameHtml: `${flagImg} 廊坊数据中心`,
                        cpmMAX: 52.3,
                        cpmMAXHtml: this.tableOrder === 'cpmMAX' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                        memoryMAX: 12.3,
                        memoryMAXHtml: this.tableOrder === 'memoryMAX' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                        cpmAVG: 12.3,
                        cpmAVGHtml: this.tableOrder === 'cpmAVG' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                        memoryAVG: 12.3,
                        memoryAVGHtml: this.tableOrder === 'memoryAVG' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                    },
                    {
                        name: ' 廊坊数据中心2',
                        nameHtml: `${flagImg} 廊坊数据中心2`,
                        cpmMAX: 52.3,
                        cpmMAXHtml: this.tableOrder === 'cpmMAX' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                        memoryMAX: 12.3,
                        memoryMAXHtml: this.tableOrder === 'memoryMAX' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                        cpmAVG: 12.3,
                        cpmAVGHtml: this.tableOrder === 'cpmAVG' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                        memoryAVG: 12.3,
                        memoryAVGHtml: this.tableOrder === 'memoryAVG' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                    },
                    {
                        name: ' 廊坊数据中心3',
                        nameHtml: `${flagImg} 廊坊数据中心3`,
                        cpmMAX: 52.3,
                        cpmMAXHtml: this.tableOrder === 'cpmMAX' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                        memoryMAX: 12.3,
                        memoryMAXHtml: this.tableOrder === 'memoryMAX' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                        cpmAVG: 12.3,
                        cpmAVGHtml: this.tableOrder === 'cpmAVG' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                        memoryAVG: 12.3,
                        memoryAVGHtml: this.tableOrder === 'memoryAVG' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                    },
                    {
                        name: ' 廊坊数据中心4',
                        nameHtml: `${flagImg} 廊坊数据中心4`,
                        cpmMAX: 52.3,
                        cpmMAXHtml: this.tableOrder === 'cpmMAX' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                        memoryMAX: 12.3,
                        memoryMAXHtml: this.tableOrder === 'memoryMAX' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                        cpmAVG: 12.3,
                        cpmAVGHtml: this.tableOrder === 'cpmAVG' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                        memoryAVG: 12.3,
                        memoryAVGHtml: this.tableOrder === 'memoryAVG' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                    },
                    {
                        name: ' 廊坊数据中心5',
                        nameHtml: `${flagImg} 廊坊数据中心5`,
                        cpmMAX: 52.3,
                        cpmMAXHtml: this.tableOrder === 'cpmMAX' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                        memoryMAX: 12.3,
                        memoryMAXHtml: this.tableOrder === 'memoryMAX' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                        cpmAVG: 12.3,
                        cpmAVGHtml: this.tableOrder === 'cpmAVG' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                        memoryAVG: 12.3,
                        memoryAVGHtml: this.tableOrder === 'memoryAVG' ? `<span style="color:#0DBE9C;">${fixedNumber(52.3, 2)}%</span>` : `${fixedNumber(52.3, 2)}%`,
                    }
                ]
                // let params = {
                //     "idcType": this.moduleData.pool,
                //     "month": this.moduleData.monthlyTime,
                //     "countType": this.activefilterTable,
                //     "recycleType": '资源回收'
                // };

                // this.$axios.get('/v1/cmdb/monthReport/countRecycleResource', { params: params }).then((res) => {
                //     let result = res.data[0]
                //     for (let itemKey in result) {

                //         if (['VCPU', '内存'].indexOf(itemKey) < 0) {
                //             let itemNum = result[itemKey]
                //             let obj = {
                //                 name: itemKey,
                //                 nameHtml: `${flagImg}${itemKey}`,
                //                 num: itemNum,
                //                 numHtml: `<span style="font-size:16px;color:#0DBE9C;" title="${itemNum}">${itemNum}</span>`,
                //             }
                //             if (['云主机(台)'].indexOf(itemKey) > -1) {
                //                 let specialContent = `${flagImg}VCPU ${result['VCPU']} ｜内存 ${result['内存']}`;
                //                 let specialText = `VCPU ${result['VCPU']} ｜内存 ${result['内存']}`
                //                 let specialStart = `<div style="display:block;width:100%;line-height: 22px;font-size:16px;color:#0DBE9C;">`;
                //                 let specialEnd = `</div>`;
                //                 obj.numHtml = `${specialStart}<p class="text-ellipse" style="display:block" title="${obj.num}">${obj.num}</p><p class="text-ellipse" title="${specialText}" style="font-size:12px;color:rgba(255,255,255,.6)">${specialContent}</p>${specialEnd}`
                //             }
                //             this.tableDatas.push(obj)

                //         }
                //     }
                // });
            },
            //获得数据
            getDatas() {
                this.getTableDatas()
            },
        },

        mounted() {
            this.getDatas()
        }
    }
</script>

<style lang="scss" scoped>
    .component-wrap {
        padding: 20px;
        .chart-title {
            padding: 0;
            margin-bottom: 10px;
            color: #0d7ef4;
        }
        .table-wrap {
            height: 100%;
            .table-box {
                height: 100%;
            }
        }
    }
</style>
