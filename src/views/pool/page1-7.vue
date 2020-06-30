
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
                <div class="table-box">
                    <YwTable :tableTitles="tableTitles"
                             v-if="resetComponent"
                             :option="{'selfClass':''}"
                             @sortTable="sortTable"
                             :tableDatas="tableDatas"></YwTable>
                </div>
            </section>
            <!-- 表格 -->
        </section>

    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import { xMonth, fixedNumber } from '@/utils/filter.js'
    import updateComponent from '@/utils/updateComponent.js'

    export default {
        mixins: [updateComponent],
        props: ['moduleData'],
        components: {
            YwTitleTab: () => import('@/components/yw-title-tab.vue'),
            YwTable: () => import('@/components/yw-table-line.vue'),
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
                // this.tableDatas = datas;
            },
            //标题tab
            changeTitle(val) {
                this.activeFilterTitle = val;
            },
            //表格tab
            changeTable() {
                this.getTableDatas()
            },
            //获得表格数据
            getTableDatas() {
                //更新表格
                this.updateComponent();
                this.tableTitles = [
                    { name: 'name', title: ``, style: { isHtml: true, width: 200, } },
                    { name: 'num', title: ``, style: { sortable: true, align: 'right', isHtml: true } },
                ];

                let flagImg = `<i style="display:inline-block; vertical-align: middle;margin-right: 10px;width:4px;height:4px;border-radius:100%;background:#fff;"></i>`
                this.tableDatas = []

                let params = {
                    "idcType": this.moduleData.pool,
                    "month": this.moduleData.monthlyTime,
                    "countType": this.activefilterTable,
                    "recycleType": '资源回收'
                };

                this.$axios.get('/v1/cmdb/monthReport/countRecycleResource', { params: params }).then((res) => {
                    let result = res.data[0]
                    for (let itemKey in result) {

                        if (['VCPU', '内存'].indexOf(itemKey) < 0) {
                            let itemNum = result[itemKey]
                            let obj = {
                                name: itemKey,
                                nameHtml: `${flagImg}${itemKey}`,
                                num: itemNum,
                                numHtml: `<span style="font-size:16px;color:#0DBE9C;" title="${itemNum}">${itemNum}</span>`,
                            }
                            if (['云主机(台)'].indexOf(itemKey) > -1) {
                                let specialContent = `${flagImg}VCPU ${result['VCPU']} ｜内存 ${result['内存']}`;
                                let specialText = `VCPU ${result['VCPU']} ｜内存 ${result['内存']}`
                                let specialStart = `<div style="display:block;width:100%;line-height: 22px;font-size:16px;color:#0DBE9C;">`;
                                let specialEnd = `</div>`;
                                obj.numHtml = `${specialStart}<p class="text-ellipse" style="display:block" title="${obj.num}">${obj.num}</p><p class="text-ellipse" title="${specialText}" style="font-size:12px;color:rgba(255,255,255,.6)">${specialContent}</p>${specialEnd}`
                            }
                            this.tableDatas.push(obj)

                        }
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
            .yw-select {
                position: absolute;
                top: 20px;
                left: 20px;
            }
        }
        .component-main {
            height: calc(100% - 100px);
            .table-wrap {
                height: 100%;
                .table-box {
                    height: 100%;
                }
            }
        }
    }
</style>
