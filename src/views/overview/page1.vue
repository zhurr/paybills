
<template>
    <div class="container clearfix">
        <section class="log-wrap">
            <logo></logo>
        </section>
        <section class="link-wrap"
                 @click="getDepartment()">
            <span class="link-text">查看各租户运营月报</span><img src="../../assets/img/jiantou-right.png"
                 alt="">
        </section>
        <!-- <department></department> -->
        <section class="main-wrap">
            <!-- <p class="title">Hi,{{userMsg}}</p> -->
            <p class="name">
                <span class="fontGradient-red-blue">IT云</span><span class="fontGradient-blue-light">租户运营月报(总)</span>
            </p>
        </section>

        <!-- dialog -->
        <DialogDepartment :dialogMsg="dialogMsg"
                          @closeDialog="closeDialog"
                          v-if="dialogMsg.dialogVisible"></DialogDepartment>
        <!-- dialog -->
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    export default {
        name: 'overview-page1',
        components: {
            DialogDepartment: () => import('./dialog-department.vue'),
            department: () => import('@/components/department.vue'),
            logo: () => import('@/components/logo.vue'),
            PageTitle: () => import('@/components/page-title.vue'),
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
                //dialog
                dialogMsg: {
                    dialogVisible: false,
                    id: '',//预留：每个弹窗数据的唯一标识
                    data: {} //预留：数据
                },
                //租户信息
                userMsg: ''
            }
        },

        methods: {
            //获得部门信息
            getDepartment() {
                this.dialogMsg.dialogVisible = true;
                // this.dialogMsg.data = row;
            },
            //关闭弹窗
            closeDialog(val) {
                this.dialogMsg.dialogVisible = false;
                if (val === 'update') {

                }

            },
            //租户信息
            getUserMsg() {
                this.userMsg = this.department1;
                if (this.department2) {
                    this.userMsg = this.department2;
                }
            },

        },
        created() {
            this.getUserMsg();
        },
        mounted() {

        }
    }
</script>

<style lang="scss" scoped>
    .container {
        .link-wrap {
            position: absolute;
            position: absolute;
            top: 30px;
            right: 50px;
            font-size: 16px;
            cursor: pointer;
            .link-text {
                margin-right: 10px;
            }
        }
        .main-wrap {
            position: absolute;
            top: 40%;
            left: 33%;
            width: 673px;
            height: 300px;
            .title {
                font-size: 20px;
                color: #42cff3;
                letter-spacing: 0;
                margin-bottom: 30px;
            }
            .date {
                font-size: 28px;
                font-weight: 600;
                color: #64eaf5;
                margin-bottom: 15px;
                .stress {
                    margin-left: 5px;
                    font-size: 50px;
                    color: #42cff3;
                    letter-spacing: 0;
                    background: -webkit-linear-gradient(
                        left,
                        #59e2ff 0%,
                        #d51bcc 100%
                    );

                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }
            .name {
                font-size: 46px;
                font-weight: 600;
                color: #64eaf5;
                .stress {
                    color: #fff;
                    margin-left: 5px;
                }
            }
            .yw-select-wrap {
                margin-top: 30px;
                margin-left: 80px;
            }
        }
    }
</style>
