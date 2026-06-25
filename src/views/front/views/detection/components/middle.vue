<template>
  <div class="index">
    <div class="ph_wrap">
      <video
        ref="videoRef"
        v-show="currentState === 'shooting'"
        class="faceImg face-video"
        autoplay
        muted
        playsinline
      ></video>
      <canvas
        ref="faceCanvas"
        class="faceImg face-canvas"
        :style="{
          display: currentState === 'shooting' ? 'block' : 'none',
        }"
      ></canvas>
      <div v-if="cameraLoading" class="camera-loading">
        <div class="loading-ring"></div>
        <div class="loading-title">{{ cameraLoadingText }}</div>
        <div class="loading-subtitle">请保持面部在识别区域内</div>
      </div>
      <div
        v-if="currentState === 'shooting' && faceEmotionVisible"
        class="face-emotion-badge"
        :style="{ color: faceEmotionColor, borderColor: faceEmotionColor }"
      >
        {{ faceEmotionLabel }}
      </div>
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
        <button class="blue" @click="startFaceDetection()">开始检测</button>
        <button class="yellow" @click="$router.back()">退出拍摄</button>
      </template>
      <template v-if="currentState === 'shooting'">
        <button class="blue" disabled>正在检测</button>
        <button class="red" @click="stopFaceDetection">停止检测</button>
      </template>
      <template v-if="currentState === 'analyzed'">
        <button class="blue" @click="restartFaceDetection">重新检测</button>
        <button class="green" @click="$emit('lookReport')">查看完整报告</button>
      </template>
    </div>
  </div>
</template>

<script>
import * as faceapi from "face-api.js"
import {
  createInitialPanelState,
  createPanelDataFromExpressions,
} from "../composables/usePanelData.js"

const MODEL_URL = "/models"
const TREND_SIZE = 12
const DETECTION_DURATION = 10000
const PROGRESS_INTERVAL = 100
const PANEL_UPDATE_INTERVAL = 300

const FACE_EMOTION_META = {
  angry: { label: "愤怒", color: "#ff3434" },
  disgusted: { label: "厌恶", color: "#27ae60" },
  fearful: { label: "恐惧", color: "#9b59b6" },
  happy: { label: "开心", color: "#ffd700" },
  neutral: { label: "平静", color: "#00d4ff" },
  sad: { label: "悲伤", color: "#5c9ce6" },
  surprised: { label: "惊讶", color: "#f39c12" },
}

function clampScore(value) {
  const score = Math.round(Number(value) || 0)
  return Math.min(100, Math.max(10, score))
}

