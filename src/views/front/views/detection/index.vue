<template>
  <div class="index">
    <div class="content_wrap">
      <div class="left">
        <div>
          <div class="title_text">负面情绪</div>
          <br />
          <br />
          <LeftTop :valueData="LeftTopValueData" />
        </div>
        <div>
          <div class="title_text">心理能力</div>
          <br />
          <div class="nengli_list">
            <div>
              <p style="color: #0084ff">{{ analysisData.mentalAbility }}分</p>
              <div>综合指数</div>
            </div>
            <div>
              <p style="color: #10e8aa">放松</p>
              <div>最高指数</div>
            </div>
            <div>
              <p style="color: #ff3434">自信</p>
              <div>最低指数</div>
            </div>
          </div>
          <LeftBottom :valueData="leftBottomValueData" />
        </div>
      </div>
      <div class="middle">
        <div class="title_text">面部识别</div>

        <Middle
          @emotion-change="handleEmotionChange"
          @report-add="handleReportAdd"
          @lookReport="handleLookReport"
        />
      </div>
      <div class="right">
        <div>
          <div class="title_text">正面情绪</div>
          <br />
          <div class="nengli_list">
            <div>
              <p style="color: #0084ff">{{ analysisData.positiveEmotion }}分</p>
              <div>综合指数</div>
            </div>
            <div>
              <p style="color: #10e8aa">放松</p>
              <div>最高指数</div>
            </div>
            <div>
              <p style="color: #ff3434">自信</p>
              <div>最低指数</div>
            </div>
          </div>
          <div class="chart_wrap">
            <div class="pie_chart">
              <RightTop :valueData="rightTopValueData" />
            </div>
            <div class="line"></div>
            <div class="chart_title">
              <div v-for="(item, index) in rightTopValueData" :key="index">
                <i></i>
                <div>{{ item.name }} &nbsp; {{ item.value }}分</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="title_text">心理综合分析</div>
          <br />
          <RightBottom
            :psychologyData="psychologyData"
            :positiveData="positiveData"
            :negativeData="negativeData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LeftTop from "./components/left_top.vue"
import LeftBottom from "./components/left_bottom.vue"
import RightTop from "./components/right_top.vue"
import RightBottom from "./components/right_bottom.vue"
import Middle from "./components/middle.vue"
import { addSmileAssess } from "@/server/api/detection"

const RIGHT_TOP_NAMES = ["满足指数", "放松指数", "兴奋指数", "乐观指数", "自信指数"]
const NEGATIVE_NAMES = ["焦虑", "抑郁", "压力", "失眠", "疲劳", "易怒", "放松"]
const MENTAL_ABILITY_NAMES = [
  "抗压指数",
  "记忆力指数",
  "适应力指数",
  "专注力指数",
  "自控力指数",
  "心理负荷指数",
  "情绪平衡指数",
  "情绪稳定指数",
]
const SUMMARY_NAMES = ["微笑指数", "正面情绪", "负面情绪", "心理能力"]
const TREND_NAMES = {
  psychology: "心理能力",
  positive: "正面情绪",
  negative: "负面情绪",
}

function createZeroArray(length) {
  return Array(length).fill(0)
}

function createRightTopData() {
  return RIGHT_TOP_NAMES.map((name) => ({ name, value: 0 }))
}

function createInitialAnalysisData() {
  return {
    smileIndex: 0,
    positiveEmotion: 0,
    negativeEmotion: 0,
    mentalAbility: 0,
  }
}

function createInitialDetectionData() {
  return {
    LeftTopValueData: createZeroArray(NEGATIVE_NAMES.length),
    leftBottomValueData: createZeroArray(MENTAL_ABILITY_NAMES.length),
    rightTopValueData: createRightTopData(),
    psychologyData: createZeroArray(12),
    positiveData: createZeroArray(12),
    negativeData: createZeroArray(12),
    analysisData: createInitialAnalysisData(),
  }
}

