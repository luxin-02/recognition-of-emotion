<template>
  <div class="report_details">
    <div class="module_title">报告详情</div>
    <div class="class_title">心理评估分析报告</div>
    <div class="content_wrap">
      <div class="mk_title"><i></i>基本信息</div>
      <div class="user_info">
        <div>
          <div>
            所属名称： <i>{{ reportData.gauge_title }}</i>
          </div>
          <div>
            本次报告用时：
            <i>{{ $formatTime(reportData.total_seconds, "HHH:mmm:sss") }}</i>
          </div>
          <div>
            结果生成时间：
            <i>{{ $formatDate2(reportData.add_time * 1000, "yyyy-MM-dd") }}</i>
          </div>
        </div>
        <div>
          <div>
            测评用户： <i>{{ reportData.nickname }}</i>
          </div>
          <div>
            性别： <i>{{ reportData.sex }}</i>
          </div>
          <div>
            年龄： <i>{{ reportData.age }}</i>
          </div>
        </div>
        <div>
          <div>
            所在部门： <i>{{ reportData.class_name }}</i>
          </div>
          <div>
            编号： <i>{{ reportData.studentID }}</i>
          </div>
          <div>
            所在单位： <i>{{ reportData.unit }}</i>
          </div>
        </div>
        <div>
          <div>
            注册账号： <i>{{ reportData.username }}</i>
          </div>
          <div>
            账号类型： <i>{{ $store.getters.roleInfo.name }}</i>
          </div>
          <div>
            联系电话： <i>{{ reportData.phone }}</i>
          </div>
        </div>
      </div>
      <br />

      <div class="mk_title"><i></i>报告结果</div>
      <div class="report_score">
        <div class="instrument">
          <div class="fenshu">85<i>分</i></div>
          <div class="zhpf">综合评分</div>
          <canvas ref="progressCanvas" class="progress"></canvas>
        </div>
        <div class="score_box1">
          <div>
            <div class="text1">负面情绪得分：</div>
            <div class="text2">85<i>分</i></div>
            <div class="text3">优秀</div>
          </div>
          <div>
            <div class="text1">负面情绪得分：</div>
            <div class="text2">85<i>分</i></div>
            <div class="text3">优秀</div>
          </div>
        </div>
        <div class="score_box2">
          <div class="text1">负面情绪得分：</div>
          <div class="text2">85<i>分</i></div>
          <div class="text3">优秀</div>
        </div>
      </div>

      <br />

      <!-- ----------- -->
      <template>
        <br />
        <div class="mk_title"><i></i>负面情绪分析</div>
        <div id="radarMap" :style="{ transform: `scale(${scale})` }"></div>
        <div>
          <div class="mk2_title">
            <img src="@/assets/img/front/report/yuan.png" />
            {{ "item.gradeName" }}
          </div>
          <el-progress
            :percentage="50"
            :color="customColors"
            :stroke-width="10"
            define-back-color="#091628"
            text-color="#fff"
          ></el-progress>
          <br />
          <div class="score_analyse">
            <div class="analyse_header">
              <div>睡眠指数：</div>
              <div>66</div>
              <div>睡眠充足</div>
            </div>
            <div class="analyse_title"><i></i>分析总结</div>
            <div class="analyse_content">
              抑郁指数分析：​​核心差异​​：抑郁障碍（单相）仅有抑郁发作；双相障碍则交替出现抑郁和躁狂/轻躁狂发作。关键鉴别点​​：情绪波动​​：双相患者抑可能伴易激惹、冲动行为，躁狂期表现为情绪高涨、精力过盛、睡眠需求减少起病年龄​​：双相障碍多在25岁前急性起病，抑郁障碍常于中年缓慢起病。家族史​​：双相障碍遗传倾向更显著（一级亲属患病风险高10倍）。治疗反应​​：抗抑郁药可能诱发双相患者转躁，需谨慎使用心境稳定剂。
            </div>
          </div>
        </div>
      </template>
      <!-- ----------- -->

      <br />

      <!-- ----------- -->
      <template>
        <div class="mk_title"><i></i>负面情绪分析</div>
        <div id="roseChart" :style="{ transform: `scale(${scale})` }"></div>
        <div>
          <div class="mk2_title">
            <img src="@/assets/img/front/report/yuan.png" />
            {{ "item.gradeName" }}
          </div>
          <el-progress
            :percentage="50"
            :color="customColors"
            :stroke-width="10"
            define-back-color="#091628"
            text-color="#fff"
          ></el-progress>
          <br />
          <div class="score_analyse">
            <div class="analyse_header">
              <div>睡眠指数：</div>
              <div>66</div>
              <div>睡眠充足</div>
            </div>
            <div class="analyse_title"><i></i>分析总结</div>
            <div class="analyse_content">
              抑郁指数分析：​​核心差异​​：抑郁障碍（单相）仅有抑郁发作；双相障碍则交替出现抑郁和躁狂/轻躁狂发作。关键鉴别点​​：情绪波动​​：双相患者抑可能伴易激惹、冲动行为，躁狂期表现为情绪高涨、精力过盛、睡眠需求减少起病年龄​​：双相障碍多在25岁前急性起病，抑郁障碍常于中年缓慢起病。家族史​​：双相障碍遗传倾向更显著（一级亲属患病风险高10倍）。治疗反应​​：抗抑郁药可能诱发双相患者转躁，需谨慎使用心境稳定剂。
            </div>
          </div>
        </div>
      </template>
      <!-- ----------- -->

      <!-- ----------- -->
      <template>
        <div class="mk_title"><i></i>负面情绪分析</div>
        <div id="barGraph" :style="{ transform: `scale(${scale})` }"></div>
        <div>
          <div class="mk2_title">
            <img src="@/assets/img/front/report/yuan.png" />
            {{ "item.gradeName" }}
          </div>
          <el-progress
            :percentage="50"
            :color="customColors"
            :stroke-width="10"
            define-back-color="#091628"
            text-color="#fff"
          ></el-progress>
          <br />
          <div class="score_analyse">
            <div class="analyse_header">
              <div>睡眠指数：</div>
              <div>66</div>
              <div>睡眠充足</div>
            </div>
            <div class="analyse_title"><i></i>分析总结</div>
            <div class="analyse_content">
              抑郁指数分析：​​核心差异​​：抑郁障碍（单相）仅有抑郁发作；双相障碍则交替出现抑郁和躁狂/轻躁狂发作。关键鉴别点​​：情绪波动​​：双相患者抑可能伴易激惹、冲动行为，躁狂期表现为情绪高涨、精力过盛、睡眠需求减少起病年龄​​：双相障碍多在25岁前急性起病，抑郁障碍常于中年缓慢起病。家族史​​：双相障碍遗传倾向更显著（一级亲属患病风险高10倍）。治疗反应​​：抗抑郁药可能诱发双相患者转躁，需谨慎使用心境稳定剂。
            </div>
          </div>
        </div>
      </template>
      <!-- ----------- -->

      <div class="mk2_title">
        <img src="@/assets/img/front/report/yuan.png" />
        推荐方案
      </div>
      <div class="project">
        <!-- <div
            v-for="(item, i) in reportData.recommend"
            :key="i"
            @click="toRecommend(item)"
          >
            {{ item.title }}
          </div> -->
      </div>

      <br /><br />
    </div>
  </div>
