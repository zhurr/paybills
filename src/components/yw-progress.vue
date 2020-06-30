<template>
    <!-- 进度条 -->
    <section class="yw-progress"
             :class="{'percent_outer':option.label.percentage.show}">
        <el-progress :percentage="datasPercentage"
                     :show-text="option.label.percentage.show"
                     :stroke-width="8"
                     :class="rankBgColor(datas.index)"
                     :style="option.style"></el-progress>
    </section>

</template>
<script>
    import { fixedNumber, divisionNumber } from '@/utils/filter.js'
    export default {
        props: {
            //数据
            datas: {
                type: [Object, Array],
                default: function () {
                    return {
                        percentage: 0,
                        index: -1
                    }
                }
            },
            //配置
            option: {
                type: Object,
                default: function () {
                    return {
                        //标签
                        label: {
                            //位置
                            position: 'outer',//['outer','inner']
                            //百分比
                            percentage: {
                                show: true
                            },
                        }
                    }
                }
            }
        },
        data() {
            return {
            }
        },
        computed: {
            //百分比数据封装
            datasPercentage() {
                // return fixedNumber(this.datas.percentage, 2)
                return Number(this.datas.percentage || 0)
            },
            // 排行榜字体颜色设置
            rankColor() {
                return function (index) {
                    let obj = 'color-base';
                    switch (index) {
                        case 1:
                            obj = 'color-red';
                            break;
                        case 2:
                            obj = 'color-orange';
                            break;
                        case 3:
                            obj = 'color-yellow';
                            break;
                        // case 4:
                        //   obj = 'color-blue';
                        //   break;
                        default:
                            obj = 'color-base';
                            break;
                    }
                    return obj
                }
            },
            // 进度条背景色颜色设置
            rankBgColor() {
                return function (index = 'yellow') {
                    return index;
                }
            },
        },

        methods: {

        },
        mounted() {

        }

    }
</script>
<style lang="scss" scoped>
</style>
