export default {
    // 通用查询条件
    data() {
        return {
            // 分页
            currentPage: 1, // 当前页
            pageSize: 100, // 分页每页多少行数据
            pageSizes: [10, 20, 50, 100], // 每页多少行数组
            total: 0, // 总共多少行数据

            //全屏loading
            fullScreenLoading: false,
            //局部loading(需要在页面v-if)
            loading: false,
        }
    },
    methods: {
        /**查询
         * keepParams:是否要保持查询条件
         */
        query(keepParams) {

        },

        /**文件导出
         * obj:{
         * data:数据源
         * fileType:文件类型,
         * fileName:文件名称
         * }
         */
        exportFiles(obj) {
            if (!obj) {
                return 0;
            }
            let blob = new Blob([obj.data], {
                type: obj.fileType
            })
            let objectUrl = window.URL.createObjectURL(blob)
            let downLoadElement = document.createElement('a')
            downLoadElement.href = objectUrl
            downLoadElement.download = obj.fileName
            document.body.appendChild(downLoadElement)

            downLoadElement.click()
            document.body.removeChild(downLoadElement)
            URL.revokeObjectURL(objectUrl)
        },

        //第一页
        initPageChange() {
            this.currentPage = 1;
            return this.currentPage;
        },

        //每页展示条数
        handleSizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
            // console.log(`每页数据条数： ${this.currentPage} `);
            this.query(true);
        },
        //当前页
        handleCurrentChange(val) {
            this.currentPage = val;
            // console.log(`当前页: ${this.pageSize}`);
            this.query(true);
        },

        //打开全屏加载条
        showFullScreenLoading(obj) {
            this.fullScreenLoading = this.$loading({
                lock: true,
                text: obj && obj.text ? obj.text : '正在查询数据, 请稍等...',
                spinner: 'el-icon-loading'
            })
        },
        //关闭全屏加载条
        closeFullScreenLoading() {
            this.fullScreenLoading.close()
        },
        //打开局部加载条
        showLoading() {
            this.loading = true
        },
        //关闭局部加载条
        closeLoading() {
            this.loading = false
        }

    },


}