
<template>
    <div class="container clearfix">
        <section class="header-wrap">
            <div class="log-wrap">
                <logo></logo>
                <span class="title">
                    {{title}}
                </span>
            </div>
            <div class="menu-wrap">
                <el-tabs class="yw-menu-tabs"
                         style="width:auto"
                         v-model="activefilterMenu"
                         @tab-click="changeMenu">
                    <el-tab-pane :label="item.name"
                                 v-for="(item,index) in filterMenu"
                                 :key="index"
                                 :name="item.label"></el-tab-pane>
                </el-tabs>
                <YwMenuMore @changeMenu="changeMenu"
                            v-if="menuDatas.show"
                            :menuDatas="menuDatas"></YwMenuMore>
            </div>
            <div class="header-right">
                展示周期
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
            <div class="main-inner"
                 style="width:100%;">
                <Page1_1 v-if="resetComponent"
                         class="module-section"
                         style="width:49.4%;height:60%;"
                         :moduleData="moduleData"></Page1_1>
                <Page1_2 v-if="resetComponent"
                         class="module-section"
                         style="width:49.4%;height:60%;"
                         :moduleData="moduleData"></Page1_2>
                <Page1_3 v-if="resetComponent  && activefilterMenu ==='总览'"
                         class="module-section"
                         style="width:49.4%;height:30%;"
                         :moduleData="moduleData"
                         :otherDatas="{title:'裸金属计算资源利用率TOP5'}"></Page1_3>
                <Page1_4 v-if="resetComponent && activefilterMenu ==='总览'"
                         class="module-section"
                         style="width:49.4%;height:30%;"
                         :moduleData="moduleData"
                         :otherDatas="{title:'云主机计算资源利用率TOP5'}"></Page1_4>
                <Page1_5 v-if="resetComponent && activefilterMenu !=='总览'"
                         class="module-section"
                         style="width:49.4%;height:30%;"
                         :moduleData="moduleData"
                         :otherDatas="{title:'各资源池裸金属计算资源利用率'}"></Page1_5>
                <Page1_6 v-if="resetComponent && activefilterMenu !=='总览'"
                         class="module-section"
                         style="width:49.4%;height:30%;"
                         :moduleData="moduleData"
                         :otherDatas="{title:'各资源池云主机计算资源利用率'}"></Page1_6>
            </div>
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
            YwMenuMore: () => import('@/components/yw-menu-more.vue'),
            Page1_1: () => import('./page1-1.vue'),
            Page1_2: () => import('./page1-2.vue'),
            Page1_3: () => import('./page1-3.vue'),
            Page1_4: () => import('./page1-3.vue'),
            Page1_5: () => import('./page1-4.vue'),
            Page1_6: () => import('./page1-4.vue'),
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
                //标题
                title: '省级资源池运营月报',
                //菜单filter
                filterMenu: [],
                activefilterMenu: '',
                //日期filter
                filterDate: [],
                activefilterDate: '',
                //模块数据
                moduleData: {
                    monthlyTime: '',//选中的日期
                    menu: '',//选中的菜单
                },
                //菜单数据
                menuDatas: {
                    show: true,
                    data: []
                }

            }
        },

        methods: {

            //获得菜单
            getMenu() {
                this.menuDatas.data = [ //列表
                    { name: '总览', label: '总览' },
                    { name: '北京', label: 'beijing', active: false },
                    { name: '河北', label: 'hebei', active: false },
                    { name: '山西', label: 'sanxi', active: false },
                    { name: '江苏', label: 'jiangsu', active: false },
                    { name: '河南', label: 'henan', active: false },
                    { name: '上海', label: 'shanghai', active: false },
                    { name: '成都', label: 'chengdu', active: false },
                ]
                this.filterMenu = [
                    { name: '总览', label: '总览' },
                    { name: '北京', label: 'beijing' },
                    { name: '河北', label: 'hebei' },
                    { name: '山西', label: 'sanxi' },
                    { name: '江苏', label: 'jiangsu' },
                    { name: '河南', label: 'henan' },
                ]
                this.activefilterMenu = this.filterMenu[0].label
                this.moduleData.menu = '';

                // let params = {
                //     "type": 'month_report_idctype',
                // };

                // this.$axios.get('/v1/cmdb/configDict/getDictsByType', { params: params }).then((res) => {
                //     this.filterMenu = res.data.map((item) => {
                //         return {
                //             name: item.name,
                //             label: item.value
                //         }
                //     })

                //     this.activefilterMenu = this.filterMenu[0].label
                //     this.moduleData.pool = '';

                //     //更新组件
                //     this.updateComponent();
                // });

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
            //切换菜单
            changeMenu(val) {

                let currentMenu = {}
                this.menuDatas.data.forEach((item) => {
                    item.active = false

                    if (val.label === item.label || val.paneName === item.label) {
                        currentMenu = item
                    }
                })
                currentMenu.active = true
                this.activefilterMenu = currentMenu.label
                this.title = `${currentMenu.name}省资源池运营月报`
                if (this.activefilterMenu.trim() === '总览') {
                    this.title = `省级资源池运营月报`
                    this.moduleData.menu = ''
                } else {
                    this.moduleData.menu = this.activefilterMenu
                }


                //更新更多组件
                this.menuDatas.show = false;
                this.$nextTick(() => {
                    this.menuDatas.show = true
                })

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
        padding: 20px 30px;

        .main-inner {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        .module-section {
            position: relative;
            width: 100%;
            background: rgba(24, 19, 109, 0.88);
            margin-bottom: 20px;
            &:last-of-type {
                margin-bottom: 100px;
            }
        }
    }
</style>
