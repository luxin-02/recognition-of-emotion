<template>
  <div class="index">
    <div class="statistics">
      <div class="left">
        <div class="_title">测评数据统计</div>
        <div class="tj_number">
          总共测评次数：
          <span class="number-container" v-if="this.statisticsData.gauge">
            <span
              v-for="(digit, index) in this.statisticsData.gauge
                .toString()
                .split('')"
              :key="index"
              class="digit"
            >
              {{ digit ? digit : "0" }}
            </span>
          </span>
          <span class="number-container" v-else>
            <span class="digit"> 0 </span>
          </span>
          &nbsp; 次
        </div>
        <div class="yujing">
          <div>
            <p><i style="color: red">·</i>历史预警总数</p>
            <div style="color: red">
              {{
                this.statisticsData.gauge_warning
                  ? this.statisticsData.gauge_warning
                  : "0"
              }}次
            </div>
          </div>
          <div>
            <p><i style="color: #49aae3">·</i>预警占比</p>
            <div style="color: #49aae3">
              {{
                this.statisticsData.gauge_ratio
                  ? this.statisticsData.gauge_ratio
                  : "0"
              }}%
            </div>
          </div>
        </div>
        <div class="jdt">
          <div :style="{ width: this.statisticsData.gauge_ratio + '%' }"></div>
        </div>

        <img class="weiji" src="@/assets/img/front/userInfo/weiji.png" alt="" />
      </div>

      <div class="right">
        <div class="_title">测评数据统计</div>

        <div
          class="jdt_wrap"
          v-for="(item, i) in this.statisticsData.training"
          :key="i"
        >
          {{ item.game_name }}
          <div class="jdt">
            <div style="width: 50%"></div>
          </div>
          {{ item.num }}次
        </div>
      </div>
    </div>

    <div class="period_chart">
      <div class="_title">
        当月心情走势
        <div>
          <el-date-picker
            v-model="dateTimestamp"
            type="month"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>

      <div ref="trendChart" class="trendChart"></div>
    </div>
  </div>
</template>

