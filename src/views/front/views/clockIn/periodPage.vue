<template>
  <div class="ph_wrap">
    <div class="index">
      <div class="module_title"> 
        心情记录 
      </div>

      <div class="date_sele">
        <div>心情详情：</div>
        <div>
          选择月份：
          <el-date-picker
            v-model="dateTimestamp"
            type="month"
            placeholder="选择日期"
            format="yyyy 年 MM 月"
            value-format="yyyy-MM-dd"
          >
            >
          </el-date-picker>
        </div>
      </div>

      <div class="analyse">
        <div class="analyse_title">12月数据分析：</div>
        <div class="left">
          <div class="_title">当月心情趋势：</div>
          <div
            ref="trendChart"
            class="trendChart"
            :style="{ transform: `scale(${scale})` }"
          ></div>
        </div>
        <div class="right">
          <div class="_title">
            <p>当月心情数据统计：</p>
            <p>
              当月打卡 <i>{{ totalDays }}</i
              >天
            </p>
          </div>
          <div ref="statistics" class="statistics"></div>

          <ul v-if="statisticsData.length > 0">
            <li class="mood-1">
              超开心 {{ statisticsData[0].num }}天
              {{ statisticsData[0].ratio }}%
            </li>
            <li class="mood-2">
              开心 {{ statisticsData[1].num }}天 {{ statisticsData[1].ratio }}%
            </li>
            <li class="mood-3">
              还行 {{ statisticsData[2].num }}天 {{ statisticsData[2].ratio }}%
            </li>
            <li class="mood-4">
              不开心 {{ statisticsData[3].num }}天
              {{ statisticsData[3].ratio }}%
            </li>
            <li class="mood-5">
              超烂 {{ statisticsData[4].num }}天 {{ statisticsData[4].ratio }}%
            </li>
          </ul>
        </div>
      </div>
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
import * as echarts from "echarts"
import scaleMixin from "@/mixins/scaleMixin"
import { getMoodRecord } from "@/server/api/mood"
export default {
  mixins: [scaleMixin],
  data() {
    return {
      dateTimestamp: getCurrentDateFormatted(),
      trendChart: null,
      statisticsChart: null,
      statisticsData: "",
      totalDays: 0,
    }
  },
  watch: {
    dateTimestamp() {
      this.getMoodRecordFn()
    },
  },
  mounted() {
    let target = this.$refs.trendChart
    this.trendChart = echarts.init(target)
    let target2 = this.$refs.statistics
    this.statisticsChart = echarts.init(target2)

    this.getMoodRecordFn()
  },
  methods: {
    async getMoodRecordFn() {
      const parts = this.dateTimestamp.split("-")
      const year = parts[0] // "2026"
      const month = parts[1] // "02"
      const { data } = await getMoodRecord({
        year: year,
        month: month,
      })
      if (data.code == this.$global.successCode) {
        this.statisticsData = data.stat || []
        let monthDays = data.data || []
        this.totalDays = monthDays.length
        const dayArray = monthDays.map((item) => parseInt(item.day))
        const moodArray = monthDays.map((item) => parseInt(item.mood))
        const dayData = Array.from(dayArray, (_) => `${_}日`)
        this.$nextTick(() => {
          this.trendChartFn(dayData, moodArray)
          this.statisticsChartFn(data.stat)
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
    statisticsChartFn(stat) {
      // 定义颜色数组，确保外圈和内圈使用相同的颜色
      const colors = ["#f57676", "#0099ff", "#eb9c10", "#ffff00", "#ff5fc1"]

      let option = {
        tooltip: {
          show: false,
        },
        legend: {
          orient: "vertical", // 垂直排列
          right: "10%", // 放置在右边
          top: "center", // 垂直居中
          textStyle: {
            color: "#fff", // 设置文字颜色为白色
          },
        },
        // 添加图形组件，用于在饼图中间显示图片
        graphic: [
          {
            type: "image",
            id: "centerImage",
            left: "center",
            top: "center",
            style: {
              image: require("@/assets/img/front/clockIn/tj_icon.png"), // 替换为您的图片路径
              width: 90, // 图片宽度
              height: 90, // 图片高度
            },
            z: 10, // 确保图片显示在最上层
          },
        ],
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["90%", "83%"],
            center: ["50%", "50%"], // 确保饼图居中
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
              borderRadius: 10,
            },
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: false,
              },
              scale: false,
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: stat[0].num, itemStyle: { color: colors[0] } },
              { value: stat[1].num, itemStyle: { color: colors[1] } },
              { value: stat[2].num, itemStyle: { color: colors[2] } },
              { value: stat[3].num, itemStyle: { color: colors[3] } },
              { value: stat[4].num, itemStyle: { color: colors[4] } },
            ],
          },
          // 内圈 - 使用与外圈相同的颜色
          {
            type: "pie",
            radius: ["83%", "55%"], // 内圈半径，为中间图片留出空间
            itemStyle: {
              borderRadius: 0,
            },
            label: {
              show: false,
            },
            emphasis: {
              scale: false,
            },
            data: [
              { value: stat[0].num, itemStyle: { color: `${colors[0]}50` } },
              { value: stat[1].num, itemStyle: { color: `${colors[1]}50` } },
              { value: stat[2].num, itemStyle: { color: `${colors[2]}50` } },
              { value: stat[3].num, itemStyle: { color: `${colors[3]}50` } },
              { value: stat[4].num, itemStyle: { color: `${colors[4]}50` } },
            ],
          },
        ],
      }

      option && this.statisticsChart.setOption(option)
    },
  },
  beforeDestroy() {
    this.trendChart ? this.trendChart.dispose() : ""
    this.statisticsChart ? this.statisticsChart.dispose() : ""
  },
}
</script>

