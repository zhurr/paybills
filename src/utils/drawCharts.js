  /** 绘制图表常用方法**/
  export default {
    props: {
      // 图表全局查询条件（来自父元素）
      conditionParams: {
        type: Object,
        default () {
          return {}
        }
      }
    },

    data() {
      return {
        // 自适应对象
        resizeFun: ''
      }
    },
    computed: {
      // 排行榜字体颜色设置
      rankColor() {
        return function (index) {
          let obj = 'color-base';
          switch (index) {
            case 1:
              obj = 'color-red';
              break;
            case 2:
              obj = 'color-orange';
              break;
            case 3:
              obj = 'color-yellow';
              break;
              // case 4:
              //     obj = 'color-blue';
              //     break;
            default:
              obj = 'color-base';
              break;
          }
          return obj
        }
      },
    },

    methods: {
      // 设置需要自适应的图表对象
      setResizeFun(chartObj) {
        this.resizeFun = function () {
          chartObj.resize()
        }
        this.resizeChart()
      },

      // 图表自适应
      resizeChart() {
        window.addEventListener('resize', this.resizeFun)
      },
      // 取消图表自适应
      removeResizeChart() {
        if (this.resizeFun) {
          window.removeEventListener('resize', this.resizeFun)
        }
      },
    },

    mounted() {},

    destroyed() {
      this.removeResizeChart()
    }

  }