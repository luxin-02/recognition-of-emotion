<template>
  <div class="detector-container">
    <div class="detector-workspace">
      <section class="data-panel panel-left-top">
        <div class="panel-title">状态数据</div>
        <div class="metric-list">
          <div
            v-for="item in getPanelRows(leftTopLabels, leftTopData)"
            :key="item.name"
            class="metric-row"
          >
            <span>{{ item.name }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
      </section>

      <section class="data-panel panel-left-bottom">
        <div class="panel-title">能力指数</div>
        <div class="metric-list compact">
          <div
            v-for="item in getPanelRows(leftBottomLabels, leftBottomData)"
            :key="item.name"
            class="metric-row"
          >
            <span>{{ item.name }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
      </section>

      <section class="camera-section">
        <div class="camera-toolbar">
          <div class="camera-title-group">
            <span
              class="status-dot"
              :class="cameraReady ? 'active' : 'inactive'"
            ></span>
            <div>
              <h2>实时画面</h2>
              <p>{{ cameraReady ? "正在进行表情分析" : "等待摄像头接入" }}</p>
            </div>
          </div>
          <span class="local-badge">本地运行</span>
        </div>

        <div class="camera-wrapper">
          <video
            ref="videoRef"
            autoplay
            playsinline
            muted
            class="camera-video"
          ></video>
          <canvas ref="overlayCanvas" class="overlay-canvas"></canvas>

          <button
            v-if="cameraReady"
            class="btn-stop"
            type="button"
            @click="stopCamera"
          >
            结束识别
          </button>

          <div v-if="!cameraReady" class="camera-placeholder">
            <div class="placeholder-icon" aria-hidden="true">📷</div>
            <div class="placeholder-copy">
              <strong>摄像头尚未开启</strong>
              <span>画面与识别数据仅在当前设备处理</span>
            </div>
            <button class="btn-start" type="button" @click="startCamera">
              <span class="btn-icon" aria-hidden="true">▶</span>
              开启摄像头
            </button>
          </div>

          <div v-if="loading" class="camera-loading">
            <div class="spinner"></div>
            <p>正在加载本地模型...</p>
          </div>
        </div>

        <div class="camera-footer">
          <span>{{ cameraReady ? "实时检测中" : "检测已暂停" }}</span>
          <span class="privacy-note">离线模式 · 数据仅在本地处理</span>
        </div>
      </section>

      <section class="data-panel panel-right-top">
        <div class="panel-title">情绪指数</div>
        <div class="metric-list">
          <div
            v-for="item in rightTopData"
            :key="item.name"
            class="metric-row"
          >
            <span>{{ item.name }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
      </section>

      <section class="data-panel panel-right-bottom">
        <div class="panel-title">趋势数据</div>
        <div class="trend-group">
          <div
            v-for="item in rightBottomGroups"
            :key="item.key"
            class="trend-row"
          >
            <div class="trend-label">
              <span>{{ item.name }}</span>
              <strong>{{ item.data.join(", ") }}</strong>
            </div>
            <div class="trend-bars">
              <span
                v-for="(value, index) in item.data"
                :key="index"
                class="trend-bar"
                :style="{
                  height: getTrendHeight(value, item.data),
                  background: item.color,
                }"
              ></span>
            </div>
          </div>
        </div>
      </section>

      <aside class="result-panel" :style="{ borderColor: emotionData.color }">
        <div
          class="emotion-header"
          :style="{ background: emotionData.bgColor }"
        >
          <span class="section-kicker">当前识别结果</span>
          <div class="emotion-summary">
            <span class="emotion-label">{{ emotionData.label }}</span>
            <span class="emotion-live">实时</span>
          </div>
          <span class="emotion-desc">{{ emotionData.description }}</span>
        </div>

        <div class="expression-section">
          <div class="section-heading">
            <h3>情绪分布</h3>
            <span>7 项指标</span>
          </div>
          <div class="expression-bars">
            <div
              v-for="(value, key) in expressions"
              :key="key"
              class="expression-bar-item"
            >
              <div class="bar-label">
                <span>{{ expressionLabels[key] || key }}</span>
                <strong>{{ (value * 100).toFixed(0) }}%</strong>
              </div>
              <div class="bar-track">
                <div
                  class="bar-fill"
                  :style="{
                    width: value * 100 + '%',
                    background: barColors[key] || '#666',
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="composite-section">
          <div class="section-heading">
            <h3>辅助状态</h3>
            <span>趋势推测</span>
          </div>

          <div
            class="composite-highlight"
            :class="{ inactive: !compositeEmotion.active }"
            :style="{ borderColor: compositeEmotion.color }"
          >
            <div class="composite-highlight-title">
              <span
                class="composite-state-dot"
                :style="{ background: compositeEmotion.color }"
              ></span>
              <strong>{{ compositeEmotion.label }}</strong>
              <span v-if="compositeEmotion.active" class="composite-score">
                {{ (compositeEmotion.score * 100).toFixed(0) }}%
              </span>
            </div>
            <p>{{ compositeEmotion.description }}</p>
          </div>

          <div class="composite-grid">
            <div
              v-for="(value, key) in compositeScores"
              :key="key"
              class="composite-item"
            >
              <div class="composite-item-label">
                <span>{{ compositeEmotionOptions[key].label }}</span>
                <strong>{{ (value * 100).toFixed(0) }}%</strong>
              </div>
              <div class="composite-track">
                <div
                  class="composite-fill"
                  :style="{
                    width: value * 100 + '%',
                    background: compositeEmotionOptions[key].color,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="suggestions-section">
          <div class="section-heading">
            <h3>个性化建议</h3>
            <span>根据当前状态</span>
          </div>
          <ul class="suggestion-list">
            <li
              v-for="(suggestion, index) in emotionData.suggestions"
              :key="index"
              class="suggestion-item"
            >
              <span
                class="suggestion-dot"
                :style="{ background: emotionData.color }"
              ></span>
              <span>{{ suggestion }}</span>
            </li>
          </ul>
        </div>

        <button
          class="btn-action"
          type="button"
          :style="{
            color: emotionData.color,
            borderColor: emotionData.color,
            background: emotionData.bgColor,
          }"
        >
          {{ emotionData.actionLabel }}
        </button>
      </aside>
    </div>
  </div>
</template>

<script>
import * as faceapi from "face-api.js"
import { getEmotionInfo } from "./composables/useEmotionData.js"
import {
  COMPOSITE_EMOTIONS,
  createCompositeEmotionTracker,
  createInitialCompositeScores,
  getDominantCompositeEmotion,
} from "./composables/useCompositeEmotionData.js"
import {
  LEFT_BOTTOM_LABELS,
  LEFT_TOP_LABELS,
  createInitialPanelState,
  createPanelDataFromExpressions,
  createPanelDataSnapshot,
  createRightBottomGroups,
  getPanelRows as buildPanelRows,
  getTrendHeight as getPanelTrendHeight,
} from "./composables/usePanelData.js"

const MODEL_URL = "/models"

function createInitialExpressions() {
  return {
    angry: 0,
    disgusted: 0,
    fearful: 0,
    happy: 0,
    neutral: 0,
    sad: 0,
    surprised: 0,
  }
}

export default {
  name: "EmotionDetectorVue2",
  data() {
    const panelState = createInitialPanelState()

    return {
      cameraReady: false,
      loading: false,
      error: "",
      modelsLoaded: false,
      animationId: null,
      lastPanelPrintAt: 0,
      expressions: createInitialExpressions(),
      emotionData: getEmotionInfo(null),
      compositeScores: createInitialCompositeScores(),
      compositeEmotion: getDominantCompositeEmotion(
        createInitialCompositeScores(),
      ),
      compositeEmotionOptions: COMPOSITE_EMOTIONS,
      compositeTracker: createCompositeEmotionTracker(),
      leftTopLabels: ["焦虑", "抑郁", "压力", "失眠", "疲惫", "易怒", "放松"],
      leftTopData: [0, 0, 0, 0, 0, 0, 0],
      leftBottomLabels: [
        "抗压指数",
        "记忆力指数",
        "适应力指数",
        "专注力指数",
        "自控力指数",
        "心理负荷指数",
        "情绪平衡指数",
        "情绪稳定指数",
      ],
      leftBottomData: [0, 0, 0, 0, 0, 0, 0, 0],
      rightTopData: [
        { value: 1, name: "满足指数" },
        { value: 2, name: "放松指数" },
        { value: 3, name: "兴奋指数" },
        { value: 4, name: "乐观指数" },
        { value: 5, name: "自信指数" },
      ],
      rightBottomData: {
        psychologyData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        positiveData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        negativeData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      leftTopLabels: LEFT_TOP_LABELS,
      leftBottomLabels: LEFT_BOTTOM_LABELS,
      leftTopData: panelState.leftTopData,
      leftBottomData: panelState.leftBottomData,
      rightTopData: panelState.rightTopData,
      rightBottomData: panelState.rightBottomData,
      expressionLabels: {
        angry: "愤怒",
        disgusted: "厌恶",
        fearful: "恐惧",
        happy: "开心",
        neutral: "平静",
        sad: "悲伤",
        surprised: "惊讶",
      },
      barColors: {
        angry: "#E74C3C",
        disgusted: "#27AE60",
        fearful: "#9B59B6",
        happy: "#FFD700",
        neutral: "#95A5A6",
        sad: "#5C9CE6",
        surprised: "#F39C12",
      },
    }
  },
  computed: {
    rightBottomGroups() {
      return createRightBottomGroups(this.rightBottomData)

      return [
        {
          key: "psychologyData",
          name: "心理能力",
          data: this.rightBottomData.psychologyData,
          color: "#38BDF8",
        },
        {
          key: "positiveData",
          name: "正面情绪",
          data: this.rightBottomData.positiveData,
          color: "#34D399",
        },
        {
          key: "negativeData",
          name: "负面情绪",
          data: this.rightBottomData.negativeData,
          color: "#F87171",
        },
      ]
    },
  },
  mounted() {
    this.printPanelData(true)
  },
  beforeDestroy() {
    this.stopCamera()
  },
  methods: {
    getPanelRows(labels, values) {
      return buildPanelRows(labels, values)
    },
    getTrendHeight(value, data) {
      return getPanelTrendHeight(value, data)
    },
    updatePanelData(expressions) {
      Object.assign(this, createPanelDataFromExpressions(expressions))
      return
      this.rightTopData = [
        { value: satisfaction, name: "满足指数" },
        { value: relax, name: "放松指数" },
        { value: excitement, name: "兴奋指数" },
        { value: optimism, name: "乐观指数" },
        { value: confidence, name: "自信指数" },
      ]
    },
    resetPanelData() {
      Object.assign(this, createInitialPanelState())
    },
    printPanelData(force = false) {
      const now = Date.now()
      if (!force && now - this.lastPanelPrintAt < 1000) return
      this.lastPanelPrintAt = now
      console.log("EmotionDetector panel data", createPanelDataSnapshot(this))
    },
    async loadModels() {
      if (this.modelsLoaded) return

      this.loading = true
      this.error = ""

      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        this.modelsLoaded = true
      } catch (loadError) {
        this.error = "模型加载失败，请确认 public/models 中已放入所需模型文件。"
        throw loadError
      } finally {
        this.loading = false
      }
    },
    async startCamera() {
      try {
        await this.loadModels()

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
          audio: false,
        })

        const video = this.$refs.videoRef
        video.srcObject = stream

        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            if (video.play) video.play()
            resolve()
          }
        })

        this.cameraReady = true
        this.startDetection()
      } catch (startError) {
        console.error(startError)
        this.stopCamera()
        alert(this.error || "情绪识别启动失败，请检查模型文件和摄像头权限。")
      }
    },
    startDetection() {
      const video = this.$refs.videoRef
      const canvas = this.$refs.overlayCanvas
      if (!video || !canvas) return

      const displaySize = {
        width: video.videoWidth || video.clientWidth,
        height: video.videoHeight || video.clientHeight,
      }

      faceapi.matchDimensions(canvas, displaySize)

      const detectFrame = async () => {
        if (!this.cameraReady) return

        try {
          const detections = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions()

          const ctx = canvas.getContext("2d")
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          if (detections) {
            const resized = faceapi.resizeResults(detections, displaySize)

            if (resized.expressions) {
              this.expressions = { ...this.expressions, ...resized.expressions }
              this.emotionData = getEmotionInfo(resized.expressions)
              this.updatePanelData(resized.expressions)
              this.printPanelData()
              const compositeResult = this.compositeTracker.update(
                resized.expressions,
              )
              this.compositeScores = compositeResult.scores
              this.compositeEmotion = compositeResult.dominant
            }

            const drawBox = new faceapi.draw.DrawBox(resized.detection.box, {
              label: this.emotionData.label,
              boxColor: this.emotionData.color,
              lineWidth: 2,
            })
            drawBox.draw(canvas)
          }
        } catch (detectError) {
          this.error = "情绪识别运行异常，请刷新页面后重试。"
          console.error(detectError)
        }

        this.animationId = requestAnimationFrame(detectFrame)
      }

      detectFrame()
    },
    stopCamera() {
      this.cameraReady = false
      this.resetPanelData()
      const compositeResult = this.compositeTracker.reset()
      this.compositeScores = compositeResult.scores
      this.compositeEmotion = compositeResult.dominant

      if (this.animationId) {
        cancelAnimationFrame(this.animationId)
        this.animationId = null
      }

      const video = this.$refs.videoRef
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop())
        video.srcObject = null
      }

      const canvas = this.$refs.overlayCanvas
      const ctx = canvas && canvas.getContext && canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    },
  },
}
</script>

