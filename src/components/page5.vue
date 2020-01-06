
<template>
  <div class="container clearfix">
    <section class="log-wrap">
      <i class="logo"></i>
      <span class="title">租户IT云资源使用情况</span>
      <span class="date">截至2019年12月底</span>
    </section>
    <section class="flag-wrap">信息技术中心-管理信息系统部</section>
    <section class="main-wrap">
      <div class="main">
        <div class="left">
          <div class="title-wrap">
            <p class="title">2019年工单总数</p>
            <p class="num">443 <span class="cell">条</span></p>
            <div :id="leftDatas.id"
                 style="width: 90%;height: 500px;margin: 80px 0 50px 50px;">暂无</div>
          </div>
        </div>
        <div class="right">
          <p class="title">各月份工单数量统计</p>
          <div :id="rightDatas.id"
               style="width: 90%;height: 500px;margin: 80px 0 50px 50px;">暂无</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ChartOption from '../utils/chartOption.js'
import DrawChart from '../utils/drawCharts.js'

export default {
  name: 'page3',
  mixins: [DrawChart],
  components: {

  },
  data () {
    return {
      leftDatas: { id: 'page5-1', chartOption: 'pie-option', chartDatas: [], total: 0 },
      rightDatas: { id: 'page5-2', chartOption: 'line-option', chartDatas: [] },
    }
  },

  methods: {
    //获得数据
    getDatas () {
      this.leftDatas.total = '443条';
      this.leftDatas.chartDatas = [
        {
          name: '裸金属',
          value: 8065571.67,
        },
        {
          name: '云主机',
          value: 939517.28,
        },
        {
          name: '存储',
          value: 939517.28,
        },
      ];
      this.drawCharts(this.leftDatas);

      this.rightDatas.chartDatas = [
        {
          name: '2019.01',
          value: 643937.13
        },
        {
          name: '2019.02',
          value: 743937.13
        },
        {
          name: '2019.03',
          value: 843937.13
        },
        {
          name: '2019.04',
          value: 643937.13
        },
        {
          name: '2019.05',
          value: 743937.13
        },
        {
          name: '2019.06',
          value: 643937.13
        },
        {
          name: '2019.07',
          value: 743937.13
        },
        {
          name: '2019.08',
          value: 843937.13
        },
        {
          name: '2019.09',
          value: 643937.13
        },
        {
          name: '2019.10',
          value: 743937.13
        },
        {
          name: '2019.11',
          value: 643937.13
        },
        {
          name: '2019.12',
          value: 743937.13
        },
      ];
      this.drawCharts(this.rightDatas);
    },

    //绘制图表
    drawCharts (subItem) {
      this.$nextTick(() => {

        let myChart = echarts.init(document.getElementById(subItem.id));
        myChart.clear();

        // 数据格式处理
        switch (subItem.chartOption) {
          case 'pie-option':
            this.drawPie(myChart, subItem);
            break;
          case 'line-option':
            this.drawLine(myChart, subItem);
            break;
        }

      })

    },
    drawPie (myChart, subItem) {
      // 数据格式处理
      let option = JSON.parse(JSON.stringify(ChartOption[subItem.chartOption]))
      let chartDatas = JSON.parse(JSON.stringify(subItem.chartDatas))
      let colorSource = ChartOption['color-option']['linearColor']
      let colors = [colorSource.pieBlue, colorSource.piePurple, colorSource.pieGreen];

      option.title.show = true
      option.title.text = ''
      option.title.subtext = `${this.leftDatas.total}`
      option.title.x = '60%'
      option.title.y = '45%'
      option.series[0] = JSON.parse(JSON.stringify(option.series[0]));
      option.series[0].startAngle = 0;
      option.legend.data = ['裸金属', '云主机', '存储'];

      option.legend.formatter = (params) => {
        let value = chartDatas.find(value => value.name == params).value;
        let text = `${params}${'  '}${value}条`;
        // let colors = [colorSource.pieBlue[0].color, colorSource.piePurple[0].color, colorSource.pieGreen[0].color];
        // let flag = `<span style="display:inline-block;vertical-align:middle;margin-right:3px;width:5px;height:5px;border-radius:100%;background:${colors[params.dataIndex]};"></span>`;
        // let value = `<span style="margin-left:8px;">${params.percent}%，${params.value}元</span>`
        // let text = `${flag}${params.name}消费：<br/>${value}`;
        // return text;
        return text;
      }

      option.tooltip.formatter = (params) => {
        let colors = [colorSource.pieBlue[0].color, colorSource.piePurple[0].color, colorSource.pieGreen[0].color];
        let flag = `<span style="display:inline-block;vertical-align:middle;margin-right:3px;width:5px;height:5px;border-radius:100%;background:${colors[params.dataIndex]};"></span>`;
        let value = `<span style="margin-left:8px;">${params.percent}%，${params.value}条</span>`
        let text = `${flag}${params.name}：<br/>${value}`;
        return text;
      }

      option.series[0].data = chartDatas.map((item, index) => {
        let colorIndex = (index) % (Object.values(colors).length);
        return {
          name: item.name,
          value: item.value,
          label: {
            color: (Object.values(colors)[colorIndex][1].color),
            formatter: function (params) {
              let text = `${params.percent}%\n${params.value}元`;
              return text;

            }
          },
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0, // 由上至下
              x2: 0,
              y2: 1,
              colorStops: (Object.values(colors)[colorIndex])
            }
          }

        }
      })

      myChart.setOption(option)

      // resize自适应
      this.setResizeFun(myChart)
    },
    drawLine (myChart, subItem) {
      //数据格式处理
      let option = JSON.parse(JSON.stringify(ChartOption[subItem.chartOption]));
      let chartDatas = JSON.parse(JSON.stringify(subItem.chartDatas));
      let colors = ChartOption['color-option']['linearColor'];

      option.yAxis.name = '（元）';
      // option.title.show = true;
      // option.title.text = ``;
      // option.title.subtext = '（元）';

      option.series[0] = JSON.parse(JSON.stringify(option.series[0]));
      option.legend.data = [''];
      option.series[0].lineStyle.color.colorStops = colors.blue;

      option.tooltip.formatter = (params) => {
        let flag = `<span style="display:inline-block;vertical-align:middle;margin-right:3px;width:4px;height:4px;border-radius:100%;background:#fff;"></span>`;
        let text = `${flag}${params[0].name}：<br/><span style="margin-left:7px;">${params[0].value}条</span>`;
        return text;
      }

      option.series[0].data = chartDatas.map((item) => {
        return item.value;
      });
      option.xAxis.data = chartDatas.map((item) => {
        return item.name;
      });

      myChart.setOption(option, true);

      //resize自适应
      this.setResizeFun(myChart);
    }
  },
  mounted () {
    this.getDatas();
  }
}
</script>

<style lang="scss" scoped>
.main-wrap {
  padding: 50px 70px 20px 50px;
  .main {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .left {
      width: 44%;
      height: 742px;
      background: rgba(24, 19, 109, 0.95);
      .title-wrap {
        width: 737px;
        height: 116px;
        background: url(../assets/img/bg.png) no-repeat;
        margin: 20px 0 0 25px;
        .title {
          font-size: 18px;
          color: #ffffff;
          letter-spacing: 0;
          padding: 20px 0 0 20px;
        }
        .num {
          font-size: 38px;
          color: #ffffff;
          letter-spacing: 0;
          text-align: center;
          margin-top: -10px;
        }
        .cell {
          font-size: 18px;
          color: #fff;
          letter-spacing: 0;
        }
      }
    }
    .right {
      width: 54.5%;
      height: 742px;
      background: rgba(24, 19, 109, 0.95);
      .title {
        font-size: 18px;
        color: #ffffff;
        letter-spacing: 0;
        padding: 30px 0 0 50px;
      }
    }
  }
}
</style>
