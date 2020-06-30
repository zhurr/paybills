
<template>
    <div class="container clearfix">
        <section class="header-wrap">
            <div class="log-wrap">
                <logo></logo>
                <span class="title">
                    一级资源池运营月报
                </span>
            </div>
            <div class="menu-wrap">
                <el-tabs class="yw-menu-tabs"
                         v-model="activefilterMenu"
                         @tab-click="changeMenu">
                    <el-tab-pane :label="item.name"
                                 v-for="(item,index) in filterMenu"
                                 :key="index"
                                 :name="item.label"></el-tab-pane>
                </el-tabs>

            </div>
            <div class="header-right">
                月报周期
                <el-select class="yw-select"
                           style="width:170px;margin-left:10px;"
                           v-model="activefilterDate"
                           filterable
                           @change="changeDate"
                           popper-class="yw-select-options"
                           placeholder="请选择">
                    <el-option v-for="(item,index) in filterDate"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </section>

        <section class="main-wrap">
            <vue-scroll style="width:100%;height:100%;"
                        :ops="ops1">
                <div class="main-inner"
                     style="width:100%;">
                    <Page1_1 v-if="resetComponent"
                             class="pool-section"
                             style="width:100%;"
                             :moduleData="moduleData"></Page1_1>
                    <Page1_2 v-if="resetComponent"
                             class="pool-section"
                             style="width:100%;"
                             :moduleData="moduleData"></Page1_2>
                    <Page1_3 v-if="resetComponent"
                             class="pool-section"
                             style="width:33%;"
                             :moduleData="moduleData"></Page1_3>
                    <Page1_4 v-if="resetComponent"
                             class="pool-section"
                             style="width:33%;"
                             :moduleData="moduleData"></Page1_4>
                    <Page1_5 v-if="resetComponent"
                             class="pool-section"
                             style="width:33%;"
                             :moduleData="moduleData"></Page1_5>
                    <Page1_6 v-if="resetComponent"
                             class="pool-section"
                             style="width:33%;"
                             :moduleData="moduleData"></Page1_6>
                    <Page1_7 class="pool-section"
                             v-if="resetComponent && activefilterMenu ==='总览'"
                             style="width:33%;"
                             :moduleData="moduleData"></Page1_7>
                    <Page1_8 class="pool-section"
                             v-if="resetComponent && activefilterMenu ==='总览'"
                             style="width:33%;"
                             :moduleData="moduleData"></Page1_8>
                    <Page1_9 class="pool-section"
                             v-if="resetComponent && activefilterMenu !=='总览'"
                             style="width:66.5%;"
                             :moduleData="moduleData"></Page1_9>
                </div>
            </vue-scroll>
        </section>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import { xMonth } from '@/utils/filter.js'
    import updateComponent from '@/utils/updateComponent.js'

    export default {
        mixins: [updateComponent],
        name: 'page1',
        components: {
            department: () => import('@/components/department.vue'),
            logo: () => import('@/components/logo.vue'),
            PageTitle: () => import('@/components/page-title.vue'),
            Page1_1: () => import('./page1-1.vue'),
            Page1_2: () => import('./page1-2.vue'),
            Page1_3: () => import('./page1-3.vue'),
            Page1_4: () => import('./page1-4.vue'),
            Page1_5: () => import('./page1-5.vue'),
            Page1_6: () => import('./page1-6.vue'),
            Page1_7: () => import('./page1-7.vue'),
            Page1_8: () => import('./page1-8.vue'),
            Page1_9: () => import('./page1-9.vue'),
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
                //菜单filter
                filterMenu: [],
                activefilterMenu: '',
                //日期filter
                filterDate: [],
                activefilterDate: '',
                //模块数据
                moduleData: {
                    monthlyTime: '',//日期
                    pool: '',//资源池
                },
                ops1: {
                    scrollPanel: {
                        scrollingX: false
                    }
                }
            }
        },

        methods: {
            //获得菜单
            getMenu() {

                let params = {
                    "type": 'month_report_idctype',
                };

                this.$axios.get('/v1/cmdb/configDict/getDictsByType', { params: params }).then((res) => {
                    this.filterMenu = res.data.map((item) => {
                        return {
                            name: item.name,
                            // label: item.value.trim() === '总览' ? '' : item.value
                            label: item.value
                        }
                    })

                    this.activefilterMenu = this.filterMenu[0].label
                    this.moduleData.pool = '';

                    //更新组件
                    this.updateComponent();
                });

            },
            //获得日期信息
            getDate() {

                for (let i = 1; i < 13; i++) {
                    let month1 = xMonth(-i, '-');
                    let month2 = xMonth(-i, '年', '月');
                    if (month1.split('-')[1] == '11' && month1.split('-')[0] == '2019') {
                        break;
                    }
                    this.filterDate.push({
                        value: month1,
                        label: month2
                    });
                }
                this.activefilterDate = this.filterDate[0].value;
                this.moduleData.monthlyTime = this.activefilterDate;
                //更新组件
                this.updateComponent();
            },
            changeMenu() {
                this.moduleData.pool = this.activefilterMenu.trim() === '总览' ? '' : this.activefilterMenu;
                //更新组件
                this.updateComponent();

            },
            changeDate() {
                this.moduleData.monthlyTime = this.activefilterDate;
                //更新组件
                this.updateComponent();
            },
            getDatas() {

            },

            //初始化
            init() {
                this.getMenu()
                this.getDate()
                this.getDatas()
            }

        },

        created() {
            this.init()
        }
    }
</script>

<style lang="scss" scoped>
    .header-wrap {
        position: relative;
        height: 60px;
        background: rgba(0, 0, 0, 0.1);
        .header-right {
            position: absolute;
            top: 10px;
            right: 30px;
            font-size: 14px;
            color: #ffffff;
            letter-spacing: 0;
        }
        .menu-wrap {
            display: inline-block;
            vertical-align: middle;
            width: calc(100% - 700px);
            padding: 0 50px;
            position: absolute;
            bottom: 2px;
            .yw-menu-tabs {
                width: calc(100%);
            }
        }
    }
    .main-wrap {
        width: 100%;
        height: 100%;
        overflow-y: auto;

        .main-inner {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            padding: 20px 30px;
        }
        .pool-section {
            position: relative;
            width: 100%;
            background: rgba(24, 20, 100, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.2);
            margin-bottom: 20px;
            // overflow: hidden;
            &:last-of-type {
                margin-bottom: 100px;
            }
            &:before {
                content: "";
                position: absolute;
                top: -4px;
                left: -4px;
                display: inline-block;
                width: 15px;
                height: 15px;
                background: url(../../assets/img/arrow-up.png) no-repeat;
            }
            &:after {
                content: "";
                position: absolute;
                bottom: -4px;
                right: -4px;
                display: inline-block;
                width: 15px;
                height: 15px;
                background: url(../../assets/img/arrow-down.png) no-repeat;
            }
        }
    }
</style>
