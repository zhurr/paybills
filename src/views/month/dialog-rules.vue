
<template>
    <!-- 考核规则 -->
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
                <article class="article">
                    <p class="article-part">根据IT公司3月24日《2020年IT公司部门绩效考核细则》中管理效能部分第11项“IT云资源使用情况”，详细考核内容和规则如下：</p>
                    <p class="article-part">1.业务割接上线通知及上线部署及时性：IT云计算资源交付后，租户业务应在一个月内完成业务部属、三个月内完成上线，并应在业务上线前提前3个工作日发送上线OA函给基础平台部。若租户延迟发送OA函，发现一次扣0.5分，对于业务延迟上线未超过1个月（含1个月），扣0.5分，业务延迟上线1-2个月，扣1分，业务延迟上线2-3个月，扣2分。</p>
                    <p class="article-part"> 2.CPU利用率均峰值 = max(avg(集群时刻1)，avg（集群时刻2），……,avg(集群时刻n))，其中：avg(集群时刻X)= （CPU%1+CPU%2+…+CPU%N）/集群服务器规模；集群采样频率为1次/5min，按月统计。</p>
                    <p class="article-part">当利用率达到或高于30%时不扣分，当利用率低于30%时，每下降1pp扣0.4分，扣满2分为止。</p>
                </article>
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
                filterTitle: [{ name: '考核内容与规则', label: 'rule' }],
                activeFilterTitle: 'rule',
            }
        },
        methods: {
            //标题切换
            changeTitle(val) {
                this.activeFilterTitle = val

            },
            //关闭弹窗
            close() {
                this.$emit('closeDialog', false);
            }
        },
        mounted() {

        }
    }

</script>
<style lang="scss" scoped>
    .dialog-main {
        height: 460px;
        padding: 30px 20px;

        .article {
            padding: 0 50px;
            font-size: 16px;
            line-height: 2;

            .article-part {
                text-align: justify;
                text-indent: 34px;
                margin-bottom: 15px;
            }
        }
    }
</style>
