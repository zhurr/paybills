
<template>
    <div class="component-wrap">
        <section class="title-link-wrap clearfix">
            <YwTitleTab @changeTitle="changeTitle"
                        :tabActive="activeFilterTitle"
                        :tabDatas="filterTitle"></YwTitleTab>
        </section>
        <section class="component-main">
            <section class="total-wrap">
                <div class="total-item"
                     style="width:100%">
                    <div class="total-num-wrap">
                        <p class="total-num">网络设备总量<span class="cell">（台）</span><span class="total-order">{{totalDatas.total.num}}</span></p>

                    </div>

                </div>
            </section>
            <div class="detail-list">
                <div class="detail-item"
                     v-for="(item,index) in totalDatas.list"
                     :key="index">
                    <div class="detail-left">
                        <i class="detail-img"></i>
                    </div>
                    <div class="detail-right">
                        <p class="num">{{item.num}}</p>
                        <p class="text">{{item.name}}</p>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import { xMonth } from '@/utils/filter.js'

    export default {
        props: ['moduleData'],
        components: {
            YwTitleTab: () => import('@/components/yw-title-tab.vue'),
            YwProgress: () => import('@/components/yw-progress.vue'),
            YwNumUpDown: () => import('@/components/yw-num-UpDown.vue'),
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
                //标题filter
                filterTitle: [{ name: '网络资源', label: '网络资源' }],
                activeFilterTitle: '网络资源',
                totalDatas: {
                    total: {
                        name: '网络设备总量(台)',
                        num: '0'
                    },
                    list: [
                        {
                            name: '已建设备(台)',
                            num: 0,
                        },
                        {
                            name: '在建设备(台)',
                            num: 0,
                        }
                    ]
                }
            }
        },

        methods: {
            //标题tab
            changeTitle(val) {
                this.activeFilterTitle = val;
            },
            //获得统计数据
            getTotalDatas() {
                let params = {
                    "idcType": this.moduleData.pool,
                    "month": this.moduleData.monthlyTime,
                };

                this.$axios.get('/v1/cmdb/monthReport/countNetworkResource', { params: params }).then((res) => {
                    this.totalDatas.total.num = (res.data[this.totalDatas.total.name] || 0) + ''
                    this.totalDatas.list.forEach((item) => {
                        item.num = res.data[item.name] || 0;
                    })
                });
            },
            init() {
                this.getTotalDatas()
            }

        },

        mounted() {
            this.init()
        }
    }
</script>

<style lang="scss" scoped>
    .component-wrap {
        width: 100%;
        height: 300px;
        padding: 0 40px;
        .title-link-wrap {
            min-height: 36px;
            .yw-select {
                position: absolute;
                top: 20px;
                left: 20px;
            }
        }
        .component-main {
            .part-wrap {
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                .part-left {
                    display: flex;
                    flex-flow: column;
                    flex-wrap: nowrap;
                    justify-content: space-between;
                }
            }
        }
        .num-wrap {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            .total-item-per {
                height: 94px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.2);
                text-align: center;
                .per-num {
                    font-size: 16px;
                    margin: 20px 0 10px 0;
                }
                .per-text {
                    font-size: 14px;
                }
            }
        }

        .total-wrap {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            width: 100%;
            height: 80px;
            background: #2d72fd;
            margin-bottom: 20px;
            .total-item {
                width: 50%;
                display: flex;
                justify-content: space-between;
                &:before {
                    content: "";
                    display: inline-block;
                    width: 1px;
                    height: 60px;
                    background: linear-gradient(#1ff9d7 0%, #0854ff 100%);
                    margin-top: 5px;
                }
                &:first-of-type {
                    &:before {
                        display: none;
                    }
                }
                &:nth-of-type(2) {
                    padding: 16px;
                }
                .total-item-per {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    text-align: center;
                    .per-num {
                        font-size: 16px;
                        margin: 10px 0;
                    }
                    .per-text {
                        font-size: 14px;
                    }
                }
                .total-num-wrap {
                    padding: 0 0 0 30px;
                    .total-num {
                        font-size: 16px;
                        line-height: 80px;
                        .cell {
                            font-size: 12px;
                        }
                    }
                    .total-order {
                        font-size: 20px;
                        margin-left: 10px;
                        .order-num {
                            display: inline-block;
                            width: 35px;
                            height: 48px;
                            line-height: 48px;
                            background: url(../../assets/img/bg_number.png)
                                no-repeat;
                            background-size: contain;
                            font-size: 30px;
                            text-align: center;
                            margin-right: 10px;
                        }
                    }
                }
            }
        }
        .detail-list {
            .detail-item {
                display: inline-block;
                margin-top: 20px;
                margin-right: 50px;
                .detail-left {
                    display: inline-block;
                    vertical-align: middle;
                    width: 32px;
                    height: 32px;
                    border-radius: 100%;
                    background: rgba(255, 255, 255, 0.2);
                    margin-right: 15px;
                    text-align: center;
                    .detail-img {
                        display: inline-block;
                        width: 32px;
                        height: 32px;
                        background: url(../../assets/img/file.png) no-repeat;
                        background-size: contain;
                    }
                }
                .detail-right {
                    display: inline-block;
                    vertical-align: middle;
                    .num {
                        font-size: 16px;
                        color: #ffe873;
                    }
                    .text {
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.8);
                    }
                }
            }
        }
    }
</style>
