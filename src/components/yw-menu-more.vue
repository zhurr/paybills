<template>
    <!-- 菜单：更多下拉框 -->
    <div class="menu-more">
        <section class="menu-header"
                 @click="toggleMenu">
            <span class="header-text">更多</span>
            <i class="el-icon-caret-bottom menu-arrow"
               v-if="!menuMore.listShow"></i>
            <i class="el-icon-caret-top menu-arrow"
               v-else></i>
        </section>
        <section class="menu-body"
                 v-if="menuMore.listShow">
            <div class="menu-close"
                 @click="closeMenu()"><i class="el-icon-close"></i></div>
            <vue-scroll style="width:100%;height:100%;"
                        :ops="ops1">
                <ul class="menu-list">
                    <li v-for="(item,index) in menuDatas.data"
                        class="menu-item"
                        @click="changeMenu(item)"
                        :class="{active:item.active}"
                        :key="index"><span class="menu-item-text"
                              v-if="item.label !== '总览'">{{item.name}}</span></li>
                </ul>
            </vue-scroll>
        </section>
    </div>

</template>
<script>
    import { fixedNumber, divisionNumber } from '@/utils/filter.js'
    export default {
        props: ['menuDatas'],

        data() {
            return {
                ops1: {
                    scrollPanel: {
                        scrollingX: false
                    }
                },
                // menuDatas: {
                //     show: false,
                //     data: [ //列表
                //         { name: '北京', label: 'beijing', active: false },
                //         { name: '江苏', label: 'jiangsu', active: true },
                //         { name: '上海', label: 'shanghai', active: false },
                //         { name: '成都', label: 'chengdu', active: false },
                //     ],
                // },

                //更多菜单
                menuMore: {
                    listShow: false,//是否显示列表
                }
            }
        },

        methods: {

            //显示隐藏
            toggleMenu() {
                this.menuMore.listShow = !this.menuMore.listShow
            },
            //切换选项
            changeMenu(val) {
                this.$emit('changeMenu', val);
                this.closeMenu()
            },
            //关闭
            closeMenu() {
                this.menuMore.listShow = false
            }
        },
        mounted() {

        }

    }
</script>
<style lang="scss" scoped>
    .menu-more {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        margin-left: 30px;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        &:hover {
            color: #fff;
        }
        .menu-header {
            font-size: 16px;

            header-text {
                display: inline-block;
                vertical-align: middle;
                margin-right: 2px;
            }
        }
        .menu-body {
            position: absolute;
            top: 30px;
            right: -5px;
            width: 365px;
            height: 100px;
            background: rgba(3, 8, 36, 0.8);
            padding: 10px;
            z-index: 99999;
            .menu-close {
                position: absolute;
                top: -15px;
                right: -15px;
                font-size: 14px;
            }

            .menu-list {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                .menu-item {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.5);
                    cursor: pointer;
                    &:hover,
                    &.active {
                        color: rgba(255, 255, 255, 1);
                    }
                    .menu-item-text {
                        margin: 5px 10px;
                    }
                }
            }
        }
    }
</style>
