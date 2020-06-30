<template>
    <!-- 进度条(单段) -->
    <div class="yw-progress-box">
        <YwProgress :datas="{percentage:progressDatas.percent,index:''}"
                    :option="progressOption"></YwProgress>
        <p class="progress-content-down clearfix">
            <span class="name text-ellipse"
                  :title="progressDatas.name"
                  v-html="progressDatas.name"></span>
            <span class="name text-ellipse fr"
                  style="text-align:right"
                  :title="progressDatas.num"
                  v-html="progressDatas.num"></span>
        </p>
    </div>

</template>
<script>
    export default {
        props: ['progressDatas'],
        components: {
            YwProgress: () => import('@/components/yw-progress.vue'),
        },
        data() {
            return {
                progressOption: {
                    label: {
                        //位置
                        position: 'outer',//['outer','inner']
                        //百分比
                        percentage: {
                            show: false
                        },
                    }
                },
            }
        },
        computed: {

        },
        methods: {

        },
        mounted() {

        }

    }
</script>
<style lang="scss" scoped>
    .yw-progress-box {
        width: 100%;
        height: 62px;
        padding: 15px 30px;
    }
</style>