</template>

<script>
import { frontGaugeReportApiInfo } from "@/server/api/guage"
import { reportApiInfo } from "@/server/api/report"
import * as echarts from "echarts"
import scaleMixin from "@/mixins/scaleMixin"
export default {
  mixins: [scaleMixin],
  data() {
    return {
      percentage: 50,
      customColors: [
        { color: "#18D1A9", percentage: 20 },
        { color: "#94E629", percentage: 40 },
        { color: "#FFCC31", percentage: 60 },
        { color: "#FF9328", percentage: 80 },
        { color: "#FF5F35", percentage: 100 },
      ],

      radarMapChart: null,
      roseMapChart: null,
      barGraphChart: null,
      progressValue: 80,

      detailsLoading: false,
      reportData: "",
    }
  },
  created() {},
  mounted() {
    this.roseMapChart = echarts.init(document.getElementById("roseChart"))
    this.radarMapChart = echarts.init(document.getElementById("radarMap"))
    this.barGraphChart = echarts.init(document.getElementById("barGraph"))
    this.getGaugeInfo()
    this.$nextTick(() => {
      this.drawSemiCircleProgress()
      this.roseChartFn()
      this.barGraphChartFn()
    })
  },
  methods: {
    async getGaugeInfo() {
      this.detailsLoading = true
      try {
        const { data } = await frontGaugeReportApiInfo({
          id: this.$route.query.id,
        })
        if (data.code == this.$global.successCode) {
          this.reportData = data.data
          let indicator = []
          let series = []
          data.data.record_result.forEach((item) => {
            indicator.push({ name: item.gradeName, max: 100 })
            series.push(item.prop)
          })

          this.$nextTick(async () => {
            console.log(this.reportData)
            if (data.data.record_result.length > 1) {
              this.radarMapChartFn(indicator, series)
            }
          })
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.detailsLoading = false
      }
    },
    radarMapChartFn(indicator, series) {
      let option = {
        // 设置背景颜色与页面容器一致
        backgroundColor: "#082047",
        legend: {
          data: ["Allocated Budget", "Actual Spending"],
        },
        radar: {
          // 也可以设置雷达图本身的背景色
          shape: "polygon",
          splitNumber: 6, // 六边形
          radius: "80%",
          startAngle: 90, // 起始角度
          name: {
            textStyle: {
              color: "#fff", // 指标名称颜色
              fontSize: 18, // 指标名称大小
              fontFamily: "ziyuanyuanti400W", // 字体家族
            },
          },
          splitArea: {
            areaStyle: {
              color: ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"],
            },
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.3)",
            },
          },
          indicator: indicator,
        },
        series: [
          {
            name: "",
            type: "radar",
            areaStyle: {
              color: "rgba(0, 174, 255, 0.3)", // 数据区域填充色
            },
            lineStyle: {
              color: "#00aeff", // 线条颜色
            },
            itemStyle: {
              color: "#00aeff", // 数据点颜色
            },
            data: [
              {
                value: series,
              },
            ],
          },
        ],
      }
      option && this.radarMapChart.setOption(option)
    },
    roseChartFn() {
      let option = {
        animation: false,
        series: [
          {
            name: "roseChart",
            type: "pie",
            radius: [50, 230],
            center: ["50%", "50%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 8,
            },
            // 添加 label 配置来修改线条旁边的文字样式
            label: {
              show: true, // 是否显示标签
              position: "outside", // 标签位置：outside（外部）、inside（内部）等
              fontSize: 20, // 字体大小
              fontWeight: "bold", // 字体粗细
              color: "#fff", // 文字颜色
              formatter: "{b}：{c}分", // 格式化显示内容
            },
            data: [
              { value: 40, name: "rose1" },
              { value: 38, name: "rose2" },
              { value: 32, name: "rose3" },
              { value: 30, name: "rose4" },
              { value: 28, name: "rose5" },
            ],
          },
        ],
      }
      option && this.roseMapChart.setOption(option)
    },
    barGraphChartFn() {
      let option = {
        animation: false,
        grid: {
          left: 50,
          right: 20,
          top: 100,
          bottom: 100,
        },
        xAxis: {
          type: "category",
          data: ["rose1", "rose2", "rose3", "rose4", "rose5", "rose6", "rose7"],
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
            fontSize: 18,
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
            fontSize: 18,
          },
        },
        series: [
          // 背景柱
          {
            type: "bar",
            data: new Array(7).fill(100),
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
            data: [40, 38, 32, 30, 28, 26, 24],
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
      option && this.barGraphChart.setOption(option)
    },
    drawSemiCircleProgress() {
      const canvas = this.$refs.progressCanvas
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      const width = 300
      const height = 300
      const dpr = window.devicePixelRatio || 1

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + "px"
      canvas.style.height = height + "px"
      ctx.scale(dpr, dpr)

      const centerX = width / 2
      const centerY = height / 2
      const radius = 130
      const startAngle = Math.PI
      const endAngle = Math.PI * 2

      // 绘制背景半圆
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, endAngle, false)
      ctx.lineWidth = 12
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)"
      ctx.stroke()

      // 绘制进度半圆（使用渐变色）
      const gradient = ctx.createLinearGradient(
        centerX - radius,
        centerY,
        centerX + radius,
        centerY,
      )
      gradient.addColorStop(0, "#FF5F35")
      gradient.addColorStop(0.25, "#FF9328")
      gradient.addColorStop(0.5, "#FFCC31")
      gradient.addColorStop(0.75, "#94E629")
      gradient.addColorStop(1, "#18D1A9")

      const progress = Math.min(this.progressValue / 100, 1)
      ctx.beginPath()
      ctx.arc(
        centerX,
        centerY,
        radius,
        startAngle,
        startAngle + (endAngle - startAngle) * progress,
        false,
      )
      ctx.lineWidth = 12
      ctx.strokeStyle = gradient
      ctx.lineCap = "round"
      ctx.stroke()
    },
  },
  beforeDestroy() {},
}
</script>

