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
  name: "RightBottom",

  data() {
    return { chart: null, resizeHandler: null }
  },

  props: {
    psychologyData: {
      type: Array,
      default: () => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },

    positiveData: {
      type: Array,
      default: () => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },

    negativeData: {
      type: Array,
      default: () => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  },

  watch: {
    psychologyData: {
      deep: true,
      handler() {
        this.initChart()
      },
    },
    positiveData: {
      deep: true,
      handler() {
        this.initChart()
      },
    },
    negativeData: {
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
        backgroundColor: "transparent",
        animation: false,
        legend: {
          top: "3%",
          right: "8%",
          textStyle: {
            color: "#00d4ff",
            fontSize: 12,
          },
        },
        grid: {
          left: "5%",
          right: "8%",
          top: "20%",
          bottom: "1%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data:
            this.psychologyData.length > 0
              ? this.psychologyData
              : Array.from({ length: this.psychologyData.length }, (_, i) => i + 1),
          boundaryGap: false,
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(0, 212, 255, 0.4)",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 100,
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(0, 212, 255, 0.4)",
            },
          },
          axisLabel: {
            color: "#FFFFFF",
            fontSize: 11,
          },
        },
        series: [
          {
            name: "心理能力",
            type: "line",
            data: this.psychologyData,
            smooth: true,
            showSymbol: false,
            lineStyle: {
              color: "#009dff",
              width: 2,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(20, 216, 255, 0.3)" },
                { offset: 0.4, color: "rgba(20, 216, 255, 0)" },
              ]),
            },
            emphasis: {
              itemStyle: {
                borderWidth: 3,
              },
            },
          },
          {
            name: "正面情绪",
            type: "line",
            data: this.positiveData,
            smooth: true,
            showSymbol: false,
            lineStyle: {
              color: "#32C368",
              width: 2,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(24, 210, 124, 0.3)" },
                { offset: 0.4, color: "rgba(24, 210, 124, 0)" },
              ]),
            },
            emphasis: {
              itemStyle: {
                borderWidth: 3,
              },
            },
          },
          {
            name: "负面情绪",
            type: "line",
            data: this.negativeData,
            smooth: true,
            showSymbol: false,
            lineStyle: {
              color: "#DE912C",
              width: 2,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(255, 184, 0, 0.3)" },
                { offset: 0.4, color: "rgba(255, 184, 0, 0)" },
              ]),
            },
            emphasis: {
              itemStyle: {
                borderWidth: 3,
              },
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
