import { reactive, ref } from 'vue'
import { getEmotionInfo } from './useEmotionData.js'

export const DEFAULT_MODEL_URL = '/models'

export const REQUIRED_MODEL_FILES = [
  'tiny_face_detector_model-shard1',
  'tiny_face_detector_model-weights_manifest.json',
  'face_expression_model-shard1',
  'face_expression_model-weights_manifest.json'
]

export function createInitialExpressions() {
  return {
    angry: 0,
    disgusted: 0,
    fearful: 0,
    happy: 0,
    neutral: 0,
    sad: 0,
    surprised: 0
  }
}

export function isLocalModelUrl(url) {
  return typeof url === 'string' && !/^(https?:)?\/\//i.test(url)
}

export function useEmotionRecognition(options = {}) {
  const modelUrl = options.modelUrl || DEFAULT_MODEL_URL
  if (!isLocalModelUrl(modelUrl)) {
    throw new Error('模型路径必须是本地路径，不能使用远程链接或 CDN。')
  }

  const videoConstraints = options.videoConstraints || {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode: 'user'
  }

  const expressions = reactive(createInitialExpressions())
  const emotionData = ref(getEmotionInfo(null))
  const cameraReady = ref(false)
  const loading = ref(false)
  const error = ref('')

  let faceapiClient = options.faceapi || null
  let modelsLoaded = false
  let animationId = null
  let currentVideo = null
  let currentCanvas = null

  async function getFaceApi() {
    if (faceapiClient) return faceapiClient
    faceapiClient = await import('face-api.js')
    return faceapiClient
  }

  async function loadModels() {
    if (modelsLoaded) return

    loading.value = true
    error.value = ''

    try {
      const faceapi = await getFaceApi()
      await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl)
      await faceapi.nets.faceExpressionNet.loadFromUri(modelUrl)
      modelsLoaded = true
    } catch (loadError) {
      error.value = '模型加载失败，请确认 public/models 中已放入所需模型文件。'
      throw loadError
    } finally {
      loading.value = false
    }
  }

  async function startCamera(videoElement, canvasElement) {
    if (!videoElement || !canvasElement) {
      throw new Error('启动识别需要传入 video 和 canvas 元素。')
    }

    await loadModels()

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false
      })

      currentVideo = videoElement
      currentCanvas = canvasElement
      currentVideo.srcObject = stream

      await new Promise((resolve) => {
        currentVideo.onloadedmetadata = () => {
          currentVideo.play?.()
          resolve()
        }
      })

      cameraReady.value = true
      startDetection()
    } catch (cameraError) {
      error.value = '无法访问摄像头，请检查浏览器权限设置。'
      stopCamera()
      throw cameraError
    }
  }

  function startDetection() {
    if (!currentVideo || !currentCanvas || !faceapiClient) return

    const displaySize = {
      width: currentVideo.videoWidth || currentVideo.clientWidth,
      height: currentVideo.videoHeight || currentVideo.clientHeight
    }

    faceapiClient.matchDimensions(currentCanvas, displaySize)

    async function detectFrame() {
      if (!cameraReady.value || !currentVideo || !currentCanvas) return

      try {
        const detections = await faceapiClient
          .detectSingleFace(currentVideo, new faceapiClient.TinyFaceDetectorOptions())
          .withFaceExpressions()

        const ctx = currentCanvas.getContext('2d')
        ctx.clearRect(0, 0, currentCanvas.width, currentCanvas.height)

        if (detections) {
          const resized = faceapiClient.resizeResults(detections, displaySize)

          if (resized.expressions) {
            Object.assign(expressions, resized.expressions)
            emotionData.value = getEmotionInfo(resized.expressions)
          }

          const box = resized.detection.box
          const drawBox = new faceapiClient.draw.DrawBox(box, {
            label: emotionData.value.label,
            boxColor: emotionData.value.color,
            lineWidth: 2
          })
          drawBox.draw(currentCanvas)
        }
      } catch (detectError) {
        error.value = '情绪识别运行异常，请刷新页面后重试。'
        console.error(detectError)
      }

      animationId = requestAnimationFrame(detectFrame)
    }

    detectFrame()
  }

  function stopCamera() {
    cameraReady.value = false

    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }

    if (currentVideo?.srcObject) {
      currentVideo.srcObject.getTracks().forEach((track) => track.stop())
      currentVideo.srcObject = null
    }

    const ctx = currentCanvas?.getContext?.('2d')
    if (ctx) {
      ctx.clearRect(0, 0, currentCanvas.width, currentCanvas.height)
    }

    currentVideo = null
    currentCanvas = null
  }

  return {
    cameraReady,
    loading,
    error,
    expressions,
    emotionData,
    loadModels,
    startCamera,
    stopCamera
  }
}
