
<template>
    <!-- 部门链接 -->
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
            <YwTitleTab @changeTitle="changeTitle"
                        :tabActive="activeFilterTitle"
                        :tabDatas="filterTitle"></YwTitleTab>
        </section>
        <section class="dialog-main">
            <el-scrollbar class="yw-scrollbar-y"
                          style="height: 100%">
                <div class="main-list">
                    <p class="main-item text-ellipse"
                       :title="item.orgName"
                       @click="goDetails(item.orgName)"
                       v-for="(item,index) in activeDatas"
                       v-if="item.orgName !== $route.query.excludeDep"
                       :key="index"><i class="flag-img"></i><span>{{item.orgName}}</span></p>
                </div>
            </el-scrollbar>
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
    export default {
        props: ['dialogMsg'],
        components: {
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
                filterTitle: [{ name: '内部租户', label: '内部租户' }, { name: '外部租户', label: '外部租户' }],
                activeFilterTitle: '内部租户',
                //展示租户
                activeDatas: [],
                //内部租户
                ITdatas: [],
                //外部租户
                noITdatas: []
            }
        },
        methods: {
            //获得数据
            getDatas() {
                this.ITdatas = [];
                this.noITdatas = [];

                let params = {
                    // "department1": this.department1,
                    // "department2": this.department2,
                    // "monthlyTime": this.monthlyTime,
                };

                this.$axios.get('/v1/cmdb/orgManager/loadTree', { params: params }).then((res) => {
                    if (res.data[0].children) {
                        res.data[0].children.forEach((item) => {
                            if (item.orgName.trim() === '中移信息公司') {
                                this.ITdatas = item.children;
                            } else {
                                this.noITdatas.push(item);
                            }
                        });
                    }
                    this.activeDatas = this.ITdatas;

                });
            },
            //tab切换
            changeTitle(val) {
                this.activeFilterTitle = val;
                switch (this.activeFilterTitle) {
                    //内部租户(IT公司)
                    case '内部租户':
                        this.activeDatas = this.ITdatas;
                        break;
                    //外部租户(非IT公司)
                    default:
                        this.activeDatas = this.noITdatas;
                        break;
                }
            },
            //到详情页面
            goDetails(val) {
                let url = `${location.origin}/`;
                let department1 = null;
                let department2 = null;
                switch (this.activeFilterTitle) {
                    //内部租户(IT公司)
                    case '内部租户':
                        department1 = '中移信息公司';
                        department2 = val;
                        break;
                    //外部租户(非IT公司)
                    default:
                        department1 = val;
                        department2 = null;
                        break;
                }
                window.open(`${url}?department1=${department1}&department2=${department2}`, '_blank');
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
        .dialog-main {
            height: 460px;
            padding: 30px 20px;
            .main-list {
                padding: 0 30px;
                .main-item {
                    display: inline-block;
                    width: 33%;
                    padding: 0 20px 0 0;
                    margin-bottom: 30px;
                    cursor: pointer;
                    &:hover,
                    &.active {
                        color: rgba(255, 255, 255, 0.6);
                    }
                    .flag-img {
                        display: inline-block;
                        vertical-align: middle;
                        width: 4px;
                        height: 4px;
                        border-radius: 100%;
                        background: #fff;
                        margin-right: 10px;
                    }
                }
            }
        }
    }
</style>