<script>
function getCurrentDateFormatted() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}` // 返回 yyyy-MM-dd 格式
}
import { statisticsApi } from "@/server/api/system"
import * as echarts from "echarts"
import scaleMixin from "@/mixins/scaleMixin"
export default {
  mixins: [scaleMixin],
  data() {
    return {
      num: 0,
      dateTimestamp: getCurrentDateFormatted(),
      trendChart: null,
      statisticsData: "",
    }
  },
  watch: {
    dateTimestamp() {
      this.getStatistics()
    },
  },
  created() {},
  mounted() {
    let target = this.$refs.trendChart
    this.trendChart = echarts.init(target)
    // this.trendChartFn()
    this.getStatistics()
  },
  methods: {
    async getStatistics() {
      const parts = this.dateTimestamp.split("-")
      const year = parts[0] // "2026"
      const month = parts[1] // "02"
      const { data } = await statisticsApi({
        year: year,
        month: month,
      })
      if (data.code == this.$global.successCode) {
        console.log(data)
        this.statisticsData = data.data

        let monthDays = data.data.mood_month || []
        this.totalDays = monthDays.length
        const dayArray = monthDays.map((item) => parseInt(item.day))
        const moodArray = monthDays.map((item) => parseInt(item.mood))
        const dayData = Array.from(dayArray, (_) => `${_}日`)
        console.log(dayData, moodArray)

        this.$nextTick(() => {
          this.trendChartFn(dayData, moodArray)
        })
      }
    },
    trendChartFn(dayData, moodArray) {
      // const monthDays = Array.from({ length: 31 }, (_, i) => `${i + 1}日`)

      const getMoodImage = (moodValue) => {
        const moodImages = {
          1: require("@/assets/img/front/clockIn/Emoji_超烂.png"), // 超烂
          2: require("@/assets/img/front/clockIn/Emoji_不开心.png"), // 不开心
          3: require("@/assets/img/front/clockIn/Emoji_还行.png"), // 还行
          4: require("@/assets/img/front/clockIn/Emoji_开心.png"), // 开心
          5: require("@/assets/img/front/clockIn/Emoji_超开心.png"), // 超开心
        }
        return (
          moodImages[moodValue] ||
          require("@/assets/img/front/clockIn/Emoji_超开心.png")
        )
      }
      // 生成带图片的数据
      const generateDataWithImages = () => {
        return Array.from(moodArray, (item, i) => {
          return {
            value: Number(item),
            symbol: `image://${getMoodImage(item)}`,
            symbolSize: 20, // 图片大小
          }
        })
      }

      let option = {
        animation: false, // 关闭动画
        grid: {
          x: 54,
          y: 30,
          x2: 10,
          y2: 30,
        },
        color: "#18ada4",
        dataZoom: [
          {
            type: "inside", // 内置型数据区域缩放
            xAxisIndex: 0, // 控制x轴
            start: 0, // 初始缩放开始位置
            end: 40, // 初始缩放结束位置（显示前20天）
          },
        ],
        xAxis: {
          type: "category",
          data: dayData, // 显示一个月的每一天
          axisLabel: {
            color: "#fff",
            interval: 0, // 显示所有标签
            // rotate: 45 // 标签旋转45度
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          min: 1, // 最小值1分
          max: 5, // 最大值5分
          interval: 1, // 间隔为1
          axisLabel: {
            color: "#fff",
            formatter: function (value) {
              // 将数值转换为心情等级
              const moodMap = {
                1: "超烂",
                2: "不开心",
                3: "还行",
                4: "开心",
                5: "超开心",
              }
              return moodMap[value] || value
            },
          },
          splitLine: {
            lineStyle: {
              color: "#ffffff30",
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        series: [
          {
            data: generateDataWithImages(), // 生成带图片的数据
            type: "line",
            smooth: true,
            symbol: "circle", // 默认符号
            symbolSize: 20, // 符号大小
            itemStyle: {
              color: "#18ada4", // 线条颜色
            },
            lineStyle: {
              width: 3, // 线条宽度
            },
            areaStyle: {
              color: "#18ada410", // 区域颜色
            },
          },
        ],
      }

      option && this.trendChart.setOption(option)
      //   let str = this.trendChart.getDataURL()
    },
  },
  beforeDestroy() {
    this.trendChart ? this.trendChart.dispose() : ""
  },
}
</script>

<style scoped lang="scss">
.statistics {
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    width: 390px;
    height: 220px;
    background: #0d1a31;
    border: 1px solid #ffffff80;
    border-radius: 10px;
    margin-top: 20px;
    ._title {
      width: 100%;
      height: 36px;
      font-size: 16px;
      font-family: "ziyuanyuanti400W";
      color: #ffffff;
      line-height: 36px;
      padding: 0 20px;
      box-sizing: border-box;
      background-size: 100% 100%;
      background-image: url(@/assets/img/front/userInfo/title_bg.png);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .left {
    position: relative;
    .tj_number {
      color: #ffffff;
      font-size: 18px;
      padding: 0 20px;
      margin-top: 20px;
      font-family: "ziyuanyuanti400W";
      .number-container {
        display: inline-flex;
        gap: 4px;
        .digit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 53px;
          background-size: 100% 100%;
          background-image: url(@/assets/img/front/userInfo/number_bg.png);
          font-weight: bold;
          font-size: 18px;
          color: #a6defe;
        }
      }
    }
    .yujing {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      margin-top: 15px;
      > div {
        text-align: left;
        margin: 0 8px;
        > p {
          font-size: 16px;
          font-family: "ziyuanyuanti400W";
          font-weight: 400;
          color: #ffffff;
          display: flex;
          align-items: center;
          > i {
            font-size: 35px;
          }
        }
        > div {
          font-size: 20px;
          font-family: "ziyuanyuanti400W";
          font-weight: 400;
          padding-left: 30px;
        }
      }
    }
    .jdt {
      width: 300px;
      height: 12px;
      background: #1a3453;
      border-radius: 6px;
      margin: 18px auto 0 auto;
      > div {
        height: 12px;
        background: red;
        border-radius: 6px;
      }
    }
    .weiji {
      width: 58px;
      height: 62px;
      position: absolute;
      top: 120px;
      left: 20px;
    }
  }
  .right {
    // height: 400px;
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    > .jdt_wrap {
      width: 100%;
      font-size: 15px;
      font-family: "ziyuanyuanti400W";
      font-weight: 400;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 18px;

      .jdt {
        width: 200px;
        height: 12px;
        background: #1a3453;
        border-radius: 6px;
        margin: 0 15px;
        > div {
          height: 12px;
          border-radius: 6px;
          &:nth-child(1) {
            background: #0080ff;
          }
          &:nth-child(2) {
            background: #39b3ae;
          }
          &:nth-child(3) {
            background: #4045c9;
          }
          &:nth-child(4) {
            background: #a79269;
          }
          &:nth-child(5) {
            background: #0080ff;
          }
          &:nth-child(6) {
            background: #39b3ae;
          }
        }
      }
    }
  }
}
.period_chart {
  width: 810px;
  height: 250px;
  background: #051120;
  border: 1px solid #ffffff80;
  border-radius: 15px;
  margin-top: 20px;
  ._title {
    width: 100%;
    height: 36px;
    font-size: 16px;
    font-family: "ziyuanyuanti400W";
    color: #ffffff;
    line-height: 36px;
    padding: 0 20px;
    box-sizing: border-box;
    background-size: 100% 100%;
    background-image: url(@/assets/img/front/userInfo/title_bg.png);
    display: flex;
    align-items: center;
    justify-content: space-between;
    > div {
      ::v-deep .el-date-editor {
        width: 150px;
        height: 32px;
        .el-input__inner {
          width: 150px;
          height: 32px;
          background: #00000000;
          border: 1px solid #00b4ff80;
          color: #fff;
        }
      }
    }
  }

  .trendChart {
    width: 800px;
    height: 210px;
  }
}
</style>
