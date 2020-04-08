export default {
  // 通用查询条件
  data() {
    return {
      // 分页
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [10, 20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据

      staticCurrentPage: 1, //当前页(初始静态数据)
      staticPageSize: 50, //分页每页多少行数据(初始静态数据)
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

  },


}