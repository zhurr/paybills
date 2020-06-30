
<template>
    <div class="home"
         style="position:relative;width:100%;min-height:100%;">
        <page1></page1>
        <!-- <router-view></router-view> -->
    </div>
</template>

<script>

    export default {
        name: 'pool-home',
        components: {
            page1: () => import('./page1.vue'),
        },
        data() {
            return {

            }
        },

        methods: {

        },

        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
    .yw-select-wrap {
        position: absolute;
        left: 48%;
        width: 300px;
        top: 55%;
        z-index: 999;
        margin-left: -230px;
        .yw-select {
            width: 100%;
        }
    }
</style>