<style scoped lang="scss">
.report_details {
  width: 1580px;
  height: 872px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: url(@/assets/img/front/index/kuang.png);
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 190px 70px 0 70px;
  font-family: "ziyuanyuanti400W";

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
  .class_title {
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 24px;
    font-family: "ziyuanyuanti500W";
    color: #00aeff;
    background-color: #0a2c62;
    border-radius: 20px 20px 0 0;
  }
  .content_wrap {
    width: 100%;
    height: 520px;
    background-color: #082047;
    border-radius: 0 0 20px 20px;
    box-sizing: border-box;
    padding: 40px 150px 0 150px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }

    .mk_title {
      font-size: 20px;
      font-family: "ziyuanyuanti500W";
      color: #00aeff;
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      > i {
        width: 5px;
        height: 18px;
        background: #00aeff;
        border-radius: 3px;
        display: inline-block;
        margin-right: 8px;
      }
    }
    .mk2_title {
      font-size: 18px;
      font-family: "ziyuanyuanti400W";
      color: #00aeff;
      margin: 20px 0;
      > img {
        width: 16px;
        height: 16px;
        margin: 0 5px 3px 0;
      }
    }
    .user_info {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      > div {
        width: 100%;
        display: flex;
        align-items: center;
        > div {
          width: 33%;
          font-size: 18px;
          font-family: "ziyuanyuanti400W";
          color: #fff;
          line-height: 35px;
          > i {
            color: #c2efff;
          }
        }
      }
    }
    #roseChart,
    #barGraph,
    #radarMap {
      width: 1000px;
      height: 510px;
      margin: 0 auto;
      transform-origin: 0 0;
    }
    .explain_text {
      font-size: 18px;
      font-family: "ziyuanyuanti400W";
      color: #fff;
      line-height: 26px;
    }
    .project {
      display: flex;
      align-items: center;
      > div {
        padding: 0 15px;
        font-size: 20px;
        font-family: "ziyuanyuanti400W";
        text-align: center;
        color: #ffffff;
        line-height: 38px;
        background-color: #00aeff;
        border-radius: 20px;
        margin-right: 10px;
      }
    }

    ::v-deep .el-progress-bar {
      width: 98%;
    }

    .report_score {
      width: 1100px;
      height: 365px;
      background-image: url(@/assets/img/front/report/score_bg.png);
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      .instrument {
        width: 380px;
        height: 365px;
        background-image: url(@/assets/img/front/report/仪表.png);
        background-size: 100% 100%;
        margin-left: 5px;
        padding-top: 150px;
        box-sizing: border-box;
        position: relative;
        .fenshu {
          font-size: 50px;
          font-family: "ziyuanyuanti600W";
          text-align: center;
          color: #343434;
          > i {
            font-size: 20px;
          }
        }
        .zhpf {
          font-size: 16px;
          text-align: center;
          color: #343434;
          margin: 8px 0 0 32px;
          font-family: "ziyuanyuanti500W";
        }
        .progress {
          width: 300px;
          height: 300px;
          position: absolute;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      .score_box1 {
        width: 350px;
        margin: 30px 0 0 0;
        > div {
          width: 350px;
          height: 120px;
          margin: 20px 0;
          background-size: 100% 100%;
          position: relative;
          > .text1 {
            position: absolute;
            top: 15px;
            left: 25px;
            font-size: 18px;
            font-family: "ziyuanyuanti500W";
            color: #ffffff;
          }
          > .text2 {
            font-size: 40px;
            font-family: "ziyuanyuanti600W";
            text-align: center;
            color: #fff;
            position: absolute;
            top: 65px;
            left: 20px;
            > i {
              font-size: 18px;
            }
          }
          > .text3 {
            position: absolute;
            top: 70px;
            left: 125px;
            font-size: 18px;
            font-family: "ziyuanyuanti500W";
            color: #ffffff;
          }
          &:nth-child(1) {
            background-image: url(@/assets/img/front/report/负面.png);
          }
          &:nth-child(2) {
            background-image: url(@/assets/img/front/report/正面.png);
          }
        }
      }
      .score_box2 {
        width: 350px;
        height: 258px;
        background-size: 100% 100%;
        background-image: url(@/assets/img/front/report/心理能力.png);
        margin-top: 25px;
        position: relative;
        > .text1 {
          position: absolute;
          top: 20px;
          left: 25px;
          font-size: 26px;
          font-family: "ziyuanyuanti500W";
          color: #ffffff;
        }
        > .text2 {
          font-family: "ziyuanyuanti600W";
          position: absolute;
          top: 190px;
          left: 40px;
          font-size: 50px;
          font-weight: 500;
          color: #fd9a25;
          > i {
            font-size: 18px;
            color: #fff;
          }
        }
        > .text3 {
          position: absolute;
          top: 120px;
          left: 55px;
          font-size: 20px;
          font-family: "ziyuanyuanti500W";
          color: #ffffff;
        }
      }
    }
    .score_analyse {
      width: 100%;
      background-color: #102e60;
      border-radius: 15px;
      padding: 14px;
      box-sizing: border-box;
      .analyse_header {
        width: 100%;
        height: 60px;
        line-height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 22px;
        font-family: "ziyuanyuanti500W";
        color: #fff;
        > div {
          width: 33%;
          height: 100%;
          border-radius: 7px;
          background: #044d8c;
          text-align: center;
          color: #fff;
          &.green {
            color: #18d1a9;
          }
          &.red {
            color: #ff5f35;
          }
        }
      }
      .analyse_title {
        font-size: 20px;
        color: #00aeff;
        display: flex;
        align-items: center;
        margin: 15px;
        > i {
          width: 10px;
          height: 10px;
          background: #00acff;
          display: inline-block;
          border-radius: 50%;
          margin-right: 8px;
        }
      }
      .analyse_content {
        font-size: 18px;
        color: #ffffff;
        line-height: 26px;
        margin: 0 15px 10px 15px;
      }
    }
  }
}
</style>
