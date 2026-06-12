<template>
  <div
    ref="chart"
    class="chart-box"
    :style="{ transform: `scale(${scale})` }"
  ></div>
</template>

<script>
import scaleMixin from "@/mixins/scaleMixin"
import * as echarts from "echarts"
export default {
  mixins: [scaleMixin],
  name: "LeftBottom",
  props: {
    valueData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      colors: [
        "#14d8ff",
        "#ffee00",
        "#18d27c",
        "#14d8ff",
        "#ffee00",
        "#14d8ff",
        "#6b4dff",
        "#14d8ff",
      ],
      leftBottomXData: [
        "抗压指数",
        "记忆力指数",
        "适应力指数",
        "专注力指数",
        "自控力指数",
        "心理负荷指数",
        "情绪平衡指数",
        "情绪稳定指数",
      ],
      chart: null,
      resizeHandler: null,
    }
  },
  watch: {
    valueData: {
      deep: true,
      handler() {
        this.initChart()
      },
    },
  },
  mounted() { 
    this.chart = echarts.init(this.$refs.chart)
    this.initChart()
  },

  methods: {
    initChart() {
     if (!this.chart) {
        this.resizeHandler = () => {
          this.chart && this.chart.resize()
        }
        window.addEventListener("resize", this.resizeHandler)
      }
      const option = {
        animation: false,
        grid: {
          left: 120,
          right: 120,
          top: 20,
          bottom: 20,
        },

        xAxis: {
          type: "value",
          max: 100,
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        },

        yAxis: [
          {
            type: "category",
            inverse: true,
            data: this.leftBottomXData,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              width: 100,
              align: "left",
              padding: [0, 0, 0, -80],
              color: "#cfe6ff",
            },
          },

          // 右侧分数
          {
            type: "category",
            inverse: true,
            data: this.valueData.map((item) => {
              return `${item}分（${item}%）`
            }),
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: "#cfe6ff",
              fontSize: 14,
            },
          },
        ],

        series: [
          // 背景条
          {
            type: "bar",
            data: new Array(this.leftBottomXData.length).fill(100),
            barWidth: 20,
            barGap: "-100%",
            itemStyle: {
              color: "rgba(120,160,220,0.2)",
              borderRadius: 4,
            },
            z: 1,
          },
          // 分段条
          {
            type: "pictorialBar",
            symbol: "roundRect",
            symbolRepeat: true,
            symbolMargin: 2,
            symbolSize: [12, 20],
            symbolBoundingData: 100,
            data: this.valueData,
            yAxisIndex: 0,
            itemStyle: {
              color: (params) => this.colors[params.dataIndex],
            },
          },
        ],
      }

      this.chart.setOption(option)

    
    },
  },
   beforeDestroy() {
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler)
    }
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
}
</script>

<style scoped>
.chart-box {
  width: 600PX;
  height: 300PX;
  transform-origin: 0 0;
}
</style>
