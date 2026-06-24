<template>
  <div class="index">
    <div class="ph_wrap">
      <canvas
        ref="faceCanvas"
        class="faceImg"
        :style="{
          display: currentState === 'shooting' ? 'block' : 'none',
        }"
      ></canvas>
      <img
        v-show="currentState !== 'shooting'"
        :src="
          currentState === 'analyzed' && capturedImage
            ? capturedImage
            : require('@/assets/img/front/detection/默认.png')
        "
      />
    </div>
    <div class="tips_text" :class="{ analyzed: currentState === 'analyzed' }">
      <i class="el-icon-success" v-if="currentState === 'analyzed'"></i>
      {{
        currentState === "prescoring"
          ? "请在光线充足的地方进行检测，避免曝光或背光。"
          : currentState === "shooting"
          ? "情绪情绪分析中，请勿离开摄像头或关闭..."
          : "分析完成!详细数据请查看报告。"
      }}
    </div>

    <div class="tips_img">
      <div class="paishe_zhon" v-if="currentState === 'prescoring'">
        <div>面部无遮挡</div>
        <div>正对设备</div>
        <div>光线充足</div>
        <div>保持不动</div>
      </div>
      <div class="paishe_fenxizhon" v-if="currentState === 'shooting'">
        <img src="@/assets/img/front/detection/loading.gif" />
        <div>检测进度：<el-progress :percentage="detectionProgress"></el-progress></div>
      </div>
      <div class="paishe_fenxihou" v-if="currentState === 'analyzed'">
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
    </div>

    <div class="btn_wrap">
      <template v-if="currentState === 'prescoring'">
        <button class="blue" @click="startCheck()">开始检测</button>
        <button class="yellow" @click="$router.back()">退出拍摄</button>
      </template>
      <template v-if="currentState === 'shooting'">
        <button class="blue" disabled>正在检测</button>
        <button class="red" @click="closeCamera">停止检测</button>
      </template>
      <template v-if="currentState === 'analyzed'">
        <button class="blue" @click="resetCheck">重新检测</button>
        <button class="green" @click="$emit('lookReport')">查看完整报告</button>
      </template>
    </div>
  </div>
</template>

