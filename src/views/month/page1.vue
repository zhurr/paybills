
<template>
    <div class="container clearfix">
        <section class="log-wrap">
            <logo></logo>
        </section>
        <department></department>
        <section class="main-wrap">
            <p class="title">Hi,{{userMsg}}</p>
            <!-- <span class="date">{{monthlyTime.split('-')[0]}}年<span class="stress">{{monthlyTime.split('-')[1]}}月份</span></p> -->
            <p class="name">
                一级IT云资源池租户运营<span class="text">月报</span>
                <!-- <span class="stress">出炉了</span> -->
            </p>
        </section>
        <!--  <section class="footer-wrap">Copyright©-2019 中国移动IT云 版权所有</section> -->
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    // import { ITdepartments } from '@/config/role.js'
    export default {
        name: 'page1',
        components: {
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
                //租户信息
                userMsg: ''
            }
        },

        methods: {
            //租户信息
            getUserMsg() {
                this.userMsg = this.department1;
                if (this.department2) {
                    this.userMsg = this.department2;
                }
            },
            getDatas() {

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
    .main-wrap {
        position: absolute;
        top: 30%;
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
                background: -webkit-linear-gradient(left, #59e2ff 0%, #d51bcc 100%);

                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
        .name {
            font-size: 46px;
            font-weight: 600;
            color: #64eaf5;
            .text {
                background: -webkit-linear-gradient(left, #59e2ff 0%, #d51bcc 100%);

                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
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
</style>
