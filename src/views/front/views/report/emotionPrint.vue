<template>
  <print-box ref="print_box">
    <div class="wrap" ref="targetHtml">
      <div class="class_title">心理评估分析报告</div>
      <div class="content_wrap">
        <div class="mk_title"><i></i>基本信息</div>
        <div class="user_info">
          <div>
            <div>所属名称： <i>情绪检测报告</i></div>
            <!-- <div>
            本次报告用时：
            <i>{{ $formatTime(reportData.total_seconds, "HHH:mmm:sss") }}</i>
          </div> -->
            <div>
              结果生成时间：
              <i>{{ $formatDate2(reportData.add_time * 1000, "yyyy-MM-dd") }}</i>
            </div>
            <div>
              账号类型： <i>{{ $store.getters.roleInfo.name }}</i>
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
              年龄： <i>{{ reportData.birthdate }}</i>
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
              联系电话： <i>{{ reportData.phone }}</i>
            </div>
          </div>
        </div>
        <br />

        <div class="mk_title"><i></i>报告结果</div>
        <div class="report_score" v-if="reportData.image_analysis">
          <div class="instrument">
            <div class="fenshu">{{ reportData.image_analysis.value[0] }}<i>分</i></div>
            <div class="zhpf">{{ reportData.image_analysis.name[0] }}</div>
            <canvas ref="progressCanvas" class="progress"></canvas>
          </div>
          <div class="score_box1">
            <div>
              <div class="text1">{{ reportData.image_analysis.name[2] }}得分：</div>
              <div class="text2">{{ reportData.image_analysis.value[2] }}<i>分</i></div>
              <div class="text3">{{ reportData.image_analysis.level[2] }}</div>
            </div>
            <div>
              <div class="text1">{{ reportData.image_analysis.name[1] }}得分：</div>
              <div class="text2">{{ reportData.image_analysis.value[1] }}<i>分</i></div>
              <div class="text3">{{ reportData.image_analysis.level[1] }}</div>
            </div>
          </div>
          <div class="score_box2">
            <div class="text1">{{ reportData.image_analysis.name[3] }}得分：</div>
            <div class="text2">{{ reportData.image_analysis.value[3] }}<i>分</i></div>
            <div class="text3">{{ reportData.image_analysis.level[3] }}</div>
          </div>
        </div>

        <br />

        <!-- ----------- -->
        <template v-if="reportData.negative">
          <br />
          <div class="mk_title"><i></i>负面情绪分析</div>
          <img id="radarMap" :src="chartImg" alt="" />
          <div v-for="(item, index) in this.reportData.negative.name" :key="index">
            <div class="mk2_title">
              <img src="@/assets/img/front/report/yuan.png" />
              {{ item }}指数
            </div>
            <el-progress
              :percentage="+reportData.negative.value[index]"
              :color="customColors"
              :stroke-width="10"
              define-back-color="#091628"
              text-color="#fff"
            ></el-progress>
            <br />
            <div class="score_analyse">
              <div class="analyse_header">
                <div>{{ item }}指数：</div>
                <div>{{ reportData.negative.value[index] }}</div>
                <div>{{ reportData.negative.level[index] }}</div>
              </div>
              <div class="analyse_title"><i></i>分析总结</div>
              <div class="analyse_content">
                {{ reportData.negative.result[index] }}
              </div>
            </div>
          </div>
        </template>
        <!-- ----------- -->

        <br />

        <!-- ----------- -->
        <template>
          <div class="mk_title"><i></i>正面情绪分析</div>
          <img id="roseChart" :src="emotionChartImg1" alt="" />
          <div v-if="false">
            <div class="mk2_title">
              <img src="@/assets/img/front/report/yuan.png" />
              {{ "item.gradeName" }}
            </div>
            <div class="jdt">
              <div
                :style="{
                  width: 50 + '%',
                  backgroundColor: getJdtColor(50),
                }"
              >
                -
              </div>
            </div>
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
          <div class="mk_title"><i></i>心理情绪分析</div>
          <img id="barGraph" :src="emotionChartImg2" alt="" />
          <div v-if="false">
            <div class="mk2_title">
              <img src="@/assets/img/front/report/yuan.png" />
              {{ "item.gradeName" }}
            </div>
            <div class="jdt">
              <div
                :style="{
                  width: 50 + '%',
                  backgroundColor: getJdtColor(50),
                }"
              >
                -
              </div>
            </div>
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

        <div class="mk_title"><i></i>情绪总体分析：</div>
        <template v-if="reportData.image_analysis">
          <div class="summarize" v-for="(item, i) in reportData.image_analysis.name" :key="item.name">
            <div class="analyse_title"><i></i>{{ item }}分析：</div>
            <div class="analyse_content">
              {{ reportData.image_analysis.result[i] }}
            </div>
          </div>
        </template>

        <!-- <div class="mk2_title">
          <img src="@/assets/img/front/report/yuan.png" />
          推荐方案
        </div>
        <div class="project">
          <div
            v-for="(item, i) in reportData.recommend"
            :key="i"
            @click="toRecommend(item)"
          >
            {{ item.title }}
          </div>
        </div> -->

        <br /><br />
      </div>
    </div>

    <!-- <div class="mk2_title">
      <img src="@/assets/img/front/report/yuan.png" />
      抑郁障碍
    </div>
    <div class="jdt">
      <div
        :style="{
          width: percentages[1] + '%',
          backgroundColor: getJdtColor(percentages[1]),
        }"
      >
        -
      </div>
    </div> -->
  </print-box>
