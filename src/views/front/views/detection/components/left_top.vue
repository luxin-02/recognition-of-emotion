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
  name: "LeftTop",
  props: {
    valueData: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    valueData: {
      deep: true,
      handler() {
        this.initChart()
      },
    },
  },
  data() {
    return {
      LeftTopXData: ["焦虑", "抑郁", "压力", "失眠", "疲劳", "易怒", "放松"],
      chart: null,
      resizeHandler: null,
    }
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
      const xData = this.LeftTopXData
      const option = {
        animation: false,
        grid: {
          left: 50,
          right: 20,
          top: 20,
          bottom: 30,
        },

        xAxis: {
          type: "category",
          data: xData,
          axisLine: {
            lineStyle: {
              color: "#3d5a98",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#00cfff",
            fontSize: 16,
          },
        },

        yAxis: {
          type: "value",
          max: 100,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#3d5a98",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.08)",
            },
          },
          axisLabel: {
            color: "#fff",
          },
        },

        series: [
          // 背景柱
          {
            type: "bar",
            data: new Array(xData.length).fill(100),
            barWidth: 42,
            barGap: "-100%",
            itemStyle: {
              color: "rgba(120,160,220,0.2)",
              borderRadius: 6,
            },
            z: 1,
          },

          // 前景分段柱
          {
            type: "pictorialBar",
            symbol: "roundRect",
            symbolRepeat: true,
            symbolMargin: 2,
            symbolSize: [35, 13],
            symbolBoundingData: 100,
            data: this.valueData,
            z: 2,
            itemStyle: {
              color: (params) => {
                const colors = [
                  "#18c8ff",
                  "#ffee00",
                  "#18d27c",
                  "#18c8ff",
                  "#ffee00",
                  "#18c8ff",
                  "#5d5dff",
                ]

                return colors[params.dataIndex]
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