<style scoped>
.detector-container {
  width: 100%;
  min-height: 100%;
  margin: auto;
  padding: 36px 22px 22px;
  box-sizing: border-box;
  color: #e5e7eb;
}

.detector-workspace {
  width: min(1480px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(240px, 0.78fr) minmax(420px, 1.4fr) minmax(240px, 0.78fr);
  grid-template-rows: repeat(2, minmax(260px, auto));
  gap: 18px;
  align-items: stretch;
}

.camera-section {
  grid-column: 2;
  grid-row: 1 / span 2;
  align-self: center;
}

.camera-section,
.data-panel,
.result-panel {
  min-width: 0;
  overflow: hidden;
  background: #11161e;
  border: 1px solid #273142;
  border-radius: 8px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.28);
}

.data-panel {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.panel-left-top {
  grid-column: 1;
  grid-row: 1;
}

.panel-left-bottom {
  grid-column: 1;
  grid-row: 2;
}

.panel-right-top {
  grid-column: 3;
  grid-row: 1;
}

.panel-right-bottom {
  grid-column: 3;
  grid-row: 2;
}

.panel-title {
  padding-bottom: 10px;
  color: #f8fafc;
  border-bottom: 1px solid #273142;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.3;
}

.metric-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-list.compact {
  gap: 9px;
}

.metric-row {
  min-height: 28px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  color: #a9b3c1;
  background: #0d1219;
  border: 1px solid #223044;
  border-radius: 6px;
  font-size: 13px;
}

.metric-row strong {
  min-width: 28px;
  color: #7dd3fc;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.trend-group {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.trend-label {
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.trend-label span {
  color: #d7dee8;
  font-size: 13px;
  font-weight: 700;
}

.trend-label strong {
  color: #7f8b9d;
  font-size: 11px;
  line-height: 1.4;
  word-break: break-all;
}

.trend-bars {
  height: 42px;
  padding: 5px 7px;
  display: flex;
  align-items: flex-end;
  gap: 5px;
  background: #0d1219;
  border: 1px solid #223044;
  border-radius: 6px;
  box-sizing: border-box;
}

.trend-bar {
  flex: 1;
  min-width: 4px;
  border-radius: 3px 3px 0 0;
  opacity: 0.9;
}

.camera-toolbar {
  min-height: 62px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #273142;
  background: #151b24;
}

.camera-title-group {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.camera-title-group h2 {
  margin: 0;
  color: #f8fafc;
  font-size: 15px;
  line-height: 1.3;
}

.camera-title-group p {
  margin: 2px 0 0;
  color: #7f8b9d;
  font-size: 12px;
  line-height: 1.3;
}

.local-badge {
  flex: none;
  padding: 5px 8px;
  color: #9ca9ba;
  background: #0d1219;
  border: 1px solid #2d394a;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1;
}

.camera-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #05080c;
}

.camera-video,
.overlay-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: scaleX(-1);
}

.camera-video {
  display: block;
  object-fit: cover;
}

.camera-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  text-align: center;
  background: #080c12;
}

