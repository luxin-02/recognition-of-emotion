<template>
  <transition name="fade">
    <div class="popup_mask" v-if="isShow">
      <div class="shoot_wrap">
        <div class="ph_wrap">
          <canvas
            ref="faceCanvas"
            class="faceImg"
            :style="{
              transform: ' rotateY(180deg)',
            }"
          ></canvas>
        </div>
        <div class="tips_text">
          {{ tipsText }}
        </div>

        <div class="tips_img">
          <div class="paishe_zhon" v-if="isStateVisible('shooting')">
            <div>面部无遮挡</div>
            <div>正对设备</div>
            <div>光线充足</div>
            <div>保持不动</div>
          </div>
          <div class="paishe_hou" v-if="isStateVisible('shot')">
            <div></div>
          </div>
          <div class="paishe_fenxizhon" v-if="isStateVisible('analyzing')">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </div>
          <div class="paishe_fenxihou" v-if="isStateVisible('analyzed')">
            <div>
              <p>微笑指数</p>
              <i>{{ analysisData.smileIndex }}分</i>
            </div>
            <div>
              <p>正面情绪</p>
              <i>{{ analysisData.positiveEmotion }}分</i>
            </div>
            <div>
              <p>负面情绪</p>
              <i>{{ analysisData.negativeEmotion }}分</i>
            </div>
            <div>
              <p>心理能力</p>
              <i>{{ analysisData.mentalAbility }}分</i>
            </div>
          </div>
          <div class="paishe_fenxihou old_analysis" v-if="false">
            <div>
              <p>微笑指数</p>
              <i>100分</i>
            </div>
            <div>
              <p>正面情绪</p>
              <i>100分</i>
            </div>
            <div>
              <p>负面情绪</p>
              <i>100分</i>
            </div>
            <div>
              <p>心理能力</p>
              <i>100分</i>
            </div>
          </div>
        </div>

        <div class="btn_wrap">
          <button @click="handleButtonClick('left', currentState)">
            {{ buttonTexts.left }}
          </button>
          <button @click="handleButtonClick('right', currentState)">
            {{ buttonTexts.right }}
          </button>
        </div>

        <div class="close" @click="cancel()"></div>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  FaceRecognitionCore,
  createFaceData,
  createMoodData,
} from "@/mixins/shoot/faceRecognitionCore.js"
export default {
  data() {
    return {
      faceData: createFaceData(),
      moodData: createMoodData(),
      faceCore: null,
      isShow: false,
      analysisTimer: null,
      analysisData: {
        smileIndex: 0,
        positiveEmotion: 0,
        negativeEmotion: 0,
        mentalAbility: 0,
      },
      // 四个状态：shooting(拍摄中) -> shot(拍摄后) -> analyzing(分析中) -> analyzed(分析后)
      currentState: "shooting",
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // 根据状态显示对应的UI组件
    tipsText() {
      const tipsMap = {
        shooting: "请在光线充足的地方进行检测，避免曝光或背光。",
        shot: "请在光线充足的地方进行检测，避免曝光或背光。",
        analyzing: "照片情绪分析中，请勿关闭...",
        analyzed: "分析完成！",
      }
      return tipsMap[this.currentState] || ""
    },
    buttonTexts() {
      const buttonMap = {
        shooting: { left: "开始拍摄", right: "取消拍摄" },
        shot: { left: "分析照片", right: "重新拍摄" },
        analyzing: { left: "发布打卡照片", right: "重新拍摄" },
        analyzed: { left: "发布打卡照片", right: "重新拍摄" },
      }
      return buttonMap[this.currentState] || { left: "", right: "" }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.isShow = this.show
      if (this.show) {
        this.openPhoto()
      }
    })
    this.faceCore = new FaceRecognitionCore({
      canvas: () => this.$refs.faceCanvas,
      faceData: this.faceData,
      moodData: this.moodData,
      manualCapture: true,
      onMoodChange: ({ emotionMap, moodData }) => {
        // 拍摄过程中会持续更新
        console.log(emotionMap, moodData)
      },
      onCapture: ({ image, emotionMap }) => {
        // 识别稳定后截图
        console.log(image, emotionMap)
      },
      onMessage: this.showMessage,
    })
  },
  methods: {
    // 判断状态是否显示对应的UI组件
    isStateVisible(state) {
      return this.currentState === state
    },
    // 统一的按钮点击处理方法
    handleButtonClick(action, state) {
      if (action === "left" && state === "shot") {
        this.analyzePhoto()
        return
      }
      // TODO: 根据 action(left/right) 和 state(shooting/shot/analyzing/analyzed) 执行对应的逻辑
      // 示例框架：
      if (action === "left") {
        switch (state) {
          case "shooting": // 开始拍摄
            this.startPhoto()
            break
          case "shot": // 分析照片
            break
          case "analyzing":
          case "analyzed": // 发布打卡照片
            console.log("发布打卡照片", this.analysisData)
            break
        }
      } else if (action === "right") {
        switch (state) {
          case "shooting": // 取消拍摄
            this.cancel()
            break
          case "shot":
          case "analyzing":
          case "analyzed": // 重新拍摄
            this.currentState = "shooting"
            this.rePhoto()
            break
        }
      }
    },
    cancel() {
      this.clearAnalysisTimer()
      this.stopPhoto()
      this.isShow = false
      this.$emit("update:show", false)
    },
    openPhoto() {
      this.clearAnalysisTimer()
      this.resetAnalysisData()
      this.currentState = "shooting"
      this.faceCore && this.faceCore.startCapture()
    },
    startPhoto() {
      if (!this.faceCore) return
      this.faceCore.capturePhoto()
      this.currentState = "shot"
    },
    rePhoto() {
      this.clearAnalysisTimer()
      this.resetAnalysisData()
      this.faceCore && this.faceCore.restartCapture()
    },
    stopPhoto() {
      this.faceCore && this.faceCore.stopCapture()
    },
    analyzePhoto() {
      this.clearAnalysisTimer()
      this.currentState = "analyzing"
      this.analysisTimer = setTimeout(() => {
        this.analysisData = {
          smileIndex: this.randomAnalysisScore(),
          positiveEmotion: this.randomAnalysisScore(),
          negativeEmotion: this.randomAnalysisScore(),
          mentalAbility: this.randomAnalysisScore(),
        }
        this.currentState = "analyzed"
        this.analysisTimer = null
      }, 2000)
    },
    randomAnalysisScore() {
      return Math.floor(Math.random() * 71) + 30
    },
    resetAnalysisData() {
      this.analysisData = {
        smileIndex: 0,
        positiveEmotion: 0,
        negativeEmotion: 0,
        mentalAbility: 0,
      }
    },
    clearAnalysisTimer() {
      if (this.analysisTimer) {
        clearTimeout(this.analysisTimer)
        this.analysisTimer = null
      }
    },
  },
  watch: {
    show(newV) {
      this.isShow = newV
      if (newV) {
        this.$nextTick(() => {
          this.faceCore && this.faceCore.setCanvas(() => this.$refs.faceCanvas)
          this.openPhoto()
        })
      } else {
        this.clearAnalysisTimer()
        this.stopPhoto()
      }
    },
  },
  beforeDestroy() {
    this.clearAnalysisTimer()
    this.faceCore && this.faceCore.destroy()
  },
}
</script>