<style scoped lang="scss">
.ph_wrap {
  width: 100%;
  height: 100%;
  .index {
    width: 1580px;
    height: 872px;
    padding: 200px 120px 0 120px;
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    // display: flex;
    background-image: url(@/assets/img/front/index/kuang.png);
    background-size: 100% 100%;
    .module_title {
      position: absolute;
      top: 90px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 32px;
      height: 33px;
      line-height: 33px;
      font-family: "ziyuanyuanti600W";
      color: #fff;
      background: linear-gradient(0deg, #85a7ff 0%, #ffffff 100%);
      -webkit-background-clip: text;
      color: transparent;
    }

    .date_sele {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #285bf0;
      > div {
        color: #fff;
        font-size: 18px;
        font-family: "ziyuanyuanti400W";
        display: flex;
        align-items: center;
        ::v-deep .el-input__inner {
          background: #13306e;
          border-color: #285bf0;
          color: #fff;
        }
      }
    }

    .analyse {
      width: 100%;
      height: 420px;
      margin-top: 50px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .analyse_title {
        width: 100%;
        font-size: 22px;
        font-family: "ziyuanyuanti400W";
        text-align: left;
        color: #ffffff;
        margin-bottom: 20px;
      }
      .left,
      .right {
        width: 640px;
        height: 360px;
        border: 1px solid #ffffff50;
        border-radius: 14px;
        background: #071120;
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
          background-image: url(@/assets/img/front/clockIn/title_bg.png);
          display: flex;
          align-items: center;
          justify-content: space-between;
          > p {
            > i {
              color: #00a6fc;
            }
          }
        }
        .trendChart {
          width: 620PX;
          height: 320PX;
          transform-origin: 0 0;
        }

        .statistics {
          width: 250PX;
          height: 250PX;
          margin: 35px 0 0 40px;
        }
      }

      .right {
        position: relative;
        > ul {
          position: absolute;
          right: 140px;
          top: 100px;
          padding-left: 20px; // 为小圆点留出空间
          list-style-type: none; // 移除默认列表样式
          > li {
            font-size: 16px;
            font-family: "ziyuanyuanti400W";
            color: #ffffff; // 文字保持全白色
            line-height: 35px;
            position: relative;
            padding-left: 30px; // 为自定义小圆点留出空间

            // 为所有li添加小圆点
            &::before {
              content: "";
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 15px;
              height: 15px;
              border-radius: 50%;
              background-color: #ffffff; // 默认白色
            }

            // 为不同心情等级设置不同的小圆点颜色
            &.mood-1::before {
              background-color: #f57676; // 超开心 - 蓝色小圆点
            }
            &.mood-2::before {
              background-color: #0099ff; // 开心 - 绿色小圆点
            }
            &.mood-3::before {
              background-color: #eb9c10; // 还行 - 黄色小圆点
            }
            &.mood-4::before {
              background-color: #ffff00; // 不开心 - 红色小圆点
            }
            &.mood-5::before {
              background-color: #ff5fc1; // 超烂 - 浅蓝色小圆点
            }
          }
        }
      }
    }
  }
}
</style>
