  /** 模块空数据展示**/
  export default {

    data() {
      return {
        showEmptyDatas: {
          show: false,
          content: ''
        },
      }
    },
    computed: {

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

    mounted() {},

  }