<style lang="scss" scoped>
.popup_mask {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 99;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #00000080;
  font-size: 0;
  .shoot_wrap {
    width: 700px;
    height: 1025px;
    background-image: url(@/assets/img/front/smileCheck/打卡框.png);
    background-size: 100% 100%;
    padding: 160px 0 0 0;
    box-sizing: border-box;
    position: relative;
    .ph_wrap {
      width: 538px;
      height: 488px;
      background-image: url(@/assets/img/front/smileCheck/头像框.png);
      background-size: 100% 100%;
      margin: 0 auto;
      padding: 19px 0 0 19px;
      box-sizing: border-box;
      > img {
        width: 500px;
        height: 450px;
        background: #ffffff;
        border-radius: 23px;
      }
      .faceImg {
        width: 500px;
        height: 450px;
        border-radius: 23px;
      }
    }
    .tips_text {
      width: 90%;
      font-size: 18px;
      font-family: "ziyuanyuanti400W";
      font-weight: 400;
      text-align: center;
      color: #ffffff;
      letter-spacing: 0.9px;
      margin: 20px auto 20px auto;
    }
    .tips_img {
      width: 75%;
      height: 135px;
      margin: 0 auto;
      .paishe_zhon {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > div {
          width: 106px;
          height: 135px;
          font-size: 16px;
          font-family: "ziyuanyuanti400W";
          text-align: center;
          color: #ffffff;
          padding: 90px 0 0 0;
          box-sizing: border-box;
          background-size: 100% 100%;
          &:nth-child(1) {
            background-image: url(@/assets/img/front/smileCheck/面部无遮挡.png);
          }
          &:nth-child(2) {
            background-image: url(@/assets/img/front/smileCheck/正对设备.png);
          }
          &:nth-child(3) {
            background-image: url(@/assets/img/front/smileCheck/光线充足.png);
          }
          &:nth-child(4) {
            background-image: url(@/assets/img/front/smileCheck/保持不动.png);
          }
        }
      }
      .paishe_hou {
        display: flex;
        align-items: center;
        justify-content: center;
        > div {
          width: 120px;
          height: 120px;
          background-size: 100% 100%;
          background-image: url(@/assets/img/front/smileCheck/相机.png);
        }
      }
      .paishe_fenxizhon {
        width: 135px;
        height: 135px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 auto;
        > i {
          width: 15px;
          height: 15px;
          display: block;
          border-radius: 5px;
          &:nth-child(1) {
            background-color: #1999fd;
          }
          &:nth-child(2) {
            background-color: #1b9efc;
          }
          &:nth-child(3) {
            background-color: #1fb1fd;
          }
          &:nth-child(4) {
            background-color: #1dc8f8;
          }
          &:nth-child(5) {
            background-color: #22d1fc;
          }
        }
      }
      .paishe_fenxihou {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > div {
          width: 106px;
          height: 135px;
          font-size: 16px;
          font-family: "ziyuanyuanti400W";
          text-align: center;
          color: #ffffff;
          padding: 60px 0 0 0;
          box-sizing: border-box;
          background-size: 100% 100%;

          &:nth-child(1) {
            background-image: url(@/assets/img/front/smileCheck/微笑指数.png);
            > i {
              color: #35b8fc;
            }
          }
          &:nth-child(2) {
            background-image: url(@/assets/img/front/smileCheck/正面情绪.png);
            > i {
              color: #10c86b;
            }
          }
          &:nth-child(3) {
            background-image: url(@/assets/img/front/smileCheck/负面情绪.png);
            > i {
              color: #f27803;
            }
          }
          &:nth-child(4) {
            background-image: url(@/assets/img/front/smileCheck/心理能力.png);
            > i {
              color: #ff4f95;
            }
          }
        }
      }
    }
    .btn_wrap {
      width: 80%;
      display: flex;
      justify-content: space-between;
      margin: 20px auto;
      > button {
        width: 268px;
        height: 70px;
        background-color: #00000000;
        background-size: 100% 100%;
        font-size: 18px;
        font-family: "ziyuanyuanti400W";
        color: #ffffff;
        &:nth-child(1) {
          background-image: url(@/assets/img/front/smileCheck/btn1.png);
        }
        &:nth-child(2) {
          background-image: url(@/assets/img/front/smileCheck/btn2.png);
        }
      }
    }
    .close {
      width: 50px;
      height: 50px;
      background-image: url(@/assets/img/front/smileCheck/关闭.png);
      background-size: 100% 100%;
      position: absolute;
      right: 60px;
      top: 80px;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;

  .popup-box {
    transition: all 0.5s;
  }
}

.fade-enter {
  opacity: 0;

  .popup-box {
    transform: scale(0, 0);
  }
}

.fade-enter-to {
  opacity: 1;

  .popup-box {
    transform: scale(1, 1);
  }
}

.fade-leave {
  opacity: 1;

  .popup-box {
    transform: scale(1, 1);
  }
}

.fade-leave-to {
  opacity: 0;

  .popup-box {
    transform: scale(0, 0);
  }
}
</style>
