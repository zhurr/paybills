/** 模块空数据展示**/
export default {

    data() {
        return {
            showEmptyDatas: {
                show: false,
                content: '性能数据正在计算中'
            },
        }
    },

    methods: {

        //内容为空判断
        changeEmptyDatas(show = false, content = '') {
            this.showEmptyDatas.show = show;
            if (content) {
                this.showEmptyDatas.content = content;
            }
        },
    },

    mounted() { },

}