</template>

<script>
import PrintBox from "@/components/common/print/PrintBox.vue"

export default {
  name: "print",
  props: ["reportData", "chartImg", "emotionChartImg1", "emotionChartImg2"],
  components: {
    PrintBox,
  },
  data() {
    return {
      progressValue: 50,
      customColors: [
        { color: "#18D1A9", percentage: 20 },
        { color: "#94E629", percentage: 40 },
        { color: "#FFCC31", percentage: 60 },
        { color: "#FF9328", percentage: 80 },
        { color: "#FF5F35", percentage: 100 },
      ],
    }
  },
  mounted() {
    this.drawSemiCircleProgress()
  },
  methods: {
    print(title) {
      // 1. 找到所有 canvas，替换成同尺寸的 img
      const canvasList = this.$refs.targetHtml.querySelectorAll("canvas")
      const restoreList = []
      canvasList.forEach((canvas) => {
        const img = document.createElement("img")
        img.src = canvas.toDataURL("image/png")
        img.className = canvas.className
        Array.from(canvas.attributes).forEach((attr) => {
          if (attr.name.startsWith("data-v-")) {
            img.setAttribute(attr.name, attr.value)
          }
        })
        img.style.cssText = canvas.style.cssText
        img.width = canvas.offsetWidth
        img.height = canvas.offsetHeight
        canvas.parentNode.insertBefore(img, canvas)
        canvas.style.display = "none"
        restoreList.push({ canvas, img })
      })
      this.$refs.print_box.printWord(title)

      // 3. 打印触发后还原（iframe 打印是异步的，延迟还原）
      setTimeout(() => {
        restoreList.forEach(({ canvas, img }) => {
          canvas.style.display = ""
          img.parentNode.removeChild(img)
        })
      }, 500)
    },
    // 通用的颜色计算方法，传入百分比值返回对应的颜色
    getJdtColor(percentage) {
      if (percentage > 0 && percentage <= 20) {
        return this.customColors[0] // 大于0用第一个颜色
      } else if (percentage > 20 && percentage <= 40) {
        return this.customColors[1] // 大于20用第二个颜色
      } else if (percentage > 40 && percentage <= 60) {
        return this.customColors[2] // 大于40用第三个颜色
      } else if (percentage > 60 && percentage <= 80) {
        return this.customColors[3] // 大于60用第四个颜色
      } else if (percentage > 80) {
        return this.customColors[4] // 大于80用第五个颜色
      } else {
        return "#18D1A9" // 默认颜色
      }
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
      const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY)
      gradient.addColorStop(0, "#FF5F35")
      gradient.addColorStop(0.25, "#FF9328")
      gradient.addColorStop(0.5, "#FFCC31")
      gradient.addColorStop(0.75, "#94E629")
      gradient.addColorStop(1, "#18D1A9")

      const progress = Math.min(this.progressValue / 100, 1)
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + (endAngle - startAngle) * progress, false)
      ctx.lineWidth = 12
      ctx.strokeStyle = gradient
      ctx.lineCap = "round"
      ctx.stroke()
    },
  },
}
</script>

<style scoped lang="scss">
.wrap {
  position: relative;

  .class_title {
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 24px;
    font-family: "ziyuanyuanti500W";
    color: #00aeff;
    border-radius: 20px 20px 0 0;
  }
  .content_wrap {
    width: 100%;
    height: 520px;
    border-radius: 0 0 20px 20px;
    box-sizing: border-box;
    padding: 40px 150px 0 30px;
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
    .jdt {
      width: 100%;
      height: 6px;
      background-color: #33333330;
      border-radius: 10px;
      margin-bottom: 10px;
      > div {
        height: 6px;
        background-color: #18d1a9;
        border-radius: 10px;
        font-size: 2px;
        line-height: 10px;
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
          color: #333;
          line-height: 35px;
          > i {
            // color: #c2efff;
            color: #33333380;
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
        height: 365px !important;
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
        height: 300px !important;
        margin: 30px 0 0 0;
        > div {
          width: 350px;
          height: 120px !important;
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
            background-image: url(@/assets/img/front/report/负面.png) !important;
          }
          &:nth-child(2) {
            background-image: url(@/assets/img/front/report/正面.png) !important;
          }
        }
      }
      .score_box2 {
        width: 350px;
        height: 258px !important;
        background-size: 100% 100%;
        background-image: url(@/assets/img/front/report/心理能力.png) !important;
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
        color: #333;
        > div {
          width: 33%;
          height: 100%;
          border-radius: 7px;
          background: #2491e9;
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
        color: #333;
        line-height: 26px;
        margin: 0 15px 10px 15px;
      }
    }
    .summarize {
      width: 100%;
      padding: 0 0 0 10px;
      box-sizing: border-box;
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
        color: #333;
        line-height: 26px;
        margin: 0 15px 10px 15px;
      }
    }
  }
}
</style>