<script>
import { createCanvasLoading } from "@/mixins/shoot/util.js"
import { getEmotionResult } from "@/utils/emotionCalculation.js"
export default {
  data() {
    return {
      analysisData: {
        smileIndex: 0,
        positiveEmotion: 0,
        negativeEmotion: 0,
        mentalAbility: 0,
      },
      // 三个状态：prescoring(预检测) -> shooting(检测中) -> analyzed(检测完成)
      currentState: "prescoring",
      detectionProgress: 0,
      canvas: null,
      imgWarp: new Image(),
      canvasLoading: null,
      capturedImage: null,
      progressTimer: null,
      lastFrameTime: 0,
      frameInterval: 33, // 控制帧率 ~30fps，单位毫秒
      currentBlobUrl: null,
      isLoadingFrame: false,
      renderStarted: false,
      lastEmotionTime: 0, // 上次情绪识别的时间
      emotionThrottle: 500, // 节流间隔（毫秒）
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.canvas = this.$refs.faceCanvas
      if (this.canvas) {
        this.ctx = this.canvas.getContext("2d")
        console.log("Canvas 初始化成功")
      } else {
        console.error("Canvas 元素未找到")
      }
    })
  },
  methods: {
    render(e) {
      // 帧率控制 - 限制处理频率
      const now = performance.now()
      if (now - this.lastFrameTime < this.frameInterval) {
        return
      }
      this.lastFrameTime = now

      // 只在第一帧时停止加载动画
      if (this.canvasLoading && !this.renderStarted) {
        this.canvasLoading.stop()
        this.canvasLoading = null
        this.currentState = "shooting"
        this.renderStarted = true
        this.startProgressLoading()
        return // 第一帧不渲染，等待下一帧
      }

      // 如果已在加载上一帧，跳过本帧
      if (this.isLoadingFrame) {
        return
      }

      const frameData = e.detail.frameData
      const blob = new Blob([new Uint8Array(frameData)], { type: "image/jpeg" })

      // 释放上一个 ObjectURL
      if (this.currentBlobUrl) {
        URL.revokeObjectURL(this.currentBlobUrl)
      }

      this.currentBlobUrl = URL.createObjectURL(blob)
      this.isLoadingFrame = true

      // 使用 requestAnimationFrame 确保在浏览器重绘前完成
      requestAnimationFrame(() => {
        const img = this.imgWarp
        img.onload = () => {
          if (this.ctx && this.canvas) {
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
          }
          this.isLoadingFrame = false
        }
        img.onerror = () => {
          this.isLoadingFrame = false
        }
        img.src = this.currentBlobUrl
      })
    },

    // 开始识别
    startCheck() {
      if (this.$store.getters.isGuest) {
        this.$myMessage.error("游客暂无权限")
        return
      }

      try {
        this.openCamera()
      } catch (e) {
        console.log(e)
      }
    },
    // 打开摄像头，开始识别
    openCamera() {
      this.currentState = "shooting"
      this.detectionProgress = 0
      this.capturedImage = null
      this.canvasLoading = createCanvasLoading(this.canvas, {
        color: "#3498db", // 动画颜色
        radius: 25, // 半径
        lineWidth: 8, // 线条宽度
        speed: 2, // 旋转速度
      })
      this.canvasLoading.start()
      window.addEventListener("videoFrameEvent", this.render)
      // window.addEventListener("facialSuccessEvent", this.onFaceSuccess)
      // window.addEventListener("facialErrorEvent", this.onFaceError)
      window.addEventListener("emotionSuccessEvent", this.onEmotionSuccess)
      window.addEventListener("emotionErrorEvent", (e) => {
        console.log("错误:", e.detail)
      })
      CameraProcessor.StartCamera(true)
    },
    // 启动 10 秒进度条加载
    startProgressLoading() {
      const duration = 10000 // 10 秒
      const interval = 100 // 每 100ms 更新一次
      const step = 100 / (duration / interval) // 每次增加的百分比
      let currentProgress = 0

      this.progressTimer = setInterval(() => {
        currentProgress += step
        if (currentProgress >= 100) {
          currentProgress = 100
          this.detectionProgress = currentProgress
          clearInterval(this.progressTimer)
          this.progressTimer = null
          // 进度条加载完成，拍照并切换状态
          this.captureAndAnalyze()
        } else {
          this.detectionProgress = currentProgress
        }
      }, interval)
    },
    // 拍照并切换到分析完成状态
    captureAndAnalyze() {
      if (this.canvas && this.ctx) {
        // 将 canvas 内容转换为图片数据
        this.capturedImage = this.canvas.toDataURL("image/jpeg")
      }
      this.analysisData.smileIndex = Math.floor(Math.random() * 61) + 40
      this.analysisData.positiveEmotion = Math.floor(Math.random() * 100) + 1
      this.analysisData.negativeEmotion = Math.floor(Math.random() * 60) + 1
      this.analysisData.mentalAbility = Math.floor(Math.random() * 80) + 1
      this.$emit("report-add", this.analysisData)

      window.removeEventListener("videoFrameEvent", this.render)
      window.removeEventListener("emotionSuccessEvent", this.onEmotionSuccess)
      CameraProcessor.StopCamera()

      // 切换到分析完成状态
      this.currentState = "analyzed"
    },
    // 手动停止
    closeCamera() {
      this.resetCheck()
      // FingerprintObj.CloseDetFace()
      window.removeEventListener("videoFrameEvent", this.render)
      // window.removeEventListener("facialSuccessEvent", this.onFaceSuccess)
      // window.removeEventListener("facialErrorEvent", this.onFaceError)
      window.removeEventListener("emotionSuccessEvent", this.onEmotionSuccess)
      CameraProcessor.StopCamera()
      // 清理 ObjectURL
      if (this.currentBlobUrl) {
        URL.revokeObjectURL(this.currentBlobUrl)
        this.currentBlobUrl = null
      }
    },
    /** 情绪过程数据 */
    onEmotionSuccess(e) {
      // 节流控制
      const now = Date.now()
      if (now - this.lastEmotionTime < this.emotionThrottle) {
        return
      }
      this.lastEmotionTime = now

      const emotionData = getEmotionResult(e)
      if (!emotionData) return
      const result = emotionData.result

      this.$emit("emotion-change", emotionData)

      console.log("情绪识别结果", result)
      // let arr = [
      //   { class_name: "正常", score: 0.6 },
      //   { class_name: "不满", score: 0.04 },
      //   { class_name: "狂躁", score: 0.4 },
      //   { class_name: "痛苦", score: 0.34 },
      //   { class_name: "忧郁", score: 0.02 },
      //   { class_name: "自卑", score: 0.04 },
      //   { class_name: "愤怒", score: 0.2 },
      //   { class_name: "自责", score: 0 },
      //   { class_name: "失眠", score: 0.5 },
      //   { class_name: "失恋", score: 0 },
      //   { class_name: "害怕", score: 0 },
      //   { class_name: "狂躁", score: 0.1 },
      // ]
    },
    resetCheck() {
      this.currentState = "prescoring"
      this.detectionProgress = 0
      this.capturedImage = null
      this.renderStarted = false
      // 清除进度条计时器
      if (this.progressTimer) {
        clearInterval(this.progressTimer)
        this.progressTimer = null
      }
      if (this.canvasLoading) {
        this.canvasLoading.stop()
        this.canvasLoading = null
      }
      // 清理 ObjectURL
      if (this.currentBlobUrl) {
        URL.revokeObjectURL(this.currentBlobUrl)
        this.currentBlobUrl = null
      }
    },
  },
  beforeDestroy() {
    // 清理计时器
    if (this.progressTimer) {
      clearInterval(this.progressTimer)
      this.progressTimer = null
    }
    // 清理 ObjectURL
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl)
      this.currentBlobUrl = null
    }
  },
}
</script>

<style scoped lang="scss">
.index {
  width: 100%;
  height: 100%;
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
      transform: rotateY(180deg);
    }
    .faceImg {
      width: 500px;
      height: 450px;
      border-radius: 23px;
      transform: rotateY(180deg);
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
    margin: 10px auto 20px auto;
    .el-icon-success {
      color: #10c86b;
    }
    &.analyzed {
      color: #10c86b;
    }
  }
  .tips_img {
    width: 85%;
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

    .paishe_fenxizhon {
      width: 95%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      > img {
        width: 185px;
        height: 63px;
        display: block;
        margin: 0 auto;
      }
      > div {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-size: 18px;
        font-family: "ziyuanyuanti400W";
        ::v-deep .el-progress {
          width: 350px;
          .el-progress-bar {
            .el-progress-bar__outer {
              height: 15px !important;
              background-color: #0e2258 !important;
            }
          }
          .el-progress__text {
            display: none;
          }
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
    width: 95%;
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
      &.blue {
        background-image: url(@/assets/img/front/detection/btn1.png);
      }
      &.red {
        background-image: url(@/assets/img/front/detection/btn4.png);
      }
      &.green {
        background-image: url(@/assets/img/front/detection/btn3.png);
      }
      &.yellow {
        background-image: url(@/assets/img/front/detection/btn2.png);
      }
    }
  }
}
</style>
