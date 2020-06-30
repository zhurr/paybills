<template>
    <!-- 标题型tab -->
    <div class="yw-yw-title-tab-wrap">
        <section class="yw-title-tab underline"
                 v-if="options && options.type === 'underline'">
            <span class="tab-text"
                  v-for="(item,index) in tabDatas"
                  :key="index"
                  :class="{'active':tabActive === item.label}"
                  @click="changeTab(item.label)">{{item.name}}</span>
        </section>

        <section class="yw-title-tab"
                 v-else>
            <img class="tab-img"
                 src="../assets/img/line-left.png"
                 alt="">
            <span class="tab-text"
                  v-for="(item,index) in tabDatas"
                  :key="index"
                  :class="{'active':tabActive === item.label}"
                  @click="changeTab(item.label)">{{item.name}}</span>
            <img class="tab-img"
                 src="../assets/img/line-right.png"
                 alt="">
        </section>
    </div>

</template>
<script>
    export default {
        props: ['tabDatas', 'tabActive', 'options'],
        data() {
            return {

            }
        },

        methods: {

            //tab切换
            changeTab(val = '') {
                this.$emit('changeTitle', val);
            },
        },
        mounted() {

        }

    }
</script>
<style lang="scss" scoped>
    .yw-title-tab {
        display: inline-block;
        font-size: 16px;
        .tab-img {
            display: inline-block;
            vertical-align: middle;
            &:first-of-type {
                margin-right: 20px;
            }
            &:last-of-type {
                margin-left: 20px;
            }
        }
        .tab-text {
            position: relative;
            color: #8b89b0;
            cursor: pointer;
            margin-right: 25px;
            &:last-of-type {
                margin-right: 0;
            }
            &.active {
                color: #fff;
            }
        }
        &.underline {
            .tab-text {
                &.active {
                    &:after {
                        content: "";
                        position: absolute;
                        top: 30px;
                        left: 50%;
                        margin-left: -10px;
                        display: inline-block;
                        width: 20px;
                        height: 4px;
                        background: url(../assets/img/line-left.png) no-repeat;
                        background-size: contain;
                    }
                }
            }
        }
    }
</style>
