  /** echarts图表option配置**/
  export default {
    // 颜色系列
    'color-option': {
      // 渐变由深至浅[蓝、浅蓝、绿、浅绿、黄、橙、红、紫、青]
      linearColor: {
        blue: [{
            offset: 0,
            color: '#0D7EF4' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#0D7EF4' // 100% 处的颜色
          }
        ],
        pieBlue: [{
            offset: 0,
            color: '#0099FF' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#0099FF' // 100% 处的颜色
          }
        ],
        piePurple: [{
            offset: 0,
            color: '#9723F3' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#9723F3' // 100% 处的颜色
          }
        ],
        pieGreen: [{
            offset: 0,
            color: '#08CE86' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#08CE86' // 100% 处的颜色
          }
        ],




      },
    },
    // 漏斗
    'funnel-option': {
      textStyle: {
        color: '#CFD1DF',
        fontSize: 14
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}',
        confine: true
      },
      calculable: true,
      series: [{
        name: '漏斗图',
        type: 'funnel',
        left: '30%',
        top: 20,
        bottom: 20,
        width: '55%',
        // min: 0,
        // max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 0, // 图形间距
        label: {
          show: true,
          position: 'left'
        },
        labelLine: {
          show: false,
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: { // 图形样式
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 2
        },
        emphasis: {
          label: {
            fontSize: 18
          }
        },
        data: [{
            value: 60,
            name: '暂无1',
            itemStyle: { // 图形
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: '#0084FF' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#33B5FF' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          },
          {
            value: 40,
            name: '暂无2'
          },
          {
            value: 20,
            name: '暂无3'
          }

        ]
      }, {
        name: '漏斗图',
        type: 'funnel',
        left: '30%',
        top: 20,
        bottom: 20,
        width: '55%',
        // min: 0,
        // max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 1, // 图形间距
        label: {
          show: true,
          position: 'right',
          formatter: '{c}'
        },
        labelLine: {
          show: false,
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: { // 图形样式
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 2,
          opacity: 0,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#0084FF' // 0% 处的颜色
            }, {
              offset: 1,
              color: '#33B5FF' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
        emphasis: {
          label: {
            fontSize: 16
          }
        },
        data: [{
            value: 60,
            name: '暂无1'
          },
          {
            value: 40,
            name: '暂无2'
          },
          {
            value: 20,
            name: '暂无3'
          }
        ]
      }]
    },

    // 仪表盘
    'gauge-option': {
      title: {
        // show: false
      },
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      tooltip: {
        confine: true,
        // formatter: "{a} <br/>{b} : {c}%"
        formatter: '{a}',
        confine: true
      },
      grid: {

      },
      series: [{
        name: '名称',
        type: 'gauge',
        radius: '80%',
        axisLine: { // 坐标轴线
          lineStyle: {
            width: 10,
            color: [
              [0.5, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ // 右/下/左/上
                  offset: 0,
                  color: '#0249CB'
                },
                {
                  offset: 1,
                  color: '#006CFF'
                }
              ])],
              [1, '#6F7B93']
            ]
          }
        },
        axisLabel: { // 刻度标签
          show: false
        },
        startAngle: 215,
        endAngle: -35,
        // splitNumber: 5,
        splitLine: { // 分割线
          length: 12,
          lineStyle: {
            width: 1
          }
        },
        axisTick: { // 刻度
          lineStyle: {
            color: '#fff'
          }
        },
        pointer: { // 指针
          width: 4
        },
        itemStyle: { // 指针样式
          color: '#B4D7F9'
        },
        markPoint: { // 图表备注
          label: {
            show: false
          }
        },
        detail: {
          color: '#fff',
          fontSize: 12,
          formatter: '{value}%',
          height: 140,
          offsetCenter: [0, 90],
          rich: {
            detailName: {
              fontSize: 12
            },
            maxRateName: {
              fontSize: 12,
              color: '#fff'
            },
            maxRate: {
              fontSize: 20,
              color: '#52C4FF'
            },
            avgRate: {
              fontSize: 12,
              color: '#52C4FF'
            },
            avgRateName: {
              fontSize: 12,
              color: '#fff'
            },
            rateCell: {
              fontSize: 10,
              color: '#52C4FF'
            }
          }
        },
        data: [{
          value: 50, // 50%
          name: '占比',
          detail: {
            color: '#fff',
            fontSize: 12
          }
        }]
      }]
    },

    // 饼图
    'pie-option': {
      textStyle: {
        color: '#B3B1CF',
        fontSize: 14
      },
      title: {
        show: false,
        text: '标题',
        subtext: '子标题',
        textStyle: {
          fontSize: 20,
          color: '#2D72FD'
        },
        subtextStyle: {
          fontSize: 20,
          color: '#2D72FD'
        },
        textAlign: 'center',
        x: '50%',
        y: '50%'
      },
      tooltip: {
        trigger: 'item',
        confine: true,
        textStyle: {
          fontSize: 14,
        },
        // formatter: function (param) {
        //   return param
        // },
      },
      legend: {
        show: true,
        top: 'middle',
        left: 0,
        // right: 5,
        // bottom: 0,
        icon: 'circle',
        itemWidth: 13,
        itemHeight: 13,
        orient: 'vertical',
        padding: [5, 5, 20, 5],
        formatter: function (param) {
          return param
        },
        textStyle: {
          color: '#fff',
          fontSize: '14px',
          rich: {
            name: {
              fontSize: 14,
              padding: [0, 5, 0, 0]
            },
            num: {
              fontSize: 14,
              color: '#1690ED'
            },
            date: {
              fontSize: 14,
              color: '#FF1C5C'
            }
          }
        },
        data: ['名称']

      },
      grid: {

      },
      series: [{
        name: '名称',
        type: 'pie',
        radius: ['30%', '50%'], // 圆环半径
        center: ['60%', '50%'], // 圆心位置
        startAngle: 90,
        label: {
          formatter: '{b}\n{d}%',
          rich: {

          },
          color: '#fff',
          fontSize: 14,
          align: 'center'
        },
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 1, // 由下至上
            x2: 0,
            y2: 0,
            colorStops: [{
                offset: 0,
                color: '#4D4D67' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#4D4D67' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        selectedOffset: 5,
        data: [{
          value: 0, // 占比0%
          name: '暂无',
          label: {
            color: '#fff'
          },
          itemStyle: {
            color: '#fff'
          }
        }]
      }]
    },

    // 线图
    'line-option': {
      color: ['#fff'],
      textStyle: {
        color: '#817DB0',
        fontSize: 14
      },
      title: {
        // show: false,
        text: '',
        textStyle: {
          fontSize: 14,
          color: '#817DB0'
        },
        subtext: '',
        subtextStyle: {
          fontSize: 14,
          color: '#817DB0'
        }
      },
      tooltip: {
        trigger: 'axis',
        confine: true,
        // padding: [5, 10],
        axisPointer: {
          lineStyle: {
            color: 'rgba(255,255,255,0.36)'
          }
        },
        backgroundColor: '#0D7EF4',
        textStyle: {
          fontSize: 14,
        },
        formatter: function (param) {
          return param
        },
      },
      legend: {
        // show: false,
        top: 0,
        right: 10,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: '#fff',
          fontSize: '14px'
        },
        data: ['名称']
      },
      grid: {
        // left: 20,
        right: 40,
        // top: 40,
        // bottom: 10,
        // containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          // rotate: 30
        },
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#2A3E7A'
          }
        },
        data: ['暂无数据']
        // data: ['2019-02-14', '2019-02-15', '2019-02-16', '2019-02-17', '2019-02-18', '2019-02-19', '2019-02-20']
      },
      yAxis: {
        type: 'value',
        name: '',
        nameTextStyle: {},
        axisLine: {
          // show: false
          lineStyle: {
            color: '#2A3E7A'
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            // type: 'dashed',
            color: '#2A3E7A'
          }
        }
      },
      series: [{
        name: '名称',
        type: 'line',
        // smooth: true,
        showSymbol: false,
        itemStyle: {
          normal: {
            borderWidth: 4,
          },
          emphasis: {
            color: '#0D7EF4',
            borderColor: '#211E67'
          }
        },
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [{
                offset: 0,
                color: '#186FFF' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#3EAAF6' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }

        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0,
                color: '#1350AA' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#19126F' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        data: [0]
      }]
    },

    // 柱状图(左-右,下-上)
    'bar-option': {
      // 颜色系列[蓝、绿、红、紫]
      // color: ['#186FFF', '#31D550', '#FF4800', '#832EFA'],
      textStyle: {
        color: '#9597AB',
        fontSize: 14
      },
      title: {
        show: false,
        text: '',
        padding: [0, 0, 0, 0],
        textStyle: {
          fontSize: 14,
          color: '#CAF4FF'
        },
        subtext: '',
        subtextStyle: {
          fontSize: 14,
          color: '#fff'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        // formatter: '',
        confine: true
      },
      legend: {
        // show: false,
        top: 0,
        right: 10,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: '#fff',
          fontSize: '12px'
        },
        data: ['名称']
      },
      grid: {
        left: 10,
        right: 10,
        top: 40,
        bottom: 40,
        containLabel: true
      },
      dataZoom: [{
        'show': true,
        'height': 10,
        'xAxisIndex': [
          0
        ],
        bottom: 20,
        'start': 10,
        'end': 90,
        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '100%',
        handleStyle: {
          color: '#0079F5'
        },
        textStyle: {
          color: '#fff'
        },
        backgroundColor: '#042257',
        borderColor: '#042257',
        fillerColor: '#005ABB'
      }, {
        'type': 'inside',
        'show': true,
        'height': 15,
        'start': 1,
        'end': 35

      }],
      xAxis: {
        data: ['暂无数据'],
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#2D315F'
          }
        },
        axisLabel: {
          // rotate: 20
        }
      },
      yAxis: [{
          name: '',
          // name: '名称',
          // nameLocation: 'end',
          nameTextStyle: {
            fontSize: 14,
            color: '#fff',
            align: 'left',
            padding: [0, 0, 0, 0]
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#2d315f'
            }
          }
        }

      ],
      series: [{
        name: '名称',
        type: 'bar',
        label: {
          show: false,
          position: 'top',
          fontSize: 10
          // formatter: ''
        },
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 1, // 由下至上
            x2: 0,
            y2: 0,
            colorStops: [{
                offset: 0,
                color: '#3377FF' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#80E6FF' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
          // barBorderRadius: [4, 4, 0, 0] // 边角弧度
        },
        barWidth: 20,
        data: [0]
      }]
    },

    // 柱状图-线图
    'bar-line-option': {
      color: ['#0249CB', '#02BD6C'],
      textStyle: {
        color: '#9597AB',
        fontSize: 14
      },
      title: {
        show: false,
        text: '',
        padding: [0, 0, 0, 0],
        textStyle: {
          fontSize: 14,
          color: '#CAF4FF'
        },
        subtext: '',
        subtextStyle: {
          fontSize: 14,
          color: '#fff'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true
      },
      legend: {
        // show: false,
        // top: 0,
        // right: 10,
        // icon: 'circle',
        // itemWidth: 8,
        // itemHeight: 8,
        itemWidth: 14,
        itemHeight: 5,
        textStyle: {
          color: '#fff',
          fontSize: '12px'
        },
        // data: ['名称']
      },
      grid: {
        left: 10,
        right: 10,
        top: 50,
        bottom: 20,
        containLabel: true
      },
      dataZoom: [{
        'show': true,
        'height': 10,
        'xAxisIndex': [
          0
        ],
        bottom: 0,
        'start': 10,
        'end': 90,
        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '100%',
        handleStyle: {
          color: '#0079F5'
        },
        textStyle: {
          color: '#fff'
        },
        backgroundColor: '#042257',
        borderColor: '#042257',
        fillerColor: '#005ABB'
      }, {
        'type': 'inside',
        'show': true,
        'height': 15,
        'start': 1,
        'end': 35

      }],
      xAxis: {
        data: ['暂无数据'],
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#C1C6CC'
          }
        },
        axisLabel: {
          // rotate: 20,
          // interval: 0, //显示所有标签
        }

      },
      yAxis: [{
          name: '名称1',
          // min: 0,
          // max: 100,
          // interval: 5,
          splitNumber: 5,
          nameTextStyle: {
            fontSize: 14,
            color: '#fff',
            // align: 'left'
            padding: [0, 0, 0, 20]
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#2d315f'
            }
          }
        },
        {
          name: '名称2',
          nameTextStyle: {
            fontSize: 14,
            color: '#fff',
            // align: 'right',
            padding: [0, 0, 0, 0]
          },
          splitNumber: 5,
          // min: 0,
          // max: 100,
          // interval: 20,
          axisLabel: {
            formatter: '{value}%'
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#2d315f'
            }
          }
        }

      ],
      series: [{
        name: '名称',
        type: 'bar',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 1, // 由下至上
            x2: 0,
            y2: 0,
            colorStops: [{
                offset: 0,
                color: '#3377FF' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#80E6FF' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
          // barBorderRadius: [4, 4, 0, 0] // 边角弧度
        },
        barMaxWidth: 20,
        // barWidth: 20,
        // barGap: 20, //不同系列的柱间距离
        // barCategoryGap: 20, //同一系列的柱间距离
        data: [0]
      }, {
        name: '名称',
        type: 'line',

        yAxisIndex: 1, // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
        // smooth: true, //平滑曲线显示
        // showSymbol: false,
        // showAllSymbol: true, // 显示所有图形。
        symbol: 'circle', // 标记的图形为实心圆
        symbolSize: 6, // 标记的大小
        itemStyle: {
          borderColor: '#fff',
          // 折线拐点标志的样式
          color: '#FF7113'
        },
        lineStyle: {
          width: 2,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0,
                color: '#FFAA56' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#FFAA56' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        pointer: {
          width: 4
        },
        data: [0]
      }]
    }
  }