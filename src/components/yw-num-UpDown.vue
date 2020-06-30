<template>
    <div class="yw-num-UpDown">
        <span class="down"
              :style="styleDown"
              v-if="datas<0"><i class="arrow">↓</i>{{-datas}}%</span>
        <span class="up"
              :style="styleUp"
              v-else><i class="arrow">↑</i>{{datas}}%</span>
    </div>
</template>
<script>
    export default {
        props: ['datas', 'options'],
        components: {

        },
        data() {
            return {

            }
        },
        computed: {
            styleDown() {
                let obj = {
                    color: this.options.color ? '#ff5136' : '',
                    background: this.options.background ? '#ff5136' : '',
                }
                return obj
            },
            styleUp() {
                let obj = {
                    color: this.options.color ? '#0dbe9c' : '',
                    background: this.options.background ? '#0dbe9c' : '',
                }
                return obj
            }
        },
        methods: {

        },
        mounted() {

        }

    }
</script>
<style lang="scss" scoped>
    .yw-num-UpDown {
        display: inline-block;
        font-size: 12px;
    }
</style>
