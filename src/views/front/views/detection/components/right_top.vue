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
  name: "RightTop",

  data() {
    return {
      chart: null,
      resizeHandler: null,
      defaultValueData: [
        { value: 0, name: "满足指数" },
        { value: 0, name: "放松指数" },
        { value: 0, name: "兴奋指数" },
        { value: 0, name: "乐观指数" },
        { value: 0, name: "自信指数" },
      ],
    }
  },

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
      const chartData = this.valueData.length
        ? this.valueData
        : this.defaultValueData
      const option = {
        animation: false,
        series: [
          {
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            color: ["#2447f7", "#24dcf7", "#ffdb15", "#10e8aa", "#ff3434"],
            itemStyle: {},
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 18,
                fontWeight: "bold",
                color: "#fff",
              },
            },
            labelLine: {
              show: false,
            },
            data: chartData,
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
  width: 215PX;
  height: 215PX;
  transform-origin: 0 0;
}
</style>
