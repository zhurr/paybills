<template>
    <!-- 进度条(多段) -->
    <div class="yw-progress-box yw-process-muti">
        <p class="progress-content-up clearfix">
            <span class="name text-ellipse"
                  style="color:#d8d7e6"
                  :title="progressDatas[0].name">{{progressDatas[0].name}}</span>
            <span class="name text-ellipse fr"
                  style="text-align:right;color:#d8d7e6;"
                  :title="progressDatas[1].name">{{progressDatas[1].name}}</span>
        </p>
        <section class="progress-wrap">
            <YwProgress :datas="{percentage:100,index:'yellow clip-right'}"
                        class="process-item"
                        :style="{width:Number(progressDatas[0].percent) + '%'}"
                        :option="progressOption"></YwProgress>
            <YwProgress :datas="{percentage:100,index:'blue clip-left'}"
                        class="process-item"
                        :style="{width:Number(progressDatas[1].percent) + '%'}"
                        :option="progressOption"></YwProgress>
        </section>
        <p class="progress-content-down clearfix">
            <span class="num text-ellipse"
                  style="color:#FFC233"
                  :title="progressDatas[0].num">{{progressDatas[0].num}}{{progressDatas[0].cell}}</span>
            <span class="num text-ellipse fr"
                  style="text-align:right;color:#1C77FF;"
                  :title="progressDatas[1].num">{{progressDatas[1].num}}{{progressDatas[1].cell}}</span>
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
    .yw-process-muti {
        .progress-content-up {
            margin-bottom: 5px;
        }
        .progress-content-down {
            margin-top: 5px;
            .num {
                font-size: 14px;
            }
        }
        .progress-wrap {
            position: relative;
            width: calc(100% + 16px);
            height: 8px;
            .process-item {
                display: inline-block;
                vertical-align: top;
                &:last-of-type {
                    margin-left: -16px;
                }
            }
        }
    }
</style>
