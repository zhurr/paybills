
<template>
    <div class="component-wrap">
        <section class="title-link-wrap clearfix">
            <YwTitleTab @changeTitle="changeTitle"
                        :tabActive="activeFilterTitle"
                        :tabDatas="filterTitle"></YwTitleTab>
            <el-tabs class="yw-tabs fr"
                     v-model="activefilterTable"
                     type="card"
                     @tab-click="changeTable">
                <el-tab-pane :label="item.name"
                             v-for="(item,index) in filterTable"
                             :key="index"
                             :name="item.label"></el-tab-pane>
            </el-tabs>
        </section>
        <section class="component-main">
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

    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import { xMonth } from '@/utils/filter.js'
    import updateComponent from '@/utils/updateComponent.js'

    export default {
        mixins: [updateComponent],
        props: ['moduleData'],
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
                filterTitle: [{ name: '资源回收', label: '资源回收' }, { name: '资源清理', label: '资源清理' }],
                activeFilterTitle: '资源回收',
                //表格
                filterTable: [{ name: '计算', label: '计算' }, { name: '存储', label: '存储' }],
                activefilterTable: '计算',
                tableTitles: [],
                tableDatas: [],
            }
        },

        methods: {
            //表格排序
            sortTable(datas) {
                this.tableDatas = datas;
            },
            //标题tab
            changeTitle(val) {
                this.activeFilterTitle = val;
                this.getTableDatas()
            },
            //表格tab
            changeTable() {
                this.getTableDatas()
            },
            //获得表格数据
            getTableDatas() {
                //更新表格
                this.updateComponent();

                let dateName = `回收时间`;
                let staticColumn = [{ name: 'bizSystem', title: `租户应用系统名称`, style: {} }];
                let dateColumn = [{ name: 'date', title: `回收时间`, style: { width: 200, isHtml: true } }];
                let activeColumn = [
                    { name: 'wuliji', title: `裸金属(台)`, style: { sortable: true, align: 'right', width: 200, isHtml: true } },
                    { name: 'xuniji', title: `云主机(台)`, style: { sortable: true, align: 'right', isHtml: true } }
                ];
                if (this.activeFilterTitle === '资源清理') {
                    dateName = `清理时间`;
                    dateColumn = [{ name: 'date', title: `清理时间`, style: { width: 200, isHtml: true } }];
                }
                if (this.activefilterTable === '存储') {
                    activeColumn = [
                        { name: 'store', title: `存储(T)`, style: { sortable: true, align: 'right', width: 200, isHtml: true } }
                    ];
                }

                this.tableTitles = staticColumn.concat(dateColumn, activeColumn);

                let params = {
                    "idcType": this.moduleData.pool,
                    "month": this.moduleData.monthlyTime,
                    "countType": this.activefilterTable,
                    "recycleType": this.activeFilterTitle
                };

                this.$axios.get('/v1/cmdb/monthReport/countRecycleResource', { params: params }).then((res) => {

                    if (this.activefilterTable === '存储') {
                        this.tableDatas = res.data.map((item) => {
                            return {
                                bizSystem: item['租户应用系统名称'],
                                date: item[dateName],
                                dateHtml: `<span style="font-size: 12px;color: #BBCEE4;">${item[dateName]}</span>`,
                                store: item['存储(T)'],
                                storeHtml: `<span class="text-ellipse" style="font-size:14px;color:#0DBE9C;" title="${item['存储(T)']}">${item['存储(T)']}</span>`,
                            }
                        })
                    } else {

                        let specialStart = `<div style="display:block;width:100%;line-height: 22px;font-size:16px;color:#0DBE9C;">`;
                        let specialEnd = `</div>`;

                        this.tableDatas = res.data.map((item) => {
                            let specialText = `VCPU ${item['VCPU']} ｜内存 ${item['内存']}`
                            return {
                                bizSystem: item['租户应用系统名称'],
                                date: item[dateName],
                                dateHtml: `<span style="font-size: 12px;color: #BBCEE4;">${item[dateName]}</span>`,
                                wuliji: item['裸金属(台)'],
                                wulijiHtml: `<span class="text-ellipse" style="font-size:14px;color:#0DBE9C;" title="${item['裸金属(台)']}">${item['裸金属(台)']}</span>`,
                                xuniji: item['云主机(台)'],
                                xunijiHtml: `${specialStart}<p class="text-ellipse" style="display:block" title="${item['云主机(台)']}">${item['云主机(台)']}</p><p class="text-ellipse" title="${specialText}" style="font-size:12px;color:rgba(255,255,255,.6)">${specialText}</p>${specialEnd}`
                            }
                        })
                    }


                });
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
        width: 100%;
        height: 300px;
        padding: 0 20px;
        .title-link-wrap {
            min-height: 36px;
            margin-bottom: 0;
            .yw-select {
                position: absolute;
                top: 20px;
                left: 20px;
            }
        }
        .component-main {
            width: 100%;
            height: calc(100% - 80px);
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
