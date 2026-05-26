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

      <template v-if="$route.query.type == '测评报告'">
        <div
          class="mk_title"
          v-if="reportData.record_result && reportData.record_result.length > 1"
        >
          <i></i>报告分析
        </div>
        <br />
        <div
          v-if="reportData.record_result && reportData.record_result.length > 1"
          class="radarMap"
          ref="radarMap"
          :style="{ transform: `scale(${scale})` }"
        ></div>
        <div class="mk_title"><i></i>报告结果</div>
        <div v-for="(item, i) in reportData.record_result" :key="i">
          <div class="mk2_title">
            <img src="@/assets/img/front/report/yuan.png" />
            {{ item.gradeName }}
          </div>
          <el-progress
            :percentage="item.prop"
            :color="customColors"
            :stroke-width="10"
            define-back-color="#091628"
            text-color="#fff"
          ></el-progress>
        </div>

        <div class="mk2_title">
          <img src="@/assets/img/front/report/yuan.png" />
          诊断说明
        </div>
        <div class="explain_text">
          <div v-for="(item, i) in reportData.record_result" :key="i">
            <p>{{ item.gradeName }} - 得分：{{ item.scores }}</p>
            <p v-html="item.degree"></p>
            <p v-html="item.result"></p>
            <!-- <p v-html="item.scores"></p> -->
            <br />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="mk_title"><i></i>报告结果</div>
        <div class="explain_text" v-html="reportData.result"></div>
        <br />
        <div class="mk_title"><i></i>报告建议</div>
        <div class="explain_text" v-html="reportData.suggest"></div>
      </template>

      <template v-if="$route.query.type == '测评报告'">
        <div class="mk2_title">
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
        </div>
      </template>

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

      detailsLoading: false,
      reportData: "",
    }
  },
  created() {},
  mounted() {
    if (this.$route.query.type == "测评报告") {
      this.getGaugeInfo()
    } else {
      this.getDrillInfo()
    }
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
              let target = this.$refs.radarMap
              this.radarMapChart = echarts.init(target)
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

    async getDrillInfo() {
      this.detailsLoading = true
      try {
        const { data } = await reportApiInfo({
          id: this.$route.query.id,
        })
        if (data.code == this.$global.successCode) {
          this.reportData = {
            ...data.data,
            ...data.data.userinfo,
            gauge_title: data.data.game_name,
            total_seconds: data.data.seconds,
            add_time: data.data.add_time,
          }

          this.$nextTick(() => {})
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
    toRecommend(item) {
      this.$router.push({
        path: item.route,
      })
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
    .radarMap {
      width: 1000px;
      height: 500px;
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
  }
}
</style>
