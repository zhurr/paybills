<template>
    <!-- 租户(内部、外部租户) -->
    <div class="yw-tenant-wrap">
        <!-- 边框型 -->
        <section class="yw-tenant-border"
                 style="min-width:110px"
                 v-if="options && options.type ==='border'">
            <p class="tenant-item">
                <el-tooltip effect="dark"
                            popper-class="yw-tooltip-dark"
                            :content="tenantDatas.name"
                            placement="right-start">
                    <i class="tenant-img"
                       :class="{outer:tenantDatas.name ==='外部租户'}"></i>
                </el-tooltip>
                <span class="tenant-num">{{tenantDatas.num}}%</span>
                <sup class="change"
                     v-if="Number(tenantDatas.change) >=0"><i class="arrow">↑</i>{{tenantDatasChange}}% </sup>
                <sup class="change down"
                     v-else><i class="arrow">↓</i>{{tenantDatasChange}}% </sup>
            </p>
        </section>
        <!-- 边框型 -->

        <!-- 平铺型 -->
        <section class="yw-tenant-flat"
                 v-else>
            <p class="tenant-item"
               style="margin-right:10px;">
                <el-tooltip effect="dark"
                            popper-class="yw-tooltip-dark"
                            content="内部租户"
                            placement="right-start">
                    <i class="tenant-img"></i>
                </el-tooltip>

                <span class="tenant-num"
                      v-html="tenantDatas.userInner"></span>
            </p>
            <p class="tenant-item">
                <el-tooltip effect="dark"
                            popper-class="yw-tooltip-dark"
                            content="外部租户"
                            placement="right-start">
                    <i class="tenant-img img-outer"></i>
                </el-tooltip>
                <span class="tenant-num"
                      v-html="tenantDatas.userOuter"></span>
            </p>
        </section>
        <!-- 平铺型 -->
    </div>

</template>
<script>
    import { fixedNumber, divisionNumber, subNumber } from '@/utils/filter.js'
    export default {
        props: ['tenantDatas', 'options'],
        components: {

        },
        data() {
            return {

            }
        },
        computed: {
            tenantDatasChange() {
                if (Number(this.tenantDatas.change) >= 0) {
                    return fixedNumber(this.tenantDatas.change, 2)
                } else {
                    return fixedNumber(-this.tenantDatas.change, 2)
                }
            }
        },
        methods: {

        },
        mounted() {

        }

    }
</script>
<style lang="scss" scoped>
    .yw-tenant-flat {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        padding: 0 10px;

        .tenant-item {
            .tenant-img {
                display: inline-block;
                vertical-align: middle;
                width: 18px;
                height: 18px;
                background: url("~@/assets/img/inner.png") no-repeat;
                background-size: contain;
                margin-right: 10px;

                &.img-outer {
                    background: url("~@/assets/img/outer.png") no-repeat;
                    background-size: contain;
                }
            }

            .tenant-num {
                display: inline-block;
                vertical-align: middle;
                font-size: 14px;
                color: rgba(255, 255, 255, 0.6);
            }
        }
    }

    .yw-tenant-border {
        position: relative;
        display: inline-block;
        width: 140px;
        height: 30px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);

        .tenant-img {
            position: absolute;
            top: -10px;
            left: -10px;
            width: 18px;
            height: 18px;
            background: url(../assets/img/inner.png) no-repeat;
            background-size: contain;
            &.outer {
                background: url(../assets/img/outer.png) no-repeat;
                background-size: contain;
            }
        }
        .tenant-num {
            line-height: 30px;
            margin: 0 0 0 15px;
            font-size: 16px;
            color: #ffffff;
        }
        .change {
            .arrow {
                display: inline-block;
                vertical-align: middle;
            }
        }
    }
</style>