export default {
  components: { LeftTop, LeftBottom, RightTop, RightBottom, Middle },
  data() {
    return {
      ...createInitialDetectionData(),
      detailsId: "",
    }
  },
  methods: {
    handleEmotionChange(payload) {
      const {
        leftValueData,
        leftBottomValueData,
        rightTopValueData,
        ZMrightBottom,
        FMrightBottom,
        XLrightBottom,
      } = payload

      this.LeftTopValueData = leftValueData
      this.leftBottomValueData = leftBottomValueData
      this.rightTopValueData = rightTopValueData
      this.psychologyData = XLrightBottom
      this.positiveData = ZMrightBottom
      this.negativeData = FMrightBottom
    },
    resetDetectionData() {
      Object.assign(this, createInitialDetectionData())
    },
    createReportPayload() {
      return {
        image_analysis: {
          name: SUMMARY_NAMES,
          value: [
            this.analysisData.smileIndex,
            this.analysisData.positiveEmotion,
            this.analysisData.negativeEmotion,
            this.analysisData.mentalAbility,
          ],
        },
        comprehensive: [
          { name: TREND_NAMES.psychology, value: this.psychologyData },
          { name: TREND_NAMES.positive, value: this.positiveData },
          { name: TREND_NAMES.negative, value: this.negativeData },
        ],
        negative: {
          name: NEGATIVE_NAMES,
          value: this.LeftTopValueData,
        },
        positive: {
          name: RIGHT_TOP_NAMES,
          value: this.rightTopValueData,
        },
        mental_ability: {
          name: MENTAL_ABILITY_NAMES,
          value: this.leftBottomValueData,
        },
      }
    },
    async handleReportAdd(analysisData) {
      this.analysisData = analysisData
      const { data } = await addSmileAssess(this.createReportPayload())

      if (data.code == this.$global.successCode) {
        this.$myMessage({
          type: "font-success",
          message: data.msg,
        })
        this.detailsId = data.data.id
        this.resetDetectionData()
      }
    },

    handleLookReport() {
      if (!this.detailsId) {
        this.$myMessage({
          type: "font-error",
          message: "请先检测",
        })
        return
      }
      this.$router.push({
        path: "/report/emotionReport",
        query: {
          id: this.detailsId,
          type: "检测报告",
        },
      })
    },
  },
}
</script>

<style scoped lang="scss">
.index {
  width: 100vw;
  height: 100vh;
  position: relative;
  .content_wrap {
    width: 96%;
    height: 850px;
    position: absolute;
    top: 52%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: space-between;
    > div {
      background-size: 100% 100%;
      &.left,
      &.right {
        width: 600px;
        height: 850px;
        display: flex;
        flex-wrap: wrap;
        align-content: space-between; /* 上下分布 */
        > div {
          height: 410px;
          width: 100%;
          background-image: url("@/assets/img/front/detection/标题框.png");
          background-size: 100% 100%;
          .title_text {
            font-size: 20px;
            font-family: "ziyuanyuanti600W";
            letter-spacing: 1px;
            color: #ffffff;
            background: linear-gradient(172deg, #ffffff 1%, #afe0fc 99%);
            -webkit-background-clip: text;
            color: transparent;
            line-height: 35px;
            padding-left: 40px;
          }
          .nengli_list {
            width: 80%;
            display: flex;
            justify-content: space-between;
            margin: 0 auto;
            > div {
              width: 122px;
              height: 50px;
              color: #fff;
              text-align: center;
              background-size: 100% 100%;
              background-image: url("@/assets/img/front/detection/指标.png");
              > p {
                font-size: 18px;
                font-family: "ziyuanyuanti600W";
              }
              > div {
                font-size: 14px;
                font-family: "ziyuanyuanti400W";
              }
            }
          }
        }
      }
    }
    > .middle {
      width: 580px;
      height: 850px;
      background-image: url("@/assets/img/front/detection/中间框.png");
      position: relative;
      display: flex;
      padding-top: 60px;
      box-sizing: border-box;
      .title_text {
        position: absolute;
        left: 0px;
        top: 2px;
        font-size: 20px;
        font-family: "ziyuanyuanti600W";
        letter-spacing: 1px;
        color: #ffffff;
        background: linear-gradient(172deg, #ffffff 1%, #afe0fc 99%);
        -webkit-background-clip: text;
        color: transparent;
        line-height: 35px;
        padding-left: 40px;
      }
    }
    > .right {
      > div {
        .chart_wrap {
          width: 80%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 30px auto 0 auto;
          .pie_chart {
            width: 215px;
            height: 215px;
            background-image: url("@/assets/img/front/detection/圈.png");
            background-size: 100% 100%;
          }
        }
        .line {
          width: 55px;
          height: 260px;
          background-image: url("@/assets/img/front/detection/line.png");
          background-size: 100% 100%;
        }
        .chart_title {
          > div {
            display: flex;
            align-items: center;
            > i {
              width: 7px;
              height: 7px;
              display: block;
              border-radius: 50%;
              margin-right: 15px;
              margin-top: 4px;
            }
            > div {
              font-size: 14px;
              font-family: "ziyuanyuanti400W";
              color: #ffffff;
              line-height: 40px;
            }
            &:nth-child(1) {
              > i {
                background: #2447f7;
              }
            }
            &:nth-child(2) {
              > i {
                background: #24dcf7;
              }
            }
            &:nth-child(3) {
              > i {
                background: #ffdb15;
              }
            }
            &:nth-child(4) {
              > i {
                background: #10e8aa;
              }
            }
            &:nth-child(5) {
              > i {
                background: #ff3434;
              }
            }
          }
        }
      }
    }
  }
}
</style>