function average(values) {
  const validValues = values.filter((value) => Number.isFinite(Number(value)))
  if (!validValues.length) return 0
  return Math.round(validValues.reduce((total, value) => total + Number(value), 0) / validValues.length)
}
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
      capturedImage: null,
      progressTimer: null,
      modelsLoaded: false,
      faceStream: null,
      detectFrameId: null,
      faceDetecting: false,
      cameraLoading: false,
      cameraLoadingText: "正在启动摄像头...",
      faceEmotionVisible: false,
      faceEmotionLabel: "",
      faceEmotionColor: "#00d4ff",
      lastPanelEmitTime: 0,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.canvas = this.$refs.faceCanvas
      this.video = this.$refs.videoRef
      this.ctx = this.canvas && this.canvas.getContext("2d")
    })
  },
  methods: {
    async startFaceDetection() {
      if (this.$store.getters.isGuest) {
        this.$myMessage.error("游客暂无权限")
        return
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.$myMessage.error("当前浏览器不支持摄像头调用")
        return
      }

      try {
        await this.openFaceCamera()
      } catch (error) {
        console.error("Face detection start failed", error)
        this.$myMessage.error("摄像头打开失败，请检查权限或设备")
        this.stopFaceDetection()
      }
    },
    async openFaceCamera() {
      this.stopFaceCore()
      this.resetCheck()
      this.emitZeroDetectionData()

      this.currentState = "shooting"
      this.cameraLoading = true
      this.cameraLoadingText = "正在加载识别模型..."
      this.detectionProgress = 0
      this.capturedImage = null
      this.analysisData = {
        smileIndex: 0,
        positiveEmotion: 0,
        negativeEmotion: 0,
        mentalAbility: 0,
      }

      await this.loadFaceModels()

      this.cameraLoadingText = "正在请求摄像头权限..."
      this.faceStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      })

      this.video = this.$refs.videoRef
      this.canvas = this.$refs.faceCanvas
      this.ctx = this.canvas && this.canvas.getContext("2d")

      if (!this.video || !this.canvas || !this.ctx) {
        throw new Error("Camera view is not ready")
      }

      this.cameraLoadingText = "正在启动摄像头画面..."
      this.video.srcObject = this.faceStream
      await this.waitForVideoReady(this.video)
      await this.video.play()

      this.cameraLoading = false
      this.faceDetecting = true
      this.startFaceProgress()
      this.runFaceDetection()
    },
    async loadFaceModels() {
      if (this.modelsLoaded) return

      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      this.modelsLoaded = true
    },
    waitForVideoReady(video) {
      if (video.readyState >= 2) {
        return Promise.resolve()
      }

      return new Promise((resolve, reject) => {
        const cleanup = () => {
          video.removeEventListener("loadedmetadata", onReady)
          video.removeEventListener("error", onError)
        }
        const onReady = () => {
          cleanup()
          resolve()
        }
        const onError = () => {
          cleanup()
          reject(new Error("Video metadata failed to load"))
        }

        video.addEventListener("loadedmetadata", onReady)
        video.addEventListener("error", onError)
      })
    },
    startFaceProgress() {
      if (this.progressTimer) {
        clearInterval(this.progressTimer)
        this.progressTimer = null
      }

      const step = 100 / (DETECTION_DURATION / PROGRESS_INTERVAL)
      let currentProgress = 0

      this.progressTimer = setInterval(() => {
        currentProgress += step
        this.detectionProgress = Math.min(100, Math.round(currentProgress))

        if (currentProgress >= 100) {
          clearInterval(this.progressTimer)
          this.progressTimer = null
          this.captureAndCompleteDetection()
        }
      }, PROGRESS_INTERVAL)
    },
    async runFaceDetection() {
      if (!this.faceDetecting || !this.video || !this.canvas || !this.ctx) return

      const displaySize = {
        width: this.video.clientWidth || 500,
        height: this.video.clientHeight || 450,
      }

      this.canvas.width = displaySize.width
      this.canvas.height = displaySize.height
      faceapi.matchDimensions(this.canvas, displaySize)

      try {
        const detection = await faceapi
          .detectSingleFace(
            this.video,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 224,
              scoreThreshold: 0.45,
            }),
          )
          .withFaceExpressions()

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        if (detection) {
          const resizedDetection = faceapi.resizeResults(detection, displaySize)
          this.drawFaceDetection(resizedDetection)
          this.handleFaceResult(resizedDetection)
        }
      } catch (error) {
        console.error("Face detection loop failed", error)
      }

      if (this.faceDetecting) {
        this.detectFrameId = requestAnimationFrame(() => this.runFaceDetection())
      }
    },
    drawFaceDetection(detection) {
      if (!detection || !detection.detection || !detection.expressions) return

      const dominantExpression = Object.entries(detection.expressions).sort((a, b) => b[1] - a[1])[0]
      const emotionKey = dominantExpression ? dominantExpression[0] : "neutral"
      const emotionScore = dominantExpression ? Math.round(dominantExpression[1] * 100) : 0
      const emotionMeta = FACE_EMOTION_META[emotionKey] || FACE_EMOTION_META.neutral
      const label = `${emotionMeta.label} ${emotionScore}%`
      const box = detection.detection.box
      const ctx = this.ctx

      this.faceEmotionVisible = true
      this.faceEmotionLabel = label
      this.faceEmotionColor = emotionMeta.color

      if (!ctx || !box) return

      const x = Math.max(0, box.x)
      const y = Math.max(0, box.y)
      const width = Math.min(box.width, this.canvas.width - x)
      const height = Math.min(box.height, this.canvas.height - y)
      const labelHeight = 30

      ctx.save()
      ctx.font = "bold 18px sans-serif"
      const labelWidth = Math.max(ctx.measureText(label).width + 28, 104)
      ctx.lineWidth = 4
      ctx.strokeStyle = emotionMeta.color
      ctx.shadowColor = emotionMeta.color
      ctx.shadowBlur = 12
      ctx.strokeRect(x, y, width, height)

      ctx.shadowBlur = 0
      ctx.fillStyle = "rgba(2, 12, 36, 0.86)"
      ctx.fillRect(x, y, labelWidth, labelHeight)
      ctx.fillStyle = emotionMeta.color
      ctx.fillText(label, x + 12, y + 21)
      ctx.restore()
    },
    handleFaceResult(detection) {
      if (!detection || !detection.expressions) return

      const now = Date.now()
      if (now - this.lastPanelEmitTime < PANEL_UPDATE_INTERVAL) {
        return
      }

      this.lastPanelEmitTime = now
      const panelState = createPanelDataFromExpressions(detection.expressions, {
        motionInterval: PANEL_UPDATE_INTERVAL,
      })
      this.updateAnalysisFromPanel(panelState, detection.expressions)
      this.emitDetectionData(panelState)
    },
    updateAnalysisFromPanel(panelState, expressions) {
      const rightTopScores = panelState.rightTopData.map((item) => item.value)
      const negativeScores = panelState.leftTopData.slice(0, 6)
      const abilityScores = [
        panelState.leftBottomData[0],
        panelState.leftBottomData[2],
        panelState.leftBottomData[3],
        panelState.leftBottomData[4],
        panelState.leftBottomData[6],
        panelState.leftBottomData[7],
      ]

      const positiveEmotion = average(rightTopScores)
      const negativeEmotion = average(negativeScores)
      const mentalAbility = average(abilityScores)
      const smileIndex = clampScore((expressions.happy || 0) * 100 + positiveEmotion * 0.35)

      this.analysisData = {
        smileIndex,
        positiveEmotion,
        negativeEmotion,
        mentalAbility,
      }
    },
    emitDetectionData(panelState) {
      const payload = this.createDetectionPayload(panelState)
      console.log("Detection panel data", payload)
      this.$emit("emotion-change", payload)
    },
    emitZeroDetectionData() {
      this.$emit("emotion-change", this.createZeroDetectionPayload())
    },
    createDetectionPayload(panelState) {
      return {
        leftValueData: [...panelState.leftTopData],
        leftBottomValueData: [...panelState.leftBottomData],
        rightTopValueData: panelState.rightTopData.map((item) => ({ ...item })),
        ZMrightBottom: this.toTrendData(panelState.rightBottomData.positiveData),
        FMrightBottom: this.toTrendData(panelState.rightBottomData.negativeData),
        XLrightBottom: this.toTrendData(panelState.rightBottomData.psychologyData),
      }
    },
    createZeroDetectionPayload() {
      const panelState = createInitialPanelState()
      return {
        leftValueData: panelState.leftTopData,
        leftBottomValueData: panelState.leftBottomData,
        rightTopValueData: panelState.rightTopData,
        ZMrightBottom: Array(TREND_SIZE).fill(0),
        FMrightBottom: Array(TREND_SIZE).fill(0),
        XLrightBottom: Array(TREND_SIZE).fill(0),
      }
    },
    toTrendData(data) {
      const values = Array.isArray(data) ? data.slice(0, TREND_SIZE).map(clampScore) : []

      if (!values.length) {
        return Array(TREND_SIZE).fill(0)
      }

      while (values.length < TREND_SIZE) {
        const index = values.length
        const previous = values[index - 1] || values[0]
        const swing = Math.round(Math.sin(Date.now() / 400 + index) * 8 + Math.cos(Date.now() / 900 + index * 1.7) * 6)
        values.push(clampScore(previous + swing))
      }

      return values
    },
    captureAndCompleteDetection() {
      this.captureCurrentFrame()
      this.$emit("report-add", this.analysisData)
      this.stopFaceCore()
      this.currentState = "analyzed"
    },
    captureCurrentFrame() {
      const video = this.$refs.videoRef
      if (!video || !video.videoWidth || !video.videoHeight) {
        if (this.canvas && this.ctx) {
          this.capturedImage = this.canvas.toDataURL("image/jpeg")
        }
        return
      }

      const snapshot = document.createElement("canvas")
      snapshot.width = video.videoWidth
      snapshot.height = video.videoHeight
      const snapshotContext = snapshot.getContext("2d")
      snapshotContext.drawImage(video, 0, 0, snapshot.width, snapshot.height)
      this.capturedImage = snapshot.toDataURL("image/jpeg")
    },
    stopFaceDetection() {
      this.stopFaceCore()
      this.resetCheck()
      this.emitZeroDetectionData()
    },
    restartFaceDetection() {
      this.stopFaceCore()
      this.resetCheck()
      this.emitZeroDetectionData()
    },
    stopFaceCore() {
      this.faceDetecting = false
      this.cameraLoading = false
      this.faceEmotionVisible = false

      if (this.detectFrameId) {
        cancelAnimationFrame(this.detectFrameId)
        this.detectFrameId = null
      }

      if (this.progressTimer) {
        clearInterval(this.progressTimer)
        this.progressTimer = null
      }

      if (this.faceStream) {
        this.faceStream.getTracks().forEach((track) => track.stop())
        this.faceStream = null
      }

      if (this.video) {
        this.video.pause()
        this.video.srcObject = null
      }

      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      }
    },
    resetCheck() {
      this.currentState = "prescoring"
      this.detectionProgress = 0
      this.capturedImage = null
      if (this.progressTimer) {
        clearInterval(this.progressTimer)
        this.progressTimer = null
      }
    },
  },
  beforeDestroy() {
    this.stopFaceCore()
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
    position: relative;
    overflow: hidden;
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
    .face-video,
    .face-canvas {
      position: absolute;
      left: 19px;
      top: 19px;
      object-fit: cover;
    }
    .face-video {
      background: #ffffff;
      z-index: 1;
    }
    .face-canvas {
      background: transparent;
      pointer-events: none;
      z-index: 2;
    }
    .face-emotion-badge {
      position: absolute;
      left: 34px;
      top: 34px;
      z-index: 3;
      min-width: 110px;
      height: 36px;
      line-height: 34px;
      padding: 0 14px;
      box-sizing: border-box;
      border: 2px solid;
      border-radius: 4px;
      background: rgba(2, 12, 36, 0.84);
      font-size: 18px;
      font-family: "ziyuanyuanti600W";
      text-align: center;
      text-shadow: 0 0 10px currentColor;
      box-shadow: 0 0 18px currentColor, inset 0 0 16px rgba(0, 212, 255, 0.18);
      pointer-events: none;
    }
    .camera-loading {
      position: absolute;
      left: 19px;
      top: 19px;
      z-index: 4;
      width: 500px;
      height: 450px;
      border-radius: 23px;
      background: rgba(2, 12, 36, 0.82);
      box-shadow: inset 0 0 34px rgba(0, 212, 255, 0.35);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      pointer-events: none;
    }
    .loading-ring {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      border: 4px solid rgba(0, 212, 255, 0.18);
      border-top-color: #00d4ff;
      border-right-color: #10e8aa;
      animation: cameraLoadingSpin 1s linear infinite;
      box-shadow: 0 0 28px rgba(0, 212, 255, 0.45);
    }
    .loading-title {
      margin-top: 22px;
      font-size: 20px;
      font-family: "ziyuanyuanti600W";
      color: #dff7ff;
      text-shadow: 0 0 12px rgba(0, 212, 255, 0.7);
    }
    .loading-subtitle {
      margin-top: 10px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.74);
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

@keyframes cameraLoadingSpin {
  to {
    transform: rotate(360deg);
  }
}
</style>
