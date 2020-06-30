
<template>
    <!-- 告警 -->
    <el-dialog class="yw-dialog-dark"
               v-if="dialogMsg.dialogVisible"
               :append-to-body="true"
               :modal="true"
               :show-close="false"
               width="900px"
               title=""
               :visible.sync="dialogMsg.dialogVisible">
        <section slot="title"
                 class="dialog-title">
            <section class="title-link-wrap clearfix">
                <YwTitleTab @changeTitle="changeTitle"
                            :options="{type:'underline'}"
                            :tabActive="activeFilterTitle"
                            :tabDatas="filterTitle"></YwTitleTab>
                <el-select class="yw-select round fr"
                           style="width:170px;"
                           v-model="activefilterSelect"
                           filterable
                           @change="changeSelect"
                           popper-class="yw-select-options"
                           placeholder="请选择">
                    <el-option v-for="(item,index) in filterSelect"
                               :key="index"
                               :label="item.name"
                               :value="item.label">
                    </el-option>
                </el-select>
            </section>
        </section>
        <section class="dialog-main">
            <!-- 表格 -->
            <section class="table-wrap"
                     style="width:100%;">
                <div class="table-inner"
                     style="width:100%">
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
        </section>
        <!-- 删除按钮 -->
        <section class="dialog-close"
                 @click="close">
            <img class="btn-close"
                 src="../../assets/img/close.png"
                 alt="">
        </section>
        <!-- 删除按钮 -->
    </el-dialog>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import updateComponent from '@/utils/updateComponent.js'
    export default {
        mixins: [updateComponent],
        props: ['moduleData', 'dialogMsg'],
        components: {
            YwTitleTab: () => import('@/components/yw-title-tab.vue'),
            YwTable: () => import('@/components/yw-table.vue'),
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
                filterTitle: [{ name: '告警设备TOP10', label: '告警设备TOP10' }, { name: '告警指标TOOP10', label: '告警指标TOOP10' }],
                activeFilterTitle: '告警设备TOP10',
                //下拉框
                // filterSelect: [{ name: '物理服务器', label: 'X86服务器' }, { name: '虚拟服务器', label: '云主机' }],
                filterSelect: [{ name: '裸金属', label: 'X86服务器' }, { name: '云主机', label: '云主机' }],
                activefilterSelect: 'X86服务器',
                tableTitles: [],
                tableDatas: [],
            }
        },
        methods: {
            //表格排序
            sortTable(datas) {
                this.tableDatas = datas;
            },
            //获得表格数据
            getTableDatas() {
                //更新表格
                this.updateComponent();

                if (this.activeFilterTitle === '告警设备TOP10') {
                    this.getDevice()
                } else {
                    this.getIndex()
                }

            },
            //获得设备数据
            getDevice() {
                this.tableDatas = []
                this.tableTitles = [
                    { name: 'index', title: `排名`, style: { isHtml: true } },
                    { name: '设备名称', title: `设备名称`, style: { width: 200, } },
                    { name: '告警条数', title: `告警条数`, style: { sortable: true, width: 200, } },
                ];

                let params = {
                    "idcType": this.moduleData.pool,
                    "month": this.moduleData.monthlyTime,
                    "deviceType": this.activefilterSelect
                };

                this.$axios.post('/v1/alerts/monReport/viewByIp', params).then((res) => {
                    let bgFlagStart = `<span style="display:inline-block;width:24px;height:24px;line-heght:24px;border-radius:100%;background: rgba(255,255,255,0.10);text-align:center;">`
                    let bgFlagEnd = `</span>`
                    this.tableDatas = res.data.map((item, index) => {
                        return {
                            index: index + 1,
                            indexHtml: `${bgFlagStart}${index + 1}${bgFlagEnd}`,
                            '设备名称': item['设备名称'],
                            '告警条数': item['告警条数'],
                        }
                    });
                });
            },
            //获得指标数据
            getIndex() {
                this.tableDatas
                this.tableTitles = [
                    { name: 'index', title: `排名`, style: { isHtml: true } },
                    { name: '指标名称', title: `指标名称`, style: { width: 200, } },
                    { name: '告警条数', title: `告警条数`, style: { sortable: true, width: 200, } },
                ];

                let params = {
                    "idcType": this.moduleData.pool,
                    "month": this.moduleData.monthlyTime,
                    "deviceType": this.activefilterSelect
                };

                this.$axios.post('/v1/alerts/monReport/viewByKeyComment', params).then((res) => {
                    let bgFlagStart = `<span style="display:inline-block;width:24px;height:24px;line-heght:24px;border-radius:100%;background: rgba(255,255,255,0.10);text-align:center;">`
                    let bgFlagEnd = `</span>`
                    this.tableDatas = res.data.map((item, index) => {
                        return {
                            index: index + 1,
                            indexHtml: `${bgFlagStart}${index + 1}${bgFlagEnd}`,
                            '指标名称': item['指标名称'],
                            '告警条数': item['告警条数'],
                        }
                    });
                });
            },
            //获得数据
            getDatas() {
                this.getTableDatas()
            },
            //tab切换
            changeTitle(val) {
                this.activeFilterTitle = val
                this.getTableDatas()
            },
            changeSelect() {
                this.getTableDatas()
            },
            //关闭弹窗
            close() {
                this.$emit('closeDialog', false);
            }
        },
        mounted() {
            this.getDatas();
        }
    }

</script>
<style lang="scss" scoped>
    .yw-dialog-dark {
        .dialog-title {
            margin: 20px 0 10px 0;
            font-size: 16px;
            color: #fff;
            text-align: center;
        }
        .dialog-main {
            height: 440px;
            padding: 0 20px;
            .title-link-wrap {
                margin: 0;
            }
            .table-wrap {
                display: flex;
                justify-content: space-between;
                width: 100%;
                height: 100%;
                .table-inner {
                    background: transparent;
                }
                .table-box {
                    height: 100%;
                }
            }
        }
    }
</style>