.placeholder-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  color: #cbd5e1;
  background: #151d28;
  border: 1px solid #303b4b;
  border-radius: 8px;
  font-size: 24px;
}

.placeholder-copy {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.placeholder-copy strong {
  color: #f1f5f9;
  font-size: 16px;
}

.placeholder-copy span {
  color: #7f8b9d;
  font-size: 12px;
  line-height: 1.5;
}

.btn-start {
  min-height: 40px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #101722;
  background: #e2e8f0;
  border: 1px solid #f8fafc;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.btn-start:hover {
  background: #ffffff;
  transform: translateY(-1px);
}

.btn-stop {
  position: absolute;
  right: 14px;
  top: 14px;
  z-index: 2;
  min-height: 34px;
  padding: 0 14px;
  color: #fee2e2;
  background: rgba(127, 29, 29, 0.82);
  border: 1px solid rgba(248, 113, 113, 0.72);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.btn-stop:hover {
  background: rgba(153, 27, 27, 0.94);
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 10px;
}

.camera-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  background: rgba(5, 8, 12, 0.94);
  gap: 14px;
  font-size: 13px;
  z-index: 3;
}

.spinner {
  width: 34px;
  height: 34px;
  border: 3px solid #273142;
  border-top-color: #e2e8f0;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.camera-footer {
  min-height: 44px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #94a3b8;
  background: #0d1219;
  border-top: 1px solid #273142;
  font-size: 12px;
}

.privacy-note {
  color: #64748b;
  text-align: right;
}

.result-panel {
  display: none;
  border-width: 1px;
  border-style: solid;
  transition: border-color 0.35s;
}

.emotion-header {
  min-height: 132px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  border-bottom: 1px solid #273142;
}

.section-kicker {
  color: #9ca9ba;
  font-size: 11px;
  font-weight: 700;
}

.emotion-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.emotion-label {
  color: #f8fafc;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.15;
}

.emotion-live {
  padding: 4px 7px;
  color: #b7c2d0;
  background: rgba(8, 12, 18, 0.45);
  border: 1px solid rgba(203, 213, 225, 0.16);
  border-radius: 4px;
  font-size: 11px;
}

.emotion-desc {
  color: #a9b3c1;
  font-size: 13px;
  line-height: 1.5;
}

.expression-section,
.composite-section,
.suggestions-section {
  padding: 18px 20px;
}

.composite-section,
.suggestions-section {
  border-top: 1px solid #273142;
}

.section-heading {
  margin-bottom: 14px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.section-heading h3 {
  margin: 0;
  color: #e5e7eb;
  font-size: 14px;
  line-height: 1.3;
}

.section-heading > span {
  color: #667386;
  font-size: 11px;
}

.expression-bars {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.expression-bar-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.bar-label {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #9ca9ba;
  font-size: 12px;
}

.bar-label strong {
  min-width: 36px;
  color: #d7dee8;
  font-weight: 700;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.bar-track {
  height: 7px;
  background: #252e3b;
  border-radius: 2px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  min-width: 0;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.composite-highlight {
  padding: 12px;
  background: #0d1219;
  border: 1px solid;
  border-radius: 6px;
}

.composite-highlight.inactive {
  border-color: #334155 !important;
}

.composite-highlight-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.composite-highlight-title strong {
  color: #e8edf5;
  font-size: 13px;
}

.composite-state-dot {
  width: 7px;
  height: 7px;
  flex: none;
  border-radius: 50%;
}

.composite-score {
  margin-left: auto;
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.composite-highlight p {
  margin: 7px 0 0 15px;
  color: #7f8b9d;
  font-size: 11px;
  line-height: 1.5;
}

.composite-grid {
  margin-top: 13px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 11px 14px;
}

.composite-item {
  min-width: 0;
}

.composite-item-label {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: #8f9bac;
  font-size: 11px;
}

.composite-item-label strong {
  color: #cbd5e1;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}

.composite-track {
  height: 5px;
  overflow: hidden;
  background: #252e3b;
  border-radius: 2px;
}

.composite-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.suggestion-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  color: #aab4c2;
  font-size: 12px;
  line-height: 1.55;
}

.suggestion-dot {
  width: 6px;
  height: 6px;
  margin-top: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.btn-action {
  width: calc(100% - 40px);
  min-height: 40px;
  margin: 0 20px 20px;
  padding: 0 14px;
  border-width: 1px;
  border-style: solid;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.2s, transform 0.2s;
}

.btn-action:hover {
  filter: brightness(1.18);
  transform: translateY(-1px);
}

.status-dot {
  width: 8px;
  height: 8px;
  flex: none;
  border-radius: 50%;
}

.status-dot.active {
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.12);
}

.status-dot.inactive {
  background: #64748b;
  box-shadow: 0 0 0 4px rgba(100, 116, 139, 0.12);
}

@media (max-width: 1120px) {
  .detector-workspace {
    grid-template-columns: minmax(220px, 1fr) minmax(360px, 1.35fr);
  }

  .camera-section {
    grid-column: 2;
    grid-row: 1 / span 4;
  }

  .panel-left-top,
  .panel-left-bottom,
  .panel-right-top,
  .panel-right-bottom {
    grid-column: 1;
  }

  .panel-left-top {
    grid-row: 1;
  }

  .panel-left-bottom {
    grid-row: 2;
  }

  .panel-right-top {
    grid-row: 3;
  }

  .panel-right-bottom {
    grid-row: 4;
  }
}

@media (max-width: 760px) {
  .detector-container {
    padding: 12px;
  }

  .detector-workspace {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: none;
    gap: 12px;
  }

  .camera-section,
  .panel-left-top,
  .panel-left-bottom,
  .panel-right-top,
  .panel-right-bottom {
    grid-column: 1;
    grid-row: auto;
  }

  .camera-section {
    order: -1;
  }
}

@media (max-width: 560px) {
  .detector-container {
    padding: 8px;
  }

  .detector-workspace {
    gap: 12px;
  }

  .camera-toolbar,
  .camera-footer {
    padding-right: 12px;
    padding-left: 12px;
  }

  .camera-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .privacy-note {
    text-align: left;
  }

  .emotion-header {
    min-height: 118px;
    padding: 16px;
  }

  .expression-section,
  .composite-section,
  .suggestions-section {
    padding: 16px;
  }

  .btn-action {
    width: calc(100% - 32px);
    margin: 0 16px 16px;
  }

  .placeholder-copy span {
    max-width: 240px;
  }
}

@media (max-width: 380px) {
  .composite-